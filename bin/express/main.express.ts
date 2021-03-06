
import express from "express";
import cookieParser from "cookie-parser";
import fs from "fs";

import * as http from 'http';

import httpProxy from "http-proxy";


import nodecache from "node-cache";
import { IRaccoltaPercorsi } from "./metodo/utility";
import { GetListaClasseMeta, SalvaListaMetaClasse } from "../metadata";
import { ExpressClasse, ListaExpressClasse } from "./classe.express";
import { ExpressMetodo } from "./metodo.express";
import { StartMonitoring } from "../utility";
import { ISpawTrigger } from "./utility/utility"
import { ITriggerPath, MetodoSpawProcess } from "./metodo/MetodoSpawProcess";
import { exec } from "child_process";
import { randomUUID } from "crypto";


export class MainExpress {

    static cache = new nodecache();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static proxyServer: any;
    static portaProxy = 8080;
    static portaProcesso = 8081;
    static triggerPath: ITriggerPath = { pathAccept: [], pathDecline: [], abilitato: false, pathScatenante: '' };
    static listaPathScatenanti: Array<any> = [];
    static vettoreProcessi: {
        porta: number,
        nomeVariabile: string,
        valoreValiabile: string,
        vettorePossibiliPosizioni: ISpawTrigger[],
        processo: any
    }[] = [];
    static pathExe = 'dist/index.js';
    static pathExeIIparte = ' --porta=';
    static isSottoProcesso = false;

    percorsi: IRaccoltaPercorsi;
    path: string;
    serverExpressDecorato: express.Express;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    httpServer: any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    httpProxy: any;

    constructor(path: string | 'localhost', server?: express.Express, isMultiProcesso?: boolean) {
        if (isMultiProcesso) {
            MainExpress.isSottoProcesso = isMultiProcesso;
        }
        this.path = path;
        this.percorsi = { pathGlobal: "", patheader: "", porta: 0 };
        if (server == undefined) this.serverExpressDecorato = express();
        else this.serverExpressDecorato = server;
    }
    DeterminaIfIsSottoProcesso() {
        let sottoprosotto = false;
        let porta = this.percorsi.porta;
        let pathTriggher = '';
        try {
            if (process.argv.length > 2) {
                try {
                    console.log(process.argv[2]);
                    const substr = String(process.argv[2]).substring(8, undefined);
                    pathTriggher = String(process.argv[3]).substring(11, undefined);
                    porta = Number(substr);
                    MainExpress.portaProcesso = porta;
                    if (pathTriggher) MainExpress.triggerPath.pathScatenante = pathTriggher;
                    sottoprosotto = true;
                } catch (error) {
                    console.log(error);
                }
            }
            else {
                return {
                    porta: undefined,
                    sottoprosotto: false
                }
            }
        } catch (error) {
            console.log(error);
        }
        return {
            porta: porta,
            sottoprosotto: sottoprosotto,
            pathTriggher: pathTriggher
        }
    }
    Inizializza(patheader: string, porta: number, pathDoveScrivereFile?: string, sottoprocesso?: boolean, abilitatoreTriggerPath?: boolean): void {
        const isSottoprocesso = this.DeterminaIfIsSottoProcesso();
        sottoprocesso = isSottoprocesso.sottoprosotto;
        porta = isSottoprocesso.porta ?? porta;
        if (abilitatoreTriggerPath != undefined) MainExpress.triggerPath.abilitato = abilitatoreTriggerPath;
        if (sottoprocesso) MainExpress.isSottoProcesso = sottoprocesso
        const tmp: ListaExpressClasse = GetListaClasseMeta<ListaExpressClasse>('nomeMetadataKeyTargetFor_Express', () => { return new ListaExpressClasse(); });
        console.log('');
        if (tmp.length > 0) {
            this.percorsi.patheader = patheader;
            this.percorsi.porta = porta;
            const pathGlobal = '/' + this.path;
            this.percorsi.pathGlobal = pathGlobal;

            (this.serverExpressDecorato).use(express.json());
            (this.serverExpressDecorato).use(cookieParser());
            //tmp.ConfiguraListaRotte(this.percorsi);
            tmp.ConfiguraPathRotte(this.percorsi);
            tmp.EstraiPath();
            tmp.ConfiguraListaRotteApplicazione(this.serverExpressDecorato);
            

            this.httpServer = http.createServer(this.serverExpressDecorato);

            SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Express', tmp);

            if (pathDoveScrivereFile)
                this.ScriviFile(pathDoveScrivereFile);
        }
        else {
            console.log("Attenzione non vi sono rotte e quantaltro.");
        }
    }
    InizializzaTriggerPath() {

    }

    ScriviFile(pathDoveScrivereFile: string): string {
        try {

            const tmp = GetListaClasseMeta<ListaExpressClasse>('nomeMetadataKeyTargetFor_Express', () => { return new ListaExpressClasse(); });
            try {
                fs.rmSync(pathDoveScrivereFile + '/FileGenerati_MP/express', { recursive: true });
            } catch (error) {
                console.log(error);
            }
            fs.mkdirSync(pathDoveScrivereFile + '/FileGenerati_MP/express', { recursive: true });

            let ritorno = '';

            try {
                for (let index = 0; index < tmp.length; index++) {
                    const classe = <ExpressClasse>tmp[index];
                    const path = pathDoveScrivereFile + '/FileGenerati_MP/express' + '/api' + '/' + classe.nomeOriginale;

                    fs.mkdirSync(path, { recursive: true });
                    let ritornoClass = '';
                    if (classe.Istanziatore) ritornoClass = ritornoClass + '\nIstanziatore : ' + classe.Istanziatore;
                    if (classe.LogGenerale) ritornoClass = ritornoClass + '\nLogGenerale : ' + classe.LogGenerale;
                    if (classe.cacheOptionMemory) ritornoClass = ritornoClass + '\ncacheOptionMemory : ' + JSON.stringify(classe.cacheOptionMemory);
                    if (classe.html) ritornoClass = ritornoClass + '\nhtml : ' + JSON.stringify(classe.html);
                    if (classe.id) ritornoClass = ritornoClass + '\nid : ' + classe.id;
                    if (classe.nome) ritornoClass = ritornoClass + '\nnome : ' + classe.nome;
                    if (classe.nomeOriginale) ritornoClass = ritornoClass + '\nnomeOriginale : ' + classe.nomeOriginale;
                    if (classe.nomeVariante) ritornoClass = ritornoClass + '\nnomeVariante : ' + classe.nomeVariante;
                    if (classe.path) ritornoClass = ritornoClass + '\npath : ' + classe.path;
                    if (classe.percorsi) ritornoClass = ritornoClass + '\npercorsi : ' + JSON.stringify(classe.percorsi);
                    if (classe.rotte) ritornoClass = ritornoClass + '\nrotte : ' + classe.rotte;
                    //fs.writeFileSync(path + '/' + classe.nomeOriginale + '.classe', ritornoClass);
                    fs.appendFileSync(path + '/' + classe.nomeOriginale + '.classe', ritornoClass);
                    ritornoClass = ritornoClass + '\n';
                    for (let index = 0; index < classe.listaMetodi.length; index++) {
                        const metodo = classe.listaMetodi[index];
                        let ritorno = '';
                        ritorno = ritorno + '' + (<ExpressMetodo>metodo).PrintStruttura() + '';
                        ritornoClass = ritornoClass + ritorno + '\n********************\n';
                        fs.writeFileSync(path + '/' + metodo.nomeOriginale, ritorno);
                    }
                    //fs.writeFileSync(path + '/' + classe.nomeOriginale + '.collezione', ritornoClass);
                    fs.appendFileSync(path + '/' + classe.nomeOriginale + '.collezione', ritornoClass);
                }
            } catch (error) {
                return ritorno;
            }
            ritorno = '';
            return ritorno;
        } catch (error: any | Error) {
            console.log(error);
            return error.message ?? '';
        }
    }
    InizializzaCartellaFileLogProxy() {
        try {
            /**log proxy */
            if (!fs.existsSync('./LogExpress/LogProxy_' + MainExpress.portaProxy)) {
                fs.mkdirSync('./LogExpress/LogProxy_' + MainExpress.portaProxy, { recursive: true });
            }
            //fs.writeFileSync('./LogExpress/LogProxy_' + MainExpress.portaProcesso + '/log.txt', '');
            fs.writeFileSync('./LogExpress/LogProxy_' + MainExpress.portaProxy + '/log.txt', '');
        } catch (error) {
            console.log(error);
        }
    }
    InizializzaCartelleFileLogExpress() {
        try {
            /**log processi express */
            if (!fs.existsSync('./LogExpress')) {
                fs.mkdirSync('./LogExpress', { recursive: true });
            }
            if (!fs.existsSync('./LogExpress/Processo_' + MainExpress.portaProcesso)) {
                fs.mkdirSync('./LogExpress/Processo_' + MainExpress.portaProcesso, { recursive: true });
            }
            //fs.writeFileSync('./LogExpress/Processo_' + MainExpress.portaProcesso + '/log.txt', '');
            fs.writeFileSync('./LogExpress/Processo_' + MainExpress.portaProcesso + '/log.txt', '');
        } catch (error) {
            console.log(error);
        }
    }
    StartHttpServer(): void {
        this.InizializzaCartelleFileLogExpress();
        try {
            if (MainExpress.vettoreProcessi.length > 0) {
                /* qui non arrivero mai! Perche il processo che viene avviato ?? un processo figlio, 
                questo vuol dire che sara con una porta gia definita */
                let resto = true;
                let tmp = this.percorsi.porta + parseInt((Math.random() * (Math.random() * 10)).toString());
                while (resto) {
                    if (tmp > 9999) tmp = 5000;
                    let esco = false;
                    tmp = tmp + parseInt((Math.random() * (Math.random() * 10)).toString());
                    for (let index = 0; index < MainExpress.vettoreProcessi.length && esco == false; index++) {
                        const element = MainExpress.vettoreProcessi[index];
                        if (element.porta == tmp) {
                            esco = true;
                        }
                    }
                    if (esco == false)
                        resto = false;
                }
                this.percorsi.porta = tmp;
                this.httpServer.listen(this.percorsi.porta);
                StartMonitoring();
            }
            else {
                if (MainExpress.isSottoProcesso == true) {
                    this.httpServer.listen(this.percorsi.porta);
                } else {
                    this.InizializzaCartellaFileLogProxy();
                    if (!fs.existsSync('./LogExpress/LogProxy_' + MainExpress.portaProxy)) {
                        fs.mkdirSync('./LogExpress/LogProxy_' + MainExpress.portaProxy, { recursive: true });
                    }
                    //fs.writeFileSync('./LogExpress/LogProxy_' + MainExpress.portaProxy + '/log.txt', '');
                    fs.writeFileSync('./LogExpress/LogProxy_' + MainExpress.portaProxy + '/log.txt', '');

                    MainExpress.portaProxy = this.percorsi.porta;
                    MainExpress.portaProcesso = this.percorsi.porta + 1;
                    this.httpServer.listen(MainExpress.portaProcesso);
                    StartMonitoring();
                    /*  */
                    const proxy = httpProxy.createProxyServer();
                    //httpProxy.createProxyServer({ target: 'http://localhost:3001' }).listen(3333);

                    MainExpress.proxyServer = http.createServer(function (req, res) {
                        // You can define here your custom logic to handle the request
                        // and then proxy the request.
                        // const variabileValore = '1';
                        let esco = false;
                        let stamp = '';
                        for (let index = 0; index < MainExpress.vettoreProcessi.length && esco == false; index++) {
                            const processo = MainExpress.vettoreProcessi[index];

                            processo.vettorePossibiliPosizioni;
                            //devo estrarre il dato per poterlo verificare con la variabile
                            for (let index = 0; index < processo.vettorePossibiliPosizioni.length && esco == false; index++) {
                                const element = processo.vettorePossibiliPosizioni[index];
                                /** si cerca solo nell'header perche siamo nel proxy, questo puo solo maneggiare l'header per semplicita e velocita */
                                if (req.headers[element.nome] != undefined && element.posizione == 'header') {
                                    if (processo.valoreValiabile == req.headers[element.nome]) {
                                        res.setHeader("proxy", "->http://localhost:" + processo.porta);
                                        proxy.web(req, res, { target: 'http://localhost:' + processo.porta });
                                        stamp = `
                                        <!--################
                                        proxy->http://localhost: ${processo.porta}                                        
                                        ################--!>
                                        `;
                                        esco = true;
                                    }
                                }
                            }
                        }
                        if (esco == false) {
                            res.setHeader("proxy", "->http://localhost:" + MainExpress.portaProcesso);
                            proxy.web(req, res, { target: 'http://localhost:' + MainExpress.portaProcesso });
                            stamp = `
                            <!--################
                            proxy->http://localhost: ${MainExpress.portaProcesso}   
                            ################--!>
                            `;
                        }
                        try {
                            fs.appendFileSync('./LogExpress/LogProxy_' + MainExpress.portaProxy + '/' + 'log.txt', stamp);
                        } catch (error) {
                            console.log(error);
                        }
                    });
                    MainExpress.proxyServer.listen(MainExpress.portaProxy);
                    /*  */
                }
            }
        } catch (error) {
            if (MainExpress.vettoreProcessi.length > 0) {
                let resto = true;
                let tmp = this.percorsi.porta + parseInt((Math.random() * (Math.random() * 10)).toString());
                while (resto) {
                    if (tmp > 9999) tmp = 5000;
                    let esco = false;
                    tmp = tmp + parseInt((Math.random() * (Math.random() * 10)).toString());
                    for (let index = 0; index < MainExpress.vettoreProcessi.length && esco == false; index++) {
                        const element = MainExpress.vettoreProcessi[index];
                        if (element.porta == tmp) {
                            esco = true;
                        }
                    }
                    if (esco == false)
                        resto = false;
                }
                this.percorsi.porta = tmp;
                this.httpServer.listen(this.percorsi.porta);
                StartMonitoring();
            }
            else {
                throw error;
            }
        }
    }
    AggiungiCartellaStaticaPerExpress(path: string) {
        this.serverExpressDecorato.use(express.static(path));
    }
    static AggiungiProcessoParallelo(metodoSpawProcess: MetodoSpawProcess, valoreValiabile: string, porta: number, pathScatenante: string) {
        try {
            if (MainExpress.vettoreProcessi.length > 0) {
                if ('porta' in MainExpress.vettoreProcessi[MainExpress.vettoreProcessi.length - 1])
                    porta = MainExpress.vettoreProcessi[MainExpress.vettoreProcessi.length - 1].porta + 1;
            }
            if (MainExpress.vettoreProcessi.length == 0) {
                porta = porta + (Math.random() * 100 + 30) +
                    (
                        (Math.random() * 10 * Math.random() * 20 * Math.random() * 30) +
                        (Math.random() * 10 * Math.random() * 20 * Math.random() * 30) -
                        (Math.random() * 10 * Math.random() * 20 * Math.random() * 10) +
                        (Math.random() * 10 * Math.random() * 20 * Math.random() * 30) -
                        (Math.random() * 10 * Math.random() * 20 * Math.random() * 5)
                    );
            }
        } catch (error) {
            porta = porta + (Math.random() * 100 + 30) +
                (
                    (Math.random() * 10 * Math.random() * 20 * Math.random() * 30) +
                    (Math.random() * 10 * Math.random() * 20 * Math.random() * 30) -
                    (Math.random() * 10 * Math.random() * 20 * Math.random() * 10) +
                    (Math.random() * 10 * Math.random() * 20 * Math.random() * 30) -
                    (Math.random() * 10 * Math.random() * 20 * Math.random() * 5)
                );
        }
        try {

            porta = Number(porta.toFixed(0));
            const temporaneamente = `node ./${MainExpress.pathExe}`;
            console.log(temporaneamente);
            const proc = exec(`node ./${MainExpress.pathExe}${MainExpress.pathExeIIparte}${porta} --pathexec=${pathScatenante}`); //exec(`npm run start-esempio`);
            MainExpress.vettoreProcessi.push({
                porta: porta,
                nomeVariabile: metodoSpawProcess.isSpawTrigger ?? String(randomUUID()),
                valoreValiabile: valoreValiabile,
                vettorePossibiliPosizioni: metodoSpawProcess.checkSpawTrigger ?? [],
                processo: proc
            });

        } catch (error) {
            console.log(error);
        }

    }
    static TrovaInTriggerPath(item: string) {
        for (let index = 0; index < MainExpress.triggerPath.pathAccept.length; index++) {
            const element = MainExpress.triggerPath.pathAccept[index];
            if (item.length >= element.length) {
                const tmp = item.substring(0, element.length);
                const t1 = tmp == element;
                console.log(t1);
                if (tmp == element) {
                    return true;
                }
            }
        }
        return false;
    }
}

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
import { ISpawTrigger } from "./utility/utility";



export class MainExpress {

    static cache = new nodecache();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static proxyServer: any;
    static portaProxy = 8080;
    static portaProcesso = 8081;
    static vettoreProcessi: {
        porta: number,
        nomeVariabile: string,
        valoreValiabile: string,
        vettorePossibiliPosizioni: ISpawTrigger[],
        processo: any
    }[] = [];
    static pathExe = './dist/index-esempio.js --porta=';
    static isSottoProcesso = false;

    /* isMultiProcesso = false; */
    percorsi: IRaccoltaPercorsi;
    path: string;
    serverExpressDecorato: express.Express;
    /* listaTerminaleClassi: ListaExpressClasse; */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    httpServer: any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    httpProxy: any;

    constructor(path: string | 'localhost', server?: express.Express, isMultiProcesso?: boolean) {
        if (isMultiProcesso) {
            MainExpress.isSottoProcesso = isMultiProcesso;
            //this.isMultiProcesso = isMultiProcesso;
        }
        this.path = path;
        this.percorsi = { pathGlobal: "", patheader: "", porta: 0 };
        if (server == undefined) this.serverExpressDecorato = express();
        else this.serverExpressDecorato = server;
    }
    DeterminaIfIsSottoProcesso() {
        let sottoprosotto = false;
        let porta = this.percorsi.porta;
        try {
            if (process.argv.length > 2) {
                try {
                    console.log(process.argv[2]);
                    const substr = String(process.argv[2]).substring(8, undefined);
                    porta = Number(substr);
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
            sottoprosotto: sottoprosotto
        }
    }
    Inizializza(patheader: string, porta: number, /* rottaBase: boolean, creaFile?: boolean, */
        pathDoveScrivereFile?: string, sottoprocesso?: boolean): void {
        const isSottoprocesso = this.DeterminaIfIsSottoProcesso();
        sottoprocesso = isSottoprocesso.sottoprosotto;
        porta = isSottoprocesso.porta ?? porta;
        //const tmp: ListaTerminaleClasse = Reflect.getMetadata(ListaTerminaleClasse.nomeMetadataKeyTarget, targetTerminale);
        if (sottoprocesso) MainExpress.isSottoProcesso = sottoprocesso
        const tmp: ListaExpressClasse = GetListaClasseMeta<ListaExpressClasse>('nomeMetadataKeyTargetFor_Express');
        console.log('');
        if (tmp.length > 0) {
            this.percorsi.patheader = patheader;
            this.percorsi.porta = porta;
            const pathGlobal = '/' + this.path;
            this.percorsi.pathGlobal = pathGlobal;

            (this.serverExpressDecorato).use(express.json());
            (this.serverExpressDecorato).use(cookieParser());

            tmp.ConfiguraListaRotteApplicazione(this.path, this.percorsi, this.serverExpressDecorato);

            this.httpServer = http.createServer(this.serverExpressDecorato);

            SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Express', tmp);

            if (pathDoveScrivereFile)
                this.ScriviFile(pathDoveScrivereFile);
        }
        else {
            console.log("Attenzione non vi sono rotte e quantaltro.");
        }

        //const list = GetListaClasseMetaData();
        console.log('');
    }

    ScriviFile(pathDoveScrivereFile: string): string {
        const tmp = GetListaClasseMeta<ListaExpressClasse>('nomeMetadataKeyTargetFor_Express');

        fs.rmdirSync(pathDoveScrivereFile + '/FileGenerati_MP', { recursive: true });
        fs.mkdirSync(pathDoveScrivereFile + '/FileGenerati_MP', { recursive: true });

        let ritorno = '';
        /* try {
            let swaggerClassePath = '';
            for (let index = 0; index < tmp.length; index++) {
                const element = tmp[index];
                const tmp = element.SettaSwagger();
                if (index > 0 && tmp != undefined && tmp != undefined && tmp != '')
                    swaggerClassePath = swaggerClassePath + ', ';
                if (tmp != undefined && tmp != undefined && tmp != '')
                    swaggerClassePath = swaggerClassePath + tmp;
            }
            ritorno = ` {
            "openapi": "3.0.0",
            "servers": [
                {
                    "url": "https://staisicuro.medicaltech.it/",
                    "variables": {},
                    "description": "indirizzo principale"
                },
                {
                    "url": "http://ss-test.medicaltech.it/",
                    "description": "indirizzo secondario nel caso quello principale non dovesse funzionare."
                }
            ],
            "info": {
                "description": "Documentazione delle API con le quali interrogare il server dell'applicazione STAI sicuro, per il momento qui troverai solo le api con le quali interfacciarti alla parte relativa al paziente.Se vi sono problemi sollevare degli issues o problemi sulla pagina di github oppure scrivere direttamente una email.",
                "version": "1.0.0",
                "title": "STAI sicuro",
                "termsOfService": "https://github.com/MedicaltechTM/STAI_sicuro"
            },
            "tags": [],
            "paths": {
                ${swaggerClassePath}
            },
            "externalDocs": {
                "description": "Per il momento non vi sono documentazione esterne.",
                "url": "-"
            },
            "components": {
                "schemas": {},
                "securitySchemes": {},
                "links": {},
                "callbacks": {}                
            },
            "security": []
        }`;
        } catch (error) {
            return ritorno;
        }
        fs.writeFileSync(pathDoveScrivereFile + '/FileGenerati_MP' + '/swagger', ritorno); */

        try {
            for (let index = 0; index < tmp.length; index++) {
                const classe = <ExpressClasse>tmp[index];
                const path = pathDoveScrivereFile + '/FileGenerati_MP' + '/api' + '/' + classe.nomeOriginale;

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
                fs.writeFileSync(path + '/' + classe.nomeOriginale + '.classe', ritornoClass);
                ritornoClass = ritornoClass +'\n';
                for (let index = 0; index < classe.listaMetodi.length; index++) {
                    const metodo = classe.listaMetodi[index];
                    let ritorno = '';
                    ritorno = ritorno + '' + (<ExpressMetodo>metodo).PrintStruttura() + '';
                    ritornoClass = ritornoClass + ritorno + '\n********************\n';
                    fs.writeFileSync(path + '/' + metodo.nomeOriginale, ritorno);
                }
                fs.writeFileSync(path + '/' + classe.nomeOriginale + '.collezione', ritornoClass);
            }
        } catch (error) {
            return ritorno;
        }
        ritorno = '';
        return ritorno;
    }
    StartHttpServer(): void {
        try {
            if (MainExpress.vettoreProcessi.length > 0) {
                /* qui non arrivero mai! Perche il processo che viene avviato è un processo figlio, 
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
                        for (let index = 0; index < MainExpress.vettoreProcessi.length && esco == false; index++) {
                            const processo = MainExpress.vettoreProcessi[index];

                            processo.vettorePossibiliPosizioni;
                            /*  */
                            //devo estrarre il dato per poterlo verificare con la variabile
                            let ritorno: string | string[] | undefined = undefined;

                            for (let index = 0; index < processo.vettorePossibiliPosizioni.length && esco == false; index++) {
                                const element = processo.vettorePossibiliPosizioni[index];
                                /* if (richiesta..body[element.nome] != undefined && element.posizione == 'body') {
                                    tmp = richiesta.body[element.nome];
                                }
                                else if (richiesta.query[element.nome] != undefined && element.posizione == 'query') {
                                    tmp = richiesta.query[element.nome];
                                }
                                else */ if (req.headers[element.nome] != undefined && element.posizione == 'header') {
                                    ritorno = req.headers[element.nome];
                                    if (processo.valoreValiabile == req.headers[element.nome]) {
                                        res.setHeader("proxy", "->http://localhost:" + processo.porta);
                                        proxy.web(req, res, { target: 'http://localhost:' + processo.porta });
                                        esco = true;
                                    }
                                }
                            }
                            console.log(ritorno);
                            /*  */

                            /* if (element.valoreValiabile == variabileValore) {
                                res.setHeader("proxy", "->http://localhost:" + element.porta);
                                proxy.web(req, res, { target: 'http://localhost:' + element.porta });
                                esco = true;
                            } */
                        }
                        if (esco == false) {
                            res.setHeader("proxy", "->http://localhost:" + MainExpress.portaProcesso);
                            proxy.web(req, res, { target: 'http://localhost:' + MainExpress.portaProcesso });
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
}
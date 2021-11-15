

import slowDown from "express-slow-down";
import rateLimit from "express-rate-limit";

import helmet from "helmet";
import cors from 'cors';

import { Request, Response } from "express";

import fs from 'fs';
import { IMetaMetodo, ListaMetadataMetodo, MetadataMetodo } from "../metadata/metodo.metadata";
import { ICache } from "../main/main";
import { exec } from "child_process";
import { ExpressParametro, ListaExpressParametro } from "./parametro.express";
import { IMetodoParametri, MetodoParametri } from "./metodo/MetodoParametri";
import { IMetodoVettori, MetodoVettori } from "./metodo/MetodoVettori";
import { IMetodoEventi, MetodoEventi } from "./metodo/MetodoEventi";
import { IMetodoLimitazioni, MetodoLimitazioni } from "./metodo/MetodoLimitazioni";
import { IReturn, CalcolaChiaveMemoryCache, InizializzaLogbaseIn, Rispondi, ConstruisciErrore, IRitornoValidatore, InizializzaLogbaseOut, IsJsonString, IParametriEstratti, SostituisciRicorsivo } from "./utility/utility";
import { IRaccoltaPercorsi } from "./metodo/utility";
import { ErroreMio } from "./utility/ErroreMio";
import { MainExpress } from "./main.express";


export interface IExpressMetodo extends IMetaMetodo {
    metodoEventi?: IMetodoEventi;
    metodoParametri?: IMetodoParametri;
    metodoLimitazioni?: IMetodoLimitazioni;
    metodoVettori?: IMetodoVettori;
}

export class ExpressMetodo extends MetadataMetodo implements IExpressMetodo {

    metodoEventi: MetodoEventi = new MetodoEventi();
    metodoParametri: MetodoParametri = new MetodoParametri();
    metodoLimitazioni: MetodoLimitazioni = new MetodoLimitazioni();
    metodoVettori: MetodoVettori = new MetodoVettori();

    constructor(item: IExpressMetodo) {
        super(item);
        this.listaParametri = new ListaExpressParametro();
        if (item.metodoEventi)
            this.metodoEventi.Init(item.metodoEventi);
        if (item.metodoParametri)
            this.metodoParametri.Init(item.metodoParametri);
        else
            this.metodoParametri.Init({ path: this.nomeVariante });
        if (item.metodoLimitazioni)
            this.metodoLimitazioni.Init(item.metodoLimitazioni);
        if (item.metodoVettori)
            this.metodoVettori.Init(item.metodoVettori);
    }
    Init(item: ExpressMetodo) {
        /* this.metodoParametri.path = item.nomeVariante; */
        if (item.listaParametri != undefined)
            this.listaParametri = item.listaParametri;
        if (item.metodoAvviabile)
            this.metodoAvviabile = item.metodoAvviabile;
        this.metodoEventi.Init(item.metodoEventi);
        this.metodoParametri.Init(item.metodoParametri);
        this.metodoLimitazioni.Init(item.metodoLimitazioni);
        this.metodoVettori.Init(item.metodoVettori);
    }
    Mergia(item: ExpressMetodo) {
        super.Mergia(item);
        if (item.listaParametri != undefined && this.listaParametri != undefined)
            this.listaParametri.Mergia(item.listaParametri);
        if (item.metodoAvviabile)
            this.metodoAvviabile = item.metodoAvviabile;
        this.metodoEventi.Init(item.metodoEventi);
        this.metodoParametri.Init(item.metodoParametri);
        this.metodoLimitazioni.Init(item.metodoLimitazioni);
        this.metodoVettori.Init(item.metodoVettori);
    }
    GetThis() { return this; }


    ConfiguraRottaApplicazione(app: any, percorsi: IRaccoltaPercorsi) {
        this.metodoParametri.percorsi.patheader = percorsi.patheader;
        this.metodoParametri.percorsi.porta = percorsi.porta;

        /*  */
        //const pathGlobal = percorsi.pathGlobal + '/' + this.path;
        //this.percorsi.pathGlobal = pathGlobal;

        const pathGlobalTmp = percorsi.pathGlobal;
        const pathGlobal = percorsi.pathGlobal + '/' + this.metodoParametri.path;
        this.metodoParametri.percorsi.pathGlobal = pathGlobal;
        /*  */

        const middlew: any[] = [];
        /* this.middleware.forEach(element => {
            if (element instanceof ExpressMetodo) {
                const listaMidd = GetListaMiddlewareMetaData();
                const midd = listaMidd.CercaConNomeSeNoAggiungi(element.nome.toString());
                middlew.push(midd.ConvertiInMiddleare());
            }
        }); */

        let percorsoTmp = '';
        /*  */

        /* if (this.percorsoIndipendente) percorsoTmp = '/' + this.path;
        else percorsoTmp = this.percorsi.pathGlobal + '/' + this.path; */
        if (this.metodoParametri.percorsoIndipendente) {
            percorsoTmp = '/' + this.metodoParametri.path;
            this.metodoParametri.percorsi.pathGlobal = percorsoTmp;
        }
        else {
            percorsoTmp = this.metodoParametri.percorsi.pathGlobal;
        }
        /*  */

        if (this.metodoAvviabile != undefined) {
            this.ConfiguraRotteSwitch(app, percorsoTmp, middlew);
        }

        if (this.metodoVettori.listaHtml) {
            percorsoTmp = '';
            for (let index = 0; index < this.metodoVettori.listaHtml.length; index++) {
                const element = this.metodoVettori.listaHtml[index];
                if (element.percorsoIndipendente) percorsoTmp = '/' + element.path;
                else percorsoTmp = pathGlobalTmp + '/' + element.path;

                if (this.metodoAvviabile != undefined) {
                    this.ConfiguraRotteHtml(app, percorsoTmp, element.contenuto);
                }
            }

        }

    }

    ConfiguraRotteHtml(app: any, percorsoTmp: string, contenuto: string) {
        (<IReturn>this.metodoAvviabile).body;
        let corsOptions = {};
        corsOptions = {
            methods: 'GET',
        }
        if (this.metodoLimitazioni.cors == undefined) {
            this.metodoLimitazioni.cors = cors(corsOptions);
        }
        if (this.metodoLimitazioni.helmet == undefined) {
            this.metodoLimitazioni.helmet = helmet();
        }
        app.get(percorsoTmp,
            /* this.cors,
            this.helmet, */
            async (req: Request, res: Response) => {
                if (this.metodoVettori.listaHtml)
                    res.send(contenuto);
                else
                    res.sendStatus(404);
            });
    }

    PrintStruttura(): string {
        let parametri = "";
        for (let index = 0; index < this.listaParametri.length; index++) {
            const element = <ExpressParametro>this.listaParametri[index];
            parametri = parametri + element.PrintStruttura() + '\n';
        }
        if (this.metodoEventi) parametri = parametri + this.metodoEventi.PrintStruttura();
        if (this.metodoParametri) parametri = parametri + this.metodoParametri.PrintStruttura();
        if (this.metodoLimitazioni) parametri = parametri + this.metodoLimitazioni.PrintStruttura();
        if (this.metodoVettori) parametri = parametri + this.metodoVettori.PrintStruttura();

        const tmp = this.nomeVariante + ' | ' + this.metodoParametri.percorsi.pathGlobal + '\n' + parametri + '\n' + 'metodo : \n' + this.metodoAvviabile;
        ////console.log(tmp);
        return tmp;
    }

    ConfiguraRotteSwitch(app: any, percorsoTmp: string, middlew: any[]) {

        let corsOptions = {};
        const apiRateLimiter = rateLimit(this.metodoLimitazioni.rate_limit);
        const apiSpeedLimiter = slowDown(this.metodoLimitazioni.slow_down);

        if (this.metodoLimitazioni.isSpawTrigger && MainExpress.isSottoProcesso == true) {
            //
            (<IReturn>this.metodoAvviabile).body;
            corsOptions = {
                methods: 'GET',
            }
            if (this.metodoLimitazioni.cors == undefined) {
                this.metodoLimitazioni.cors = cors(corsOptions);
            }
            if (this.metodoLimitazioni.helmet == undefined) {
                this.metodoLimitazioni.helmet = helmet();
            }
            app.get(percorsoTmp,
                this.metodoLimitazioni.cors,
                this.metodoLimitazioni.helmet,
                middlew,
                //cacheMiddleware.route(this.cacheOptionRedis ?? <OptionsCache>{ expire: 1 , client: redisClient }),
                apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                async (req: Request, res: Response) => {
                    //console.log("GET");
                    res.statusCode = 999;
                    res.send({
                        dalleFondamentaConFurore: 'Hei? sei molto in basso ma non puoi scavare piu di cosi! Sei sicuro di stare ad andare nella direzione giusta?'
                    });
                });
        }
        else {
            //
            //const csrfProtection = csrf({ cookie: true }) 
            switch (this.metodoParametri.tipo) {
                case 'get':
                    (<IReturn>this.metodoAvviabile).body;
                    corsOptions = {
                        methods: 'GET',
                    }
                    if (this.metodoLimitazioni.cors == undefined) {
                        this.metodoLimitazioni.cors = cors(corsOptions);
                    }
                    if (this.metodoLimitazioni.helmet == undefined) {
                        this.metodoLimitazioni.helmet = helmet();
                    }
                    app.get(percorsoTmp,
                        this.metodoLimitazioni.cors,
                        this.metodoLimitazioni.helmet,
                        middlew,
                        //cacheMiddleware.route(this.metodoLimitazioni.cacheOptionRedis ?? <OptionsCache>{ expire: 1 , client: redisClient }),
                        apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                        async (req: Request, res: Response) => {
                            //console.log("GET");
                            await this.ChiamataGenerica(req, res);
                        });
                    break;
                case 'post':
                    corsOptions = {
                        methods: 'POST'
                    }
                    if (this.metodoLimitazioni.helmet == undefined) {
                        this.metodoLimitazioni.helmet = helmet();
                    }
                    if (this.metodoLimitazioni.cors == undefined) {
                        this.metodoLimitazioni.cors = cors(corsOptions);
                    }
                    app.post(percorsoTmp,
                        this.metodoLimitazioni.cors,
                        this.metodoLimitazioni.helmet,
                        middlew,
                        //cacheMiddleware.route(this.metodoLimitazioni.cacheOptionRedis ?? <OptionsCache>{ expire: 1 /* secondi */, client: redisClient }),
                        apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                        async (req: Request, res: Response) => {
                            //console.log("POST");
                            await this.ChiamataGenerica(req, res);
                        });
                    break;
                case 'delete':
                    corsOptions = {
                        methods: "DELETE"
                    }
                    if (this.metodoLimitazioni.helmet == undefined) {
                        this.metodoLimitazioni.helmet = helmet();
                    }
                    if (this.metodoLimitazioni.cors == undefined) {
                        this.metodoLimitazioni.cors = cors(corsOptions);
                    }
                    app.delete(percorsoTmp,
                        this.metodoLimitazioni.cors,
                        this.metodoLimitazioni.helmet,
                        middlew,
                        //cacheMiddleware.route(this.metodoLimitazioni.cacheOptionRedis ?? <OptionsCache>{ expire: 1 /* secondi */, client: redisClient }),
                        apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                        async (req: Request, res: Response) => {
                            //console.log("DELETE");
                            await this.ChiamataGenerica(req, res);
                        });
                    break;
                case 'patch':
                    corsOptions = {
                        methods: "PATCH"
                    };
                    if (this.metodoLimitazioni.helmet == undefined) {
                        this.metodoLimitazioni.helmet = helmet();
                    }
                    if (this.metodoLimitazioni.cors == undefined) {
                        this.metodoLimitazioni.cors = cors(corsOptions);
                    }
                    app.patch(percorsoTmp,
                        this.metodoLimitazioni.cors,
                        this.metodoLimitazioni.helmet,
                        middlew,
                        //cacheMiddleware.route(this.metodoLimitazioni.cacheOptionRedis ?? <OptionsCache>{ expire: 1 /* secondi */, client: redisClient }),
                        apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                        async (req: Request, res: Response) => {
                            //console.log("PATCH");
                            await this.ChiamataGenerica(req, res);
                        });
                    break;
                case 'purge':
                    corsOptions = {
                        methods: "PURGE"
                    };
                    if (this.metodoLimitazioni.helmet == undefined) {
                        this.metodoLimitazioni.helmet = helmet();
                    }
                    if (this.metodoLimitazioni.cors == undefined) {
                        this.metodoLimitazioni.cors = cors(corsOptions);
                    }
                    app.purge(percorsoTmp,
                        this.metodoLimitazioni.cors,
                        this.metodoLimitazioni.helmet,
                        middlew,
                        //cacheMiddleware.route(this.metodoLimitazioni.cacheOptionRedis ?? <OptionsCache>{ expire: 1 /* secondi */, client: redisClient }),
                        apiRateLimiter, apiSpeedLimiter,/*csrfProtection,*/
                        async (req: Request, res: Response) => {
                            //console.log("PURGE");
                            await this.ChiamataGenerica(req, res);
                        });
                    break;
                case 'put':
                    corsOptions = {
                        methods: "PUT"
                    };
                    if (this.metodoLimitazioni.helmet == undefined) {
                        this.metodoLimitazioni.helmet = helmet();
                    }
                    if (this.metodoLimitazioni.cors == undefined) {
                        this.metodoLimitazioni.cors = cors(corsOptions);
                    }
                    app.put(percorsoTmp,
                        this.metodoLimitazioni.cors,
                        this.metodoLimitazioni.helmet,
                        middlew,
                        //cacheMiddleware.route(this.cacheOptionRedis ?? {}),
                        apiRateLimiter,
                        apiSpeedLimiter,/*csrfProtection,*/
                        async (req: Request, res: Response) => {
                            //console.log("PUT");
                            await this.ChiamataGenerica(req, res);
                        });
                    break;
            }
        }

    }
    async ChiamataGenerica(req: Request, res: Response) {
        let passato = false;
        let logIn: any;
        let logOut: any;
        let tmp: IReturn | undefined;
        const key = this.metodoLimitazioni.cacheOptionMemory != undefined ? CalcolaChiaveMemoryCache(req) : undefined;
        const durationSecondi = this.metodoLimitazioni.cacheOptionMemory != undefined ? this.metodoLimitazioni.cacheOptionMemory.durationSecondi : undefined;
        try {
            //console.log('Inizio Chiamata generica per : ' + this.percorsi.pathGlobal);
            logIn = InizializzaLogbaseIn(req, this.nomeOriginale.toString());
            if (this.metodoEventi.onPrimaDiEseguire) req = await this.metodoEventi.onPrimaDiEseguire(req);
            const cachedBody = key == undefined ? undefined : MainExpress.cache.get<ICache>(key);
            if (cachedBody == undefined || cachedBody == null) {
                tmp = await this.Esegui(req);
                if (tmp != undefined) {
                    if (this.metodoEventi.onRispostaControllatePradefinita && this.metodoVettori.VerificaPresenzaRispostaControllata(tmp) == false) {
                        const rispostaPilotata = await this.metodoEventi.onRispostaControllatePradefinita(tmp)
                        /* if (this.isSpawTrigger && this.VerificaPresenzaSpawnTrigger(this.isSpawTrigger, rispostaPilotata)) {
                            console.log('è un evento scatenante dovrei avviare un nuovo processo.');

                        } */
                        Rispondi(res, rispostaPilotata, key, durationSecondi);
                        //throw new Error("Attenzione, cosa stai facendo?");
                    }
                    else {
                        try {
                            if (!this.metodoVettori.VerificaTrigger(req)) {
                                if (this.metodoVettori.VerificaPresenzaRispostaControllata(tmp)) {
                                    tmp = await this.metodoVettori.EseguiRispostaControllata(tmp);
                                }
                                try {
                                    if (this.metodoLimitazioni.isSpawTrigger && this.metodoLimitazioni.VerificaPresenzaSpawnTrigger(tmp)) {
                                        if (tmp.body instanceof Object) {
                                            const tt = (<any>tmp.body)[this.metodoLimitazioni.isSpawTrigger];
                                            let t1 = false;
                                            for (let index = 0; index < MainExpress.vettoreProcessi.length && t1 == false; index++) {
                                                const x = MainExpress.vettoreProcessi[index];
                                                if (String(x.nomeVariabile) == String(this.metodoLimitazioni.isSpawTrigger)
                                                    && String(x.valoreValiabile) == String(tt)) {
                                                    t1 = true;
                                                }
                                            }
                                            if (tt != undefined && tt != '' && t1 == false) {
                                                let porta = this.metodoParametri.percorsi.porta + 2;
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
                                                porta = Number(porta.toFixed(0));
                                                const proc = exec(`node ${MainExpress.pathExe}${porta}`); //exec(`npm run start-esempio`);
                                                MainExpress.vettoreProcessi.push({ porta: porta, nomeVariabile: this.metodoLimitazioni.isSpawTrigger, valoreValiabile: tt, vettorePossibiliPosizioni: this.metodoLimitazioni.checkSpawTrigger ?? [], processo: proc });

                                            }
                                        }
                                    }
                                } catch (error) {
                                    console.log(error);
                                }
                                Rispondi(res, tmp ?? ConstruisciErrore('Attenzione! Rimpiazzato.'), key, durationSecondi);
                            }
                            else {
                                const risposta = this.metodoVettori.CercaRispostaConTrigger(req);
                                if (risposta) {
                                    let source = "";
                                    if (risposta.stato >= 1 && risposta.stato < 600) {
                                        if (risposta.htmlPath != undefined)
                                            source = fs.readFileSync(risposta.htmlPath).toString();
                                        else if (risposta.html != undefined)
                                            source = risposta.html;
                                        else
                                            throw new Error("Errorissimo");
                                        Rispondi(res, { stato: risposta.stato, body: source }, key, durationSecondi);
                                        passato = true;
                                    } else {
                                        Rispondi(res, tmp, key, durationSecondi);
                                        passato = true;
                                    }
                                }
                                else {
                                    throw new Error("Errore nel trigger");
                                }
                            }
                        } catch (errore: any) {
                            const err = ConstruisciErrore(errore);
                            err.stato = 598;
                            Rispondi(res, err, key, durationSecondi);
                        }
                    }
                    //if (this.onPrimaDiTerminareLaChiamata) tmp = this.onPrimaDiTerminareLaChiamata(tmp);
                }
                else {
                    throw new Error("Attenzione qualcosa è andato storto nell'Esegui(req), guarda @mpMet");
                }
            }
            else {
                const parametri = (<ListaExpressParametro>this.listaParametri).EstraiParametriDaRequest(req);
                let valido: IRitornoValidatore | undefined | void = undefined;
                res.setHeader("specchio", "riflesso");
                if (this.metodoEventi.Validatore) {
                    valido = this.metodoEventi.Validatore(parametri, this.listaParametri) ?? undefined;
                    if (valido && valido?.approvato == true && this.metodoEventi.Istanziatore) {
                        await this.metodoEventi.Istanziatore(parametri, this.listaParametri);
                        res.setHeader('Content-Type', 'application/json');
                        res.status(cachedBody.stato).send(cachedBody.body)
                    }
                    else {
                        res.status(555).send({ errore: 'Errore cache.' });
                    }
                }
                else if (parametri.errori.length > 0) {
                    valido = { approvato: false, stato: 400, messaggio: 'Parametri in errore.'/* parametri.errori.toString() */ };
                    res.status(555).send({ errore: 'Errore cache.' });
                }
                else {
                    valido = { approvato: true, stato: 200, messaggio: '' };
                    res.setHeader('Content-Type', 'application/json');
                    res.status(cachedBody.stato).send(cachedBody.body)
                }
            }

            logOut = InizializzaLogbaseOut(res, this.nomeOriginale.toString());
            if (this.metodoEventi.onChiamataCompletata) {
                this.metodoEventi.onChiamataCompletata(logIn, tmp, logOut, undefined);
            }
            if (this.metodoEventi.onLog) {
                this.metodoEventi.onLog(logIn, tmp, logOut, undefined);
            }
        } catch (error) {
            if (this.metodoEventi.onChiamataInErrore) {
                tmp = await this.metodoEventi.onChiamataInErrore(logIn, tmp, logOut, error);
                /* let num = 0;
                num = tmp.stato;
                res.statusCode = Number.parseInt('' + num);
                res.send(tmp.body); */
                Rispondi(res, tmp, key, durationSecondi);
            }
            else if (passato == false) {
                if (error instanceof ErroreMio) {
                    //console.log("ciao");
                    /* return <IReturn>{
                        stato: (<ErroreMio>error).codiceErrore,
                        body: {
                            errore: (<ErroreMio>error).message
                        }
                    }; */

                    Rispondi(res, {
                        stato: (<ErroreMio>error).codiceErrore,
                        body: { errore: (<ErroreMio>error).message }
                    }, key, durationSecondi);
                } else {
                    Rispondi(res, {
                        stato: 500,
                        body: {
                            error: error,
                            passato: passato,
                            info: ''
                        }
                    }, key, durationSecondi);
                }
            }
            else {
                Rispondi(res, {
                    stato: 500,
                    body: {
                        error: error,
                        passato: passato,
                        info: ''
                    }
                }, key, durationSecondi);
            }
            if (this.metodoEventi.onLog) {
                this.metodoEventi.onLog(logIn, tmp, logOut, error);
            }
        }
    }

    async Esegui(req: Request): Promise<IReturn | undefined> {
        try {
            const parametri = (<ListaExpressParametro>this.listaParametri).EstraiParametriDaRequest(req);
            /*!!!
            Qui bisogna che ci metto qualcosa per convertire i parametri in una chimata, quindi 
            connettermi al db ed estrarli con una query.
            i parametri devono essere segnalati come tali.
            come fare a gestire il ritorno, perche io cosi facendo sto eseguendo una select
            come eseguire una delete o una set? 
            */
            let valido: IRitornoValidatore | undefined | void = undefined;
            if (this.metodoEventi.Validatore) {
                valido = this.metodoEventi.Validatore(parametri, this.listaParametri) ?? undefined;
            }
            else if (parametri.errori.length > 0) {
                valido = { approvato: false, stato: 400, messaggio: 'Parametri in errore.'/* parametri.errori.toString() */ };
            }
            else {
                valido = { approvato: true, stato: 200, messaggio: '' };
            }
            /* verifico che il metodo possa essere eseguito come volevasi ovvero approvato = true o undefiend */
            if ((valido && (valido.approvato == undefined || valido.approvato == true))
                || (!valido && parametri.errori.length == 0)) {
                let tmp: IReturn = {
                    body: {}, nonTrovati: parametri.nontrovato,
                    inErrore: parametri.errori, stato: 200
                };
                try {
                    const tmpRitorno = await this.EseguiMetodo(parametri);
                    const tmpReturn: any = tmpRitorno.result;
                    if (IsJsonString(tmpReturn)) {
                        if (tmpReturn.name === "ErroreMio" || tmpReturn.name === "ErroreGenerico") {
                            //console.log("ciao");
                        }
                        if ('body' in tmpReturn) { tmp.body = tmpReturn.body; }
                        else {
                            if (typeof tmpReturn === 'object' && tmpReturn !== null)
                                tmp.body = tmpReturn;
                            else {
                                tmp.body = { tmpReturn };
                            }
                        }
                        if ('stato' in tmpReturn) { tmp.stato = tmpReturn.stato; }
                        else { tmp.stato = 298; }
                    }
                    else {
                        if (typeof tmpReturn === 'object' && tmpReturn !== null &&
                            'stato' in tmpReturn && 'body' in tmpReturn) {
                            // eslint-disable-next-line prefer-const
                            for (let attribut in tmpReturn.body) {
                                (<any>tmp.body)[attribut] = tmpReturn.body[attribut];
                            }
                            tmp.body = Object.assign({}, tmpReturn.body);
                            tmp.stato = tmpReturn.stato;
                        }
                        else if (typeof tmpReturn === 'object') {
                            tmp.body = tmpReturn;
                            tmp.stato = 200//299;                            
                        }
                        else if (tmpReturn) {
                            tmp.body = { 'messaggio': tmpReturn };
                            tmp.stato = 200//299;
                        }
                        else {
                            tmp = {
                                body: { "Errore Interno filtrato ": 'internal error!!!!' },
                                stato: 599,
                                nonTrovati: parametri.nontrovato
                            };
                        }
                    }
                    tmp.attore = tmpRitorno.attore;
                    return tmp;
                } catch (error) {
                    if (error instanceof ErroreMio) {
                        throw error;
                        /* tmp = {
                            body: {
                                "Errore Interno filtrato ": 'filtrato 404 !!!',
                                'Errore originale': (<ErroreMio>error).message,
                                'Stack errore': (<Error>error).stack
                            },
                            stato: (<ErroreMio>error).codiceErrore
                        }; */
                    }
                    else {
                        throw new ErroreMio({
                            codiceErrore: 598,
                            messaggio: (<Error>error).message,
                            percorsoErrore: (<Error>error).stack,
                        })
                        /* tmp = {
                            body: {
                                "Errore Interno filtrato ": 'internal error!!!!',
                                'Errore originale': (<Error>error).message,
                                'Stack errore': (<Error>error).stack,
                                nonTrovati: parametri.nontrovato
                            },
                            stato: 598
                        }; */
                    }
                    return tmp;
                }
            }/* altrimenti lo vado a costruire */
            else {
                let tmp: IReturn = {
                    body: parametri.errori,
                    nonTrovati: parametri.nontrovato,
                    inErrore: parametri.errori,
                    stato: 597
                };
                if (valido) {
                    if (valido.body != undefined) {
                        tmp = {
                            body: valido.body,
                            stato: valido.stato ?? 596,
                        }
                    }
                    else {
                        tmp = {
                            body: tmp.body,
                            stato: valido.stato ?? 595,
                        }
                    }
                }
                return tmp;
            }
            throw new Error("Attenzione qualcosa è andato storto.");
        } catch (error: any) {
            console.log('');
            throw error;
        }
    }

    async EseguiMetodo(parametri: IParametriEstratti) {
        let tmpReturn: any = '';
        let attore = undefined;
        if (this.metodoEventi.onPrimaDiEseguireMetodo)
            parametri = await this.metodoEventi.onPrimaDiEseguireMetodo(parametri);
        /* let count = 0; */
        if (this.metodoEventi.Istanziatore) {
            const classeInstanziata = await this.metodoEventi.Istanziatore(parametri, this.listaParametri);
            attore = classeInstanziata;
            // eslint-disable-next-line prefer-spread
            tmpReturn = await classeInstanziata[this.nomeOriginale.toString()].apply(classeInstanziata, parametri.valoriParametri);
            // eslint-disable-next-line prefer-spread
            //tmpReturn =await vm.run( classeInstanziata[this.nomeOriginale.toString()].apply(classeInstanziata, parametri.valoriParametri));
            console.log('lll');

            /* const vm = new NodeVM({
                console: 'inherit',
                // pass our declared ext variable to the sandbox
                sandbox: {},
                require: {
                    external: true,
                    builtin: [],
                    root: './',
                },
            });

            // run your code and see the results in ext
            vm.run(tmpReturn.apply(classeInstanziata, parametri.valoriParametri)); */
        }
        else {

            //tmpReturn =await vm.run( this.metodoAvviabile/* .value */.apply(this.metodoAvviabile/* .value */, parametri.valoriParametri));
            console.log('ppp');

            tmpReturn = await this.metodoAvviabile/* .value */.apply(this.metodoAvviabile/* .value */, parametri.valoriParametri);
        }

        if (this.metodoVettori.ListaSanificatori && 'length' in this.metodoVettori.ListaSanificatori && this.metodoVettori.ListaSanificatori.length > 0)
            tmpReturn = SostituisciRicorsivo(this.metodoVettori.ListaSanificatori, tmpReturn);


        if (this.metodoEventi.onDopoAverTerminatoLaFunzione) tmpReturn = this.metodoEventi.onDopoAverTerminatoLaFunzione(tmpReturn);
        return {
            attore: attore,
            result: tmpReturn
        };
    }
}

export class ListaExpressMetodo extends ListaMetadataMetodo {

    constructor(item?: ListaMetadataMetodo) {
        super();
        if (item)
            for (let index = 0; index < item.length; index++) {
                const element = new ExpressMetodo(item[index]);
                const tmp = this.Cerca(element);
                if (tmp) tmp.Mergia(element);
            }
    }

    Mergia(item: ListaExpressMetodo) {
        const t = super.Mergia(item);
        return t;
        /* for (let index = 0; index < item.length; index++) {
            const element = item[index];
            const elementoCercato = this.Cerca(element);
            if (elementoCercato == undefined) {
                const tmp = element;
                this.push(tmp);
            }
            else {
                elementoCercato.Mergia(elementoCercato);
            }
        } */
    }
    /* Init(item: IListaMetadataMetodo) {
        for (let index = 0; index < item.length; index++) {
            const element = item[index];
            const tmp = new MetadataMetodo(element);
            this.push(tmp);
        }
    } */
    CercaSeNoAggiungi(item: ExpressMetodo) {
        const t = super.CercaSeNoAggiungi(item);
        return <ExpressMetodo>t;
        /* let metodo = undefined;
        for (let index = 0; index < this.length && metodo == undefined; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) metodo = element.GetThis();
        }
        if (metodo == undefined) {
            if (item.GetThis) {
                metodo = <ExpressMetodo>item.GetThis(item);
            }
            else {
                metodo = new MetadataMetodo(item);
            }
            this.AggiungiElemento(metodo);
        }
        return metodo; */
    }
    Cerca(item: ExpressMetodo): ExpressMetodo | undefined {
        const t = super.Cerca(item);
        return <ExpressMetodo>t;
        /* for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) return element;
        }
        return undefined; */
    }
    AggiungiElemento(item: ExpressMetodo) {
        const t = super.AggiungiElemento(item);
        return <ExpressMetodo>t;
        /* for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) {
                this[index].Mergia(item);
                return this[index];
            }
        }
        this.push(item);
        return item; */
    }

    ConfiguraListaRotteApplicazione(app: any, percorsi: IRaccoltaPercorsi) {
        for (let index = 0; index < this.length; index++) {
            const element = <ExpressMetodo>this[index];
            if (element.metodoParametri.interazione == 'rotta' || element.metodoParametri.interazione == 'ambo') {
                //element.ConfiguraRotta(this.rotte, this.percorsi);
                element.ConfiguraRottaApplicazione(app, percorsi);
            }
            //element.listaRotteGeneraChiavi=this.listaMetodiGeneraKey;
        }
    }
}
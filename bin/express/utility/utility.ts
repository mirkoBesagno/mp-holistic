import { IMetaParametro } from "../../metadata/parametro.metadata";

import crypto from "crypto";
import { Request, Response } from "express";
import { ICache } from "../../main/main";
import { SanificatoreCampo } from "./SanificatoreCampo";
import { ErroreMio } from "./ErroreMio";
import { MainExpress } from "../main.express";
import { ITracciamentoQualita } from "../metodo.express";
import fs from "fs";

export type TypePosizione = "body" | "query" | 'header';

export type TypeDovePossoTrovarlo = TypeInterazone | "qui" | 'non-qui';

export type TypeInterazone = "rotta" | "middleware" | 'ambo';

/* export interface IRitornoValidatore {
    body?: any | string,
    approvato: boolean,
    messaggio: string,
    stato?: number,
    terminale?: IExpressParametro
} */

export interface IResponse {
    body: string
}

export interface IParametri {
    body: string, query: string, header: string
}
export interface INonTrovato {
    nome: string, posizioneParametro: number
}

export interface IParametriEstratti {
    valoriParametri: any[], nontrovato: INonTrovato[], errori: IRitornoValidatore[]
}

export interface INonTrovato {
    nome: string, posizioneParametro: number
}

export interface IRitornoValidatore {
    body?: any /* object */ | string,
    approvato: boolean,
    messaggio: string,
    stato?: number,
    terminale?: IMetaParametro
}
export interface IReturn {
    body: any /* object */ | string;
    stato: number;
    nonTrovati?: INonTrovato[];
    inErrore?: IRitornoValidatore[];
    attore?: any;
}

export interface ISpawTrigger {
    nome: string,
    posizione: TypePosizione
}
export type TypeMetod = "get" | "put" | "post" | "patch" | "purge" | "delete";


export function IsJsonString(str: string): boolean {
    try {
        // eslint-disable-next-line no-useless-escape
        if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
            // eslint-disable-next-line no-useless-escape
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            //the json is ok 
            if (typeof str === 'object') {
                return true;
            } else {
                return false;
            }
        } else {
            //the json is not ok
            return false;
        }
    } catch (e) {
        return false;
    }
}

export function SostituisciRicorsivo(sanific: SanificatoreCampo[], currentNode: any): any {
    // eslint-disable-next-line prefer-const
    for (let attribut in currentNode) {
        if (typeof currentNode[attribut] === 'object') {
            currentNode[attribut] = SostituisciRicorsivo(sanific, currentNode[attribut]);
        }
        else {
            for (let index = 0; index < sanific.length; index++) {
                const element = sanific[index];
                if (attribut == element.campoDaCercare) {
                    currentNode[attribut] = element.valoreFuturo;
                }
            }
        }
        return currentNode;
    }
}

/**
 * @messaggio : inserisci qui il messaggio  sara incontenuto del body o del testo nel .send() di express
 * @codiceErrore inserisci qui l'errore che sara posi messo nello stato della risposta express
 * @nomeClasse inserire solo se si alla creazione ovvero nel throw new ErroreMio(....)
 * @nomeFunzione inserire solo se si alla creazione ovvero nel throw new ErroreMio(....)
 * @percorsoErrore campo gestito dala classe GestioneErrore, se proprio si vuole inserire solo se si è nella fase di rilancio di un errore
 */
export interface IErroreMio {
    messaggio: string,
    codiceErrore: number,
    nomeClasse?: string,
    nomeFunzione?: string,
    percorsoErrore?: string
}
export interface IGestioneErrore {
    error: Error,
    nomeClasse?: string,
    nomeFunzione?: string
}
export function GestioneErrore(item: IGestioneErrore): ErroreMio {
    let errore: ErroreMio;
    const messaggio = '_CLASSE_->' + item.nomeClasse ?? '' + '_FUNZIONE_->' + item.nomeFunzione;
    if (item.error instanceof ErroreMio) {
        const tmp: ErroreMio = <ErroreMio>item.error;
        tmp.percorsoErrore = messaggio + '->' + tmp.percorsoErrore;
        errore = tmp;
    }
    else {
        errore = new ErroreMio({
            codiceErrore: 499,
            messaggio: '' + item.error,
            percorsoErrore: messaggio
        });
    }
    return errore;
}


export function CalcolaChiaveMemoryCache(req: Request): string {
    const keySHA = 'Besagno'
    const headerTmp = req.headers['authorization'] != undefined ? String(req.headers['authorization']) : JSON.stringify({
        "Aauthorization9X": "10"
    })

    const tmp = '-' + JSON.stringify(req.body) + '-' + headerTmp + '-' + JSON.stringify(req.query) + '-';
    const tmpmd = crypto.createHmac('sha1', keySHA)
        .update(tmp).digest('hex');
    const ritorno = '__express__' + req.url + '__MP__' + tmpmd + '__';
    return ritorno;
}


export interface ILogbase {
    data: Date;
    body: any;
    params: any;
    header: any;
    local: string;
    remote: string;
    url: string;
    nomeMetodo?: string
}

export function InizializzaLogbaseIn(req: Request, nomeMetodo?: string): ILogbase {

    const params = req.params;
    const body = req.body;
    const data = new Date(Date.now());
    const header = JSON.parse(JSON.stringify(req.headers));
    const local = req.socket.localAddress + " : " + req.socket.localPort;
    const remote = req.socket.remoteAddress + " : " + req.socket.remotePort;
    const url = req.originalUrl;

    /* const tmp = "Arrivato in : " + nomeMetodo + "\n"
        + "Data : " + new Date(Date.now()) + "\n"
        + "url : " + req.originalUrl + "\n"
        + "query : " + JSON.stringify(req.query) + "\n"
        + "body : " + JSON.stringify(req.body) + "\n"
        + "header : " + JSON.stringify(req.headers) + "\n"
        + "soket : " + "\n"
        + "local : " + req.socket.localAddress + " : " + req.socket.localPort + "\n"
        + "remote : " + req.socket.remoteAddress + " : " + req.socket.remotePort + "\n"; */

    const tmp: ILogbase = {
        params: params,
        body: body,
        data: data,
        header: header,
        local: local,
        remote: remote,
        url: url,
        nomeMetodo: nomeMetodo
    };

    return tmp;
}

export function Rispondi(res: Response, item: IReturn, id: ITracciamentoQualita, key?: string, durationSecondi?: number /* , url: string */) {

    res.statusCode = Number.parseInt('' + item.stato);
    res.send(item.body);
    id.fine = new Date().getTime();
    id.differenza = id.fine - id.inizio;

    if (id && 'res' in id && res) {
        id.res = res;
    }
    var cache: any = [];
    let tmpReq = '';
    let tmpRes = '';
    try {
        tmpReq = //id.req ?? '';
            JSON.stringify(id.req, (key, value) => {
                if (typeof value === 'object' && value !== null && cache) {
                    // Duplicate reference found, discard key
                    if (cache.includes(value)) return;

                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            });
        cache = undefined;
        //(JSON.stringify(id.req, null, 0));
        /* stringifyObject(id.req, {
            indent: '  ',
            singleQuotes: false
        }); */
    } catch (error) {
        tmpReq = 'errore : ' + error;
    }
    try {
        tmpRes = //id.res ?? '';
            JSON.stringify(id.req, (key, value) => {
                if (typeof value === 'object' && value !== null && cache) {
                    // Duplicate reference found, discard key
                    if (cache.includes(value)) return;

                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            });
        cache = undefined;
        //JSON.stringify(id.res, null, 0);
        /* stringifyObject(id.res, {
            indent: '  ',
            singleQuotes: false
        }); */
    } catch (error) {
        tmpRes = 'error : ' + error;
    }
    const stamp = `
    <!--################
    processo:${MainExpress.portaProcesso}
    id:${id.id};
    inizio:${new Date(id.inizio).toISOString()};
    inizio-time: ${id.inizio}
    tempo:${id.differenza};
    req:
    ${tmpReq}
    res:
    ${tmpRes}
    ################--!>
    `;
    console.log(stamp);
    //fs.writeFileSync('./LogExpress/Processo_' + MainExpress.portaProcesso + '/' + 'log.txt', stamp,);
    /* var logger = fs.createWriteStream('./LogExpress/Processo_' + MainExpress.portaProcesso + '/' + 'log.txt', {
        flags: 'a'
    });
    logger.write(stamp); */
    try {
        fs.appendFileSync('./LogExpress/Processo_' + MainExpress.portaProcesso + '/' + 'log.txt', stamp);
    } catch (error) {
        console.log(error);
    }

    if (key != undefined) {
        const tempo = (durationSecondi ?? 1);
        MainExpress.cache.set<ICache>(key, <ICache>{ body: item.body, stato: res.statusCode }, tempo /* 1000 */);
    }
}

export function ConstruisciErrore(messaggio: any): IReturn {
    return {
        stato: 500,
        body: {
            errore: messaggio
        }
    }
}
export function InizializzaLogbaseOut(res: Response, nomeMetodo?: string): ILogbase {

    const params = {};
    const body = {};
    const data = new Date(Date.now());
    const header = res.getHeaders();
    const local = res.socket?.localAddress + " : " + res.socket?.localPort;
    const remote = res.socket?.remoteAddress + " : " + res.socket?.remotePort;
    const url = '';

    const tmp: ILogbase = {
        params: params,
        body: body,
        data: data,
        header: header,
        local: local,
        remote: remote,
        url: url,
        nomeMetodo: nomeMetodo
    };

    /* const tmp = "Arrivato in : " + nomeMetodo + "\n"
        + "Data : " + new Date(Date.now()) + "\n"
        + "headersSent : " + req.headersSent + "\n"
        + "json : " + req.json + "\n"
        + "send : " + req.send + "\n"
        + "sendDate : " + req.sendDate + "\n"
        + "statusCode : " + req.statusCode + '\n'
        + "statuMessage : " + req.statusMessage + '\n'
        + "soket : " + "\n"
        + "local : " + t1 + "\n"
        + "remote : " + t2 + "\n"; */

    return tmp;
}
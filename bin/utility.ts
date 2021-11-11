


/* 

import { ListaExpressClasse } from "./express/classe.express";
import { ListaMeta } from "./metadata/classe.metadata";



export const targetTerminale = { name: 'Terminale' };

export type switchMetaKey = 'metadata' | 'express' | 'postgres';
export function GetListaClasseMetaData() {
    let tmp: ListaMeta | undefined = undefined;
    tmp = Reflect.getMetadata(ListaMeta.nomeMetadataKeyTargetFor_Metadata, targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaMeta();
    }
    return tmp;
}
export function GetListaClasseExpress() {
    let tmp: ListaExpressClasse | undefined = undefined;
    tmp = Reflect.getMetadata(ListaExpressClasse.nomeMetadataKeyTargetFor_Express, targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaExpressClasse();
    }
    return tmp;
}

export function SalvaListaClasseMetaData(tmp: ListaMeta) {
    Reflect.defineMetadata(ListaMeta.nomeMetadataKeyTargetFor_Metadata, tmp, targetTerminale);
}

export function SalvaListaClasseExpress(tmp: ListaExpressClasse) {
    Reflect.defineMetadata(ListaExpressClasse.nomeMetadataKeyTargetFor_Express, tmp, targetTerminale);
}

*/

export type tipo = /* "number" | */
    //number
    'decimal' | 'smallint' | 'integer' | 'numeric' | 'real' | 'smallserial' | 'serial' |
    //text
    "text" | "varchar(n)" | "character(n)" |
    //date
    "date" | "timestamptz" |
    "array" |
    "json" |
    "boolean" |
    "any" |
    //"object" 
    ORMObject
    ;

export class ORMObject {
    tipo: 'object';
    colonnaRiferimento: tipo;
    tabellaRiferimento: string;
    onDelete?: 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT';
    onUpdate?: 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT'
    constructor(colonnaRiferimento: tipo, tabellaRiferimento: string,
        onDelete?: 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT',
        onUpdate?: 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT') {
        this.tipo = 'object';
        this.colonnaRiferimento = colonnaRiferimento;
        this.tabellaRiferimento = tabellaRiferimento;
        this.onDelete = onDelete;
        this.onUpdate = onUpdate
    }
}

export interface ICommentato {
    descrizione: string;
    sommario: string;
}

export const targetTerminale = { name: 'Terminale' };
export const targetExpress = { name: 'ExpressS' };

import os from "os";

export function StartMonitoring() {
    try {
        const used = process.memoryUsage();
        const partizionamentoMemoriaProcesso: {
            rss: string,
            heapTotale: string,
            heapUsed: string,
            external: string,
            cpuMedia: any,
            totalMemo: string,
            freeMemo: string
        } = {
            rss: '',
            heapTotale: '',
            heapUsed: '',
            external: '',
            cpuMedia: '',
            totalMemo: '',
            freeMemo: ''
        };
        // eslint-disable-next-line prefer-const
        for (let key in used) {
            switch (key) {
                case 'rss':
                    partizionamentoMemoriaProcesso.rss = `${key} ${Math.round((<any>used)[key] / 1024 / 1024 * 100) / 100} MB`;
                    break;
                case 'heapTotal':
                    partizionamentoMemoriaProcesso.heapTotale = `${key} ${Math.round((<any>used)[key] / 1024 / 1024 * 100) / 100} MB`;
                    break;
                case 'heapUsed':
                    partizionamentoMemoriaProcesso.heapUsed = `${key} ${Math.round((<any>used)[key] / 1024 / 1024 * 100) / 100} MB`;
                    break;
                case 'external':
                    partizionamentoMemoriaProcesso.external = `${key} ${Math.round((<any>used)[key] / 1024 / 1024 * 100) / 100} MB`;
                    break;
                default:
                    break;
            }
        }
        partizionamentoMemoriaProcesso.cpuMedia = os.cpus();
        partizionamentoMemoriaProcesso.totalMemo = os.totalmem().toString();
        partizionamentoMemoriaProcesso.freeMemo = os.freemem().toString();
        console.log(":-Data" + new Date().toISOString() + ' - ' + partizionamentoMemoriaProcesso.rss + ' - ' +
            partizionamentoMemoriaProcesso.heapTotale + ' - ' +
            partizionamentoMemoriaProcesso.heapUsed + ' - ' +
            partizionamentoMemoriaProcesso.external + ' - ' + '\n');
        setTimeout(() => {
            StartMonitoring();
        }, (5) * 1000);
    } catch (error) {
        setTimeout(() => {
            StartMonitoring();
        }, (5) * 1000);
    }
}
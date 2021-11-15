


import { targetTerminale } from "./utility";

export interface IIntegraMeta {
    metaRif: IMeta
}

export interface IMeta {
    nomeOriginale?: string;
    nomeVariante?: string;
}
export interface ICompare {
    Compara(item1: IMeta, item2: IMeta): 0 | 1 | -1;
}

export class Meta implements IMeta, ICompare {

    nomeOriginale = '';
    nomeVariante = '';

    constructor(item: IMeta) {
        if (item.nomeVariante) this.nomeVariante = item.nomeVariante;
        else if (item.nomeOriginale) this.nomeVariante = item.nomeOriginale;
        if (item.nomeOriginale) this.nomeOriginale = item.nomeOriginale;
    }

    /* GetThis<T>() {
        return <T>(<any>this);
    }
    static GetThis<T>(item: Meta) {
        return <T>(<any>item);
    } */
    /* GetThis?: (item: IMeta) => Meta; */
    Compara(item: Meta): 0 | 1 | -1 {
        if (this.nomeOriginale != undefined && item.nomeOriginale != undefined) {
            if (this.nomeOriginale == item.nomeOriginale) return 0;
            else if (this.nomeOriginale > item.nomeOriginale) return 1;
            else if (this.nomeOriginale < item.nomeOriginale) return -1;
        }
        if (this.nomeVariante != undefined && item.nomeVariante != undefined) {
            if (this.nomeVariante == item.nomeVariante) return 0;
            else if (this.nomeVariante > item.nomeVariante) return 1;
            else if (this.nomeVariante < item.nomeVariante) return -1;
        }
        if (this.nomeOriginale != undefined && item.nomeVariante != undefined) {
            if (this.nomeOriginale == item.nomeVariante) return 0;
            else if (this.nomeOriginale > item.nomeVariante) return 1;
            else if (this.nomeOriginale < item.nomeVariante) return -1;
        }
        if (this.nomeVariante != undefined && item.nomeOriginale != undefined) {
            if (this.nomeVariante == item.nomeOriginale) return 0;
            else if (this.nomeVariante > item.nomeOriginale) return 1;
            else if (this.nomeVariante < item.nomeOriginale) return -1;
        }
        return 0;
    }
    /* Mergia?: (item: IMeta) => void; */
    Mergia(item: Meta, funzioneMerge?: (item: Meta) => Meta) {
        if (funzioneMerge != undefined) {
            const tmp = funzioneMerge(item);
            this.nomeOriginale = tmp.nomeOriginale;
            this.nomeVariante = tmp.nomeVariante;
        } else {
            if (item.nomeOriginale != '' && item.nomeOriginale != undefined &&
                (this.nomeOriginale == '' || this.nomeVariante == undefined)
            ) {
                this.nomeOriginale = item.nomeOriginale ?? this.nomeOriginale;
            } else if (this.nomeOriginale != '' && item.nomeOriginale != '' && this.nomeOriginale && item.nomeOriginale) {
                this.nomeOriginale = item.nomeOriginale;
            }

            if (item.nomeVariante != '' && item.nomeVariante != undefined &&
                (this.nomeVariante == '' || this.nomeVariante == undefined)
            ) {
                this.nomeVariante = item.nomeVariante ?? this.nomeVariante;
            } else if (this.nomeVariante != '' && item.nomeVariante != '' && this.nomeVariante && item.nomeVariante) {
                this.nomeVariante = item.nomeVariante;
            }
        }
    }
    GetThis() {
        return this;
    }
}
export interface IsMerge {
    Mergia(item: ListaMeta): void
}
export class ListaMeta extends Array<Meta> implements IsMerge {

    constructor() {
        super();
    }
    Mergia(item: ListaMeta) {
        for (let index = 0; index < item.length; index++) {
            const element = item[index];
            const elementoCercato = this.Cerca(element);
            if (elementoCercato == undefined) {
                const tmp = element;
                this.push(tmp);
            }
            else {
                elementoCercato.Mergia(element);
            }
        }
    }
    CercaSeNoAggiungi(item: Meta) {

        let parametro = undefined;
        /* for (let index = 0; index < this.length && parametro == undefined; index++) {
            const element = this[index];
            if (element.Compara(item) == 0) parametro = element;
        }
        if (parametro == undefined) {
            parametro = item;
        }    */
        parametro = item;
        const t = this.AggiungiElemento(parametro);
        return t;
    }
    Cerca(item: Meta): Meta | undefined {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.Compara(item) == 0) return element;
        }
        return undefined;
    }
    AggiungiElemento(item: Meta) {
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (element.Compara(item) == 0) {
                element.Mergia(item);
                return element;
            }
        }
        this.push(item);
        return item;
    }
}


/* export function GetListaClasseMeta<T>(item?: number, ifEsiste?: () => T) {
    let tmp: T | undefined = undefined;
    if (item == undefined) {
        tmp = Reflect.getMetadata(nomeMetadataKeyTargetFor_Metadata, targetTerminale);
        if (tmp == undefined) {
            if (ifEsiste)
                tmp = ifEsiste();
        }
    }
    else {
        tmp = Reflect.getMetadata(nomeMetadataKeyTargetFor_Express, targetTerminale);
        if (tmp == undefined) {
            if (ifEsiste)
                tmp = ifEsiste();
        }
    }
    if (tmp == undefined) throw new Error('Boooo');
    return tmp;
}
export function SalvaListaMetaClasse<T>(tmp: T, num?: number) {
    if (num == undefined) {
        Reflect.defineMetadata(nomeMetadataKeyTargetFor_Metadata, tmp, targetTerminale);
    }
    else {
        Reflect.defineMetadata(nomeMetadataKeyTargetFor_Express, tmp, targetTerminale);
    }
} */

export function GetListaClasseMeta<T>(metaKey: metadataKey, ifNonEsiste?: () => T) {
    let tmp: T | undefined = undefined;
    tmp = Reflect.getMetadata(metaKey, targetTerminale);
    if (tmp == undefined) {
        if (ifNonEsiste)
            tmp = ifNonEsiste();
    }
    if (tmp == undefined) throw new Error('Boooo');
    return <T>tmp;
}
export function SalvaListaMetaClasse(metaKey: metadataKey, item: ListaMeta) {
    Reflect.defineMetadata(metaKey, item, targetTerminale);
    /* if (item instanceof ListaMetadataClasse) {
        Reflect.defineMetadata(metaKey, item, targetTerminale);
    }
    else {
        Reflect.defineMetadata(metaKey, item, targetTerminale);
    } */
    return undefined;
}
export type metadataKey = 'nomeMetadataKeyTargetFor_Metadata' | 'nomeMetadataKeyTargetFor_Express' | 'nomeMetadataKeyTargetFor_Postgres'; 

/* import { ExpressMetodo } from "../express/metodo.express"; */


import { IMeta, ListaMeta, Meta } from "../metadata";
import { IListaMetadataParametro, ListaMetadataParametro } from "./parametro.metadata";





export interface IMetaMetodoBase extends IMeta {
    listaParametri?: IListaMetadataParametro;
    nomeOriginale?: string;
    nomeVariante?: string;
    metodoAvviabile?: any;
}

export interface IMetaMetodo extends IMeta {
    listaParametri?: ListaMetadataParametro;
    nomeOriginale?: string;
    nomeVariante?: string;
    metodoAvviabile?: any;
    /* metodoExpress?: ExpressMetodo; */
}

export class MetadataMetodo extends Meta implements IMetaMetodo {

    listaParametri: ListaMetadataParametro;
    metodoAvviabile: any;
    /* metodoExpress: ExpressMetodo = new ExpressMetodo(); */
    constructor(item: IMetaMetodo) {
        super(item);
        if (item.listaParametri != undefined)
            this.listaParametri = item.listaParametri;
        else {
            this.listaParametri = new ListaMetadataParametro();
        }

        if (item.metodoAvviabile)
            this.metodoAvviabile = item.metodoAvviabile;
    }
    Init(item: MetadataMetodo) {
        if (item.listaParametri != undefined)
            this.listaParametri = item.listaParametri;
        if (item.metodoAvviabile)
            this.metodoAvviabile = item.metodoAvviabile;
    }
    Mergia(item: MetadataMetodo) {
        super.Mergia(item);
        if (item.listaParametri != undefined && this.listaParametri != undefined)
            this.listaParametri.Mergia(item.listaParametri);
        if (item.metodoAvviabile)
            this.metodoAvviabile = item.metodoAvviabile;
    }
    GetThis() { return this; }
}

export class ListaMetadataMetodo extends ListaMeta {

    constructor(item?: ListaMetadataMetodo) {
        super();
        if (item)
            for (let index = 0; index < item.length; index++) {
                const element = new MetadataMetodo(item[index]);
                const tmp = this.Cerca(element);
                if (tmp) tmp.Mergia(element);
            }
        /*  if (item) {
             if (item instanceof ListaMetadataMetodo) {
                 for (let index = 0; index < item.length; index++) {
                     const element = item[index];
                     this.AggiungiElemento(new MetadataMetodo(element));
                 }
             } */
        /* else if (item.valori) {
            for (let index = 0; index < item?.valori.length; index++) {
                const element = item?.valori[index];
                this.AggiungiElemento(new MetadataMetodo(element));
            }
        } */
        //}
    }

    Mergia(item: ListaMetadataMetodo) {
        const t = super.Mergia(item);
        for (let index = 0; index < this.length; index++) {
            const element = <MetadataMetodo>this[index];
            for (let index2 = 0; index2 < item.length; index2++) {
                const element2 = <MetadataMetodo>item[index2];
                if (element.Compara(element2) == 0) {
                    element.Mergia(element2);
                }
            }
        }
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
    CercaSeNoAggiungi(item: MetadataMetodo) {
        const t = super.CercaSeNoAggiungi(item);
        return <MetadataMetodo>t;
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
    Cerca(item: MetadataMetodo): MetadataMetodo | undefined {
        const t = super.Cerca(item);
        return <MetadataMetodo>t;
        /* for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) return element;
        }
        return undefined; */
    }
    AggiungiElemento(item: MetadataMetodo) {
        const t = super.AggiungiElemento(item);
        return <MetadataMetodo>t;
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
}
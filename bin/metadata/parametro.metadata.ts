/* import { ExpressParametro } from "../express/parametro.express"; */

import { ICommentato, tipo } from "../utility";
import { IMeta, ListaMeta, Meta } from "../metadata";



export interface IMetaParametroBesa {
    nomeVariante?: string;
    tipo?: tipo;
    descrizione?: string;
    sommario?: string;
    obbligatorio?: boolean;
}

export interface IMetaParametro extends IMeta {
    tipo?: tipo;
    indexParameter?: number;
    descrizione?: string;
    sommario?: string;
    obbligatorio?: boolean;

    /*  parametroExpress?: ExpressParametro; */
}

export class MetadataParametro extends Meta implements IMetaParametro, ICommentato {

    tipo: tipo = 'any';
    indexParameter = -1;
    descrizione = '';
    sommario = '';
    obbligatorio = false;

    /* parametroExpress = new ExpressParametro(); */
    constructor(item: IMetaParametro) {
        super(item);
        if (item.tipo != undefined)
            this.tipo = item.tipo;
        if (item.indexParameter != undefined)
            this.indexParameter = item.indexParameter ?? -1;
        if (item.descrizione != undefined)
            this.descrizione = item.descrizione;
        if (item.sommario != undefined)
            this.sommario = item.sommario;
        if (item.obbligatorio != undefined)
            this.obbligatorio = item.obbligatorio ?? false;
    }
    Mergia(item: MetadataParametro) {
        super.Mergia(item)
        if (item.tipo != undefined)
            this.tipo = item.tipo;
        if (item.indexParameter != undefined)
            this.indexParameter = item.indexParameter ?? -1;
        if (item.descrizione != undefined)
            this.descrizione = item.descrizione;
        if (item.sommario != undefined)
            this.sommario = item.sommario;
        if (item.obbligatorio != undefined)
            this.obbligatorio = item.obbligatorio ?? false;
    }
    GetThis() { return this; }

}

export interface IListaMetadataParametro extends Array<IMetaParametro> {
    length: number;
}
export class ListaMetadataParametro extends ListaMeta {

    constructor(item?: ListaMetadataParametro) {
        super();
        if (item)
            for (let index = 0; index < item.length; index++) {
                const element = new MetadataParametro(item[index]);
                const tmp = this.Cerca(element);
                if (tmp) tmp.Mergia(element);
            }
    }
    Mergia(item: ListaMetadataParametro) {
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
    CercaSeNoAggiungi(item: MetadataParametro) {
        const t = super.CercaSeNoAggiungi(item);
        return t;
        /* let parametro = undefined;
        for (let index = 0; index < this.length && parametro == undefined; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) parametro = element;
        }
        if (parametro == undefined) {
            if (item.GetThis) {
                parametro = <ExpressParametro>item.GetThis(item);
            }
            else {
                parametro = new MetadataParametro(item);
            }
            this.AggiungiElemento(parametro);
        }
        return parametro; */
    }
    Cerca(item: MetadataParametro): MetadataParametro | undefined {
        const t = super.Cerca(item);
        return <MetadataParametro>t;
        /* for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) return element;
        }
        return undefined; */
    }
    AggiungiElemento(item: MetadataParametro) {
        const t = super.AggiungiElemento(item);
        return t;
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
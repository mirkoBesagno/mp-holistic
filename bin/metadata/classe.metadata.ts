

import { Meta, IMeta, ListaMeta } from "../metadata";
import { ListaMetadataMetodo } from "./metodo.metadata";
import { ListaMetadataProprieta } from "./proprieta.metadata";




export interface IMetaClasseBase {
    nomeOriginale?: string;
    nomeVariante?: string;
    listaMetodi?: ListaMetadataMetodo;
}
/**
 * istanzia la meta classe
 * @param nomeOriginale : si puo tralasciare
 * @param nomeVariante : si puo tralasciare
 * @param listaMetodi : da toccare con cura
 * @param listaProprieta : da toccare con cura
 */
export interface IMetaClasse extends IMeta {
    nomeOriginale?: string;
    nomeVariante?: string;
    listaMetodi?: ListaMetadataMetodo;
    listaProprieta?: ListaMetadataProprieta;
    /* classeExpress?: ExpressClasse; */
}

export class MetadataClasse extends Meta implements IMetaClasse {
    listaMetodi = new ListaMetadataMetodo();
    listaProprieta = new ListaMetadataProprieta();
    /* classeExpress = new ExpressClasse(); */

    constructor(item: IMetaClasse) {
        super(item);
        /* if (item.listaMetodi != undefined)
            this.listaMetodi = new ListaMetadataMetodo(item.listaMetodi);
        else if (this.listaMetodi == undefined)
            this.listaMetodi = new ListaMetadataMetodo(); */
        //ooppure questo devo vedere 
        /* if (item)
        for (let index = 0; index < item.length; index++) {
            const element = new ExpressMetodo(item[index]);
            this.Cerca(element).Mergia(element);
        } */
    }
    Mergia(item: MetadataClasse) {
        super.Mergia(item);
        if (item.listaMetodi != undefined && this.listaMetodi != undefined)
            this.listaMetodi.Mergia(item.listaMetodi);
    }
    GetThis() { return this; }

}

export class ListaMetadataClasse extends ListaMeta {


    constructor(item?: ListaMetadataClasse) {
        super();
        if (item)
            for (let index = 0; index < item.length; index++) {
                const element = new MetadataClasse(item[index]);
                const tmp = this.Cerca(element);
                if (tmp) tmp.Mergia(element);
            }

    }

    Mergia(item: ListaMetadataClasse) {
        super.Mergia(item);
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

    CercaSeNoAggiungi(item: MetadataClasse) {
        const t = super.CercaSeNoAggiungi(item);
        return <MetadataClasse>t;
        /* let classe = undefined;

        for (let index = 0; index < this.length && classe == undefined; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) classe;
        }
        if (classe == undefined) {
            classe = new MetadataClasse(item);
            this.AggiungiElemento(classe);
        }
        return classe; */
    }
    Cerca(item: MetadataClasse): MetadataClasse | undefined {
        const t = super.Cerca(item);
        return <MetadataClasse>t;
        /* for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) return element;
        }
        return undefined; */
    }

    AggiungiElemento(item: MetadataClasse) {
        const t = super.AggiungiElemento(item);
        return <MetadataClasse>t;
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


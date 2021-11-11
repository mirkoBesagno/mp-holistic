import { IMeta, ListaMeta, Meta } from "../metadata";
import { tipo } from "../utility";
import { ListaMetadataClasse } from "./classe.metadata";



export interface IMetaProprieta extends IMeta {
    nome: string;
    tipo: tipo;
}

export class MetadataProprieta extends Meta implements IMetaProprieta {

    nome: string;
    tipo: tipo;

    constructor(item: IMetaProprieta) {
        super(item);
        this.nome = '';
        this.tipo = 'any';
    }


}

export class ListaMetadataProprieta extends ListaMeta {

    constructor() {
        super();

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

    CercaSeNoAggiungi(item: MetadataProprieta) {
        const t = super.CercaSeNoAggiungi(item);
        return <MetadataProprieta>t;
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
    Cerca(item: MetadataProprieta): MetadataProprieta | undefined {
        const t = super.Cerca(item);
        return <MetadataProprieta>t;
        /* for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) return element;
        }
        return undefined; */
    }

    AggiungiElemento(item: MetadataProprieta) {
        const t = super.AggiungiElemento(item);
        return <MetadataProprieta>t;
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
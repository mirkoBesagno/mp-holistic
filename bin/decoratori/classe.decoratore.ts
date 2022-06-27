




import { ExpressClasse, IExpressClasse, ListaExpressClasse } from "../express/classe.express";
import { ExpressMetodo } from "../express/metodo.express";
import { IHtml } from "../express/metodo/utility";
import { IParametriEstratti } from "../express/utility/utility";
import { GetListaClasseMeta, SalvaListaMetaClasse } from "../metadata";
import { IMetaClasse, ListaMetadataClasse, MetadataClasse } from "../metadata/classe.metadata";
import { ListaMetadataMetodo } from "../metadata/metodo.metadata";
import { ListaMetadataParametro } from "../metadata/parametro.metadata";
import { IPostgresClasse, ListaPostgresClasse, PostgresClasse } from "../postgres/classe.postgres";
import { IGrant } from "../postgres/grant";
import { ListaPolicy } from "../postgres/policy";
import { DecoratoreMetodo, TypeDecoratoreMetodo } from "./metodo.decoratore";



/* 
Per EXPRESS passami :
non il nome originale, questo se lo auto prende ed è fondamentale che se lo auto prenda
no l'di, 
no le rotte (a meno che non si sappia cosa si fa, queste verrano inserite poi con la risoluzione delle varie classi!!!), 
no il path a meno che non si voglia cambiare, questo sara automaticamente preso dal nome della classe o dal nome variante se si volesse, 
no ai percorsi, 
LogGenerale puo essere impostato, questa azione lo imprimera l'addove non vi sia gia un log nei vari sotto metodi
cacheOptionRedis e cacheOptionMemory fanno essenzialmente la stessa cosa per il momento è attivo solo memory perche non richede nessun diritto particolare è consigliato inserirlo (vi è anche un valore di default),
Istanziatore, consigliato a livello di metodio singolo è possibile gestirne uno a livello globale similmente al loggenerale
*/




export type TypeDecoratoreClasseSmall = {
    nomeVariante?: string;
    itemExpressClasse?: {
        id?: string;
        nome?: string;
        path?: string;
        html?: IHtml[];
        LogGenerale?: any;
        cacheOptionMemory?: { durationSecondi: number };
        Istanziatore?: (parametri: IParametriEstratti, listaParametri: ListaMetadataParametro) => Promise<any> | any;
    },
    itemPostgresClasse?: {
        queryPerVista?: string,
        like?: string,
        estende?: string,
        abilitaCreatedAt?: boolean,
        abilitaUpdatedAt?: boolean,
        abilitaDeletedAt?: boolean,
        creaId?: boolean,
        listaPolicy?: ListaPolicy,
        grants?: IGrant[],
        multiUnique?: { colonneDiRiferimento: string[] }[]
    },
    itemListaMetodi?: {
        nomeMetodo: string,
        decoratore: TypeDecoratoreMetodo
    }[]
};
export function decoratoreClasseSmall(item?: TypeDecoratoreClasseSmall): any {

    // eslint-disable-next-line @typescript-eslint/ban-types
    return (ctr: Function) => {
        //const tmp: TypeDecoratoreClasse;
        DecoratoreClasse(ctr/* , item */);
    }
}


export type DecoratoreMetodoLista = {
    nomeMetodo: string,
    decoratore: TypeDecoratoreMetodo
};

export type TypeDecoratoreClasse = {
    itemMetaClasse?: IMetaClasse,
    itemExpressClasse?: IExpressClasse,
    itemPostgresClasse?: IPostgresClasse,
    itemListaMetodi?: DecoratoreMetodoLista[]
};
export function decoratoreClasse(item?: TypeDecoratoreClasse): any {

    // eslint-disable-next-line @typescript-eslint/ban-types
    return (ctr: Function) => {
        if (item == undefined) item = { itemMetaClasse: {}, itemPostgresClasse: {}, itemExpressClasse: {} };
        if (item.itemExpressClasse == undefined) item.itemExpressClasse = {};
        if (item.itemMetaClasse == undefined) item.itemMetaClasse = {};
        if (item.itemPostgresClasse == undefined) item.itemPostgresClasse = {};
        DecoratoreClasse(ctr, item);
    }
}
export function DecoratoreClasse(ctr: any, item?: TypeDecoratoreClasse) {
    try {
        if (item) {
            if (item.itemListaMetodi) {
                for (let index = 0; index < item.itemListaMetodi.length; index++) {
                    try {
                        const element = item.itemListaMetodi[index];
                        const funzione = ctr.prototype[element.nomeMetodo];
                        const target = {
                            constructor: {
                                name: (item.itemMetaClasse && item.itemMetaClasse.nomeOriginale != undefined) ? item.itemMetaClasse.nomeOriginale : ctr.name
                            }
                        }
                        DecoratoreMetodo(target, element.nomeMetodo, funzione, element.decoratore);
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
            if (item.itemMetaClasse) {
                const list: ListaMetadataClasse = GetListaClasseMeta<ListaMetadataClasse>('nomeMetadataKeyTargetFor_Metadata', () => { return new ListaMetadataClasse(); });
                item.itemMetaClasse.nomeOriginale = item.itemMetaClasse.nomeOriginale != undefined ? item.itemMetaClasse.nomeOriginale : ctr.name;
                const t = new MetadataClasse(item.itemMetaClasse);
                list.CercaSeNoAggiungi(t);
                SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Metadata', list);
            }
            if (item.itemExpressClasse) {
                if (item.itemExpressClasse) {
                    if (item.itemExpressClasse.listaMetodi == undefined) { item.itemExpressClasse.listaMetodi = new ListaMetadataMetodo(item.itemExpressClasse.listaMetodi) }
                    const listExpress: ListaExpressClasse = GetListaClasseMeta<ListaExpressClasse>('nomeMetadataKeyTargetFor_Express', () => { return new ListaExpressClasse(); });
                    item.itemExpressClasse.nomeOriginale = ctr.name;
                    const t = new ExpressClasse(item.itemExpressClasse);
                    if (item.itemExpressClasse.listaMiddleware) {
                        for (let index = 0; index < item.itemExpressClasse.listaMiddleware.length; index++) {
                            const middlew = item.itemExpressClasse.listaMiddleware[index];
                            for (let index = 0; index < t.listaMetodi.length; index++) {
                                const element = <ExpressMetodo>t.listaMetodi[index];
                                element.metodoLimitazioni.middleware.push(middlew);
                            }
                        }
                    }
                    listExpress.CercaSeNoAggiungi(t);
                    SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Express', listExpress);
                }
            }
            if (item.itemPostgresClasse) {
                if (item.itemPostgresClasse) {
                    if (item.itemPostgresClasse.listaMetodi == undefined) { item.itemPostgresClasse.listaMetodi = new ListaMetadataMetodo(item.itemPostgresClasse.listaMetodi) }
                    const listaPostgres: ListaPostgresClasse = GetListaClasseMeta<ListaPostgresClasse>('nomeMetadataKeyTargetFor_Postgres', () => { return new ListaPostgresClasse(); });
                    item.itemPostgresClasse.nomeOriginale = ctr.name;
                    const t = new PostgresClasse(item.itemPostgresClasse);
                    listaPostgres.CercaSeNoAggiungi(t);
                    SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Postgres', listaPostgres);
                }
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

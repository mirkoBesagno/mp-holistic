
import { ExpressClasse, ListaExpressClasse } from "../express/classe.express";
import { ExpressMetodo, IExpressMetodo } from "../express/metodo.express";
import { GetListaClasseMeta, SalvaListaMetaClasse } from "../metadata";
import { ListaMetadataClasse, MetadataClasse } from "../metadata/classe.metadata";
import { IMetaMetodo, MetadataMetodo } from "../metadata/metodo.metadata";
import { DecoratoreParametro, TypeDecoratoreParametro } from "./parametro.decoratore";


export type TypeDecoratoreMetodo = {
    itemMetaMetodo?: IMetaMetodo, 
    itemExpressMetodo?: IExpressMetodo
    itemListaParametri?: DecoratoreParametroLista[]
};

export type DecoratoreParametroLista = {
    nomeParametro: string,
    decoratore: TypeDecoratoreParametro
};

export function decoratoreMetodo(item?: TypeDecoratoreMetodo) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        DecoratoreMetodo(target, propertyKey, descriptor.value ?? descriptor, item);
    }
}

export function DecoratoreMetodo(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor, item?: TypeDecoratoreMetodo) {

    const nomeMetodo = propertyKey.toString();
    const nomeClasse = target.constructor.name;

    /*  */
    if (item && item?.itemListaParametri) {
        for (let index = 0; index < item.itemListaParametri.length; index++) {
            try {
                const element = item.itemListaParametri[index];
                DecoratoreParametro(nomeClasse, nomeMetodo, index, element.decoratore);
            } catch (error) {
                console.log(error);
            }
        }
    }
    /*  */

    const list: ListaMetadataClasse = GetListaClasseMeta<ListaMetadataClasse>('nomeMetadataKeyTargetFor_Metadata', () => { return new ListaMetadataClasse(); });
    /*  */
    if (item == undefined) {
        item = { itemMetaMetodo: {}, itemExpressMetodo: {} };
    }
    if (item.itemMetaMetodo == undefined) {
        item.itemMetaMetodo = {};
    }
    item.itemMetaMetodo.metodoAvviabile = descriptor;
    item.itemMetaMetodo.nomeOriginale = nomeMetodo.toString();
    const tempMM = new MetadataMetodo(item.itemMetaMetodo);
    /* inizializzo metodo */
    const classeMM = list.CercaSeNoAggiungi(new MetadataClasse({ nomeOriginale: nomeClasse }));
    classeMM.listaMetodi.CercaSeNoAggiungi(tempMM);
    SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Metadata', list);

    if (item.itemExpressMetodo == undefined) {
        item.itemExpressMetodo = {};
    }
    const listExpress: ListaExpressClasse = GetListaClasseMeta<ListaExpressClasse>('nomeMetadataKeyTargetFor_Express', () => { return new ListaExpressClasse(); });
    item.itemExpressMetodo.metodoAvviabile = descriptor;
    item.itemExpressMetodo.nomeOriginale = nomeMetodo.toString();
    const tempEM = new ExpressMetodo(item.itemExpressMetodo);
    const classeEM = listExpress.CercaSeNoAggiungi(new ExpressClasse({ nomeOriginale: nomeClasse }));
    classeEM.listaMetodi.CercaSeNoAggiungi(tempEM);
    SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Express', listExpress);
}
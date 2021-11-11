


import { ExpressClasse, ListaExpressClasse } from "../express/classe.express";
import { ExpressMetodo } from "../express/metodo.express";
import { ExpressParametro, IExpressParametro } from "../express/parametro.express";
import { GetListaClasseMeta, SalvaListaMetaClasse } from "../metadata";
import { ListaMetadataClasse, MetadataClasse } from "../metadata/classe.metadata";
import { MetadataMetodo } from "../metadata/metodo.metadata";
import { IMetaParametro, MetadataParametro } from "../metadata/parametro.metadata";


export type TypeDecoratoreParametro = {
    itemParametro?: IMetaParametro,
    itemExpressParametro?: IExpressParametro
}
export function decoratoreParametro(item: TypeDecoratoreParametro) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {

        const nomeMetodo = propertyKey.toString();
        const nomeClasse = target.constructor.name;
        DecoratoreParametro(nomeClasse, nomeMetodo, parameterIndex, item);
    }
}

export function DecoratoreParametro(nomeClasse: any, nomeMetodo: string, parameterIndex: number, item: TypeDecoratoreParametro) {
    if (item.itemParametro) {
        const list: ListaMetadataClasse = GetListaClasseMeta<ListaMetadataClasse>('nomeMetadataKeyTargetFor_Metadata', () => { return new ListaMetadataClasse(); });
        const classe = list.CercaSeNoAggiungi(new MetadataClasse({ nomeOriginale: nomeClasse }));
        const metodo = classe.listaMetodi.CercaSeNoAggiungi(new MetadataMetodo({ nomeOriginale: nomeMetodo }));
        item.itemParametro.nomeOriginale = parameterIndex.toString();
        item.itemParametro.indexParameter = parameterIndex;
        metodo.listaParametri.CercaSeNoAggiungi(new MetadataParametro(item.itemParametro));
        SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Metadata', list);
    }
    if (item.itemExpressParametro) {
        const listExpress: ListaExpressClasse = GetListaClasseMeta<ListaExpressClasse>('nomeMetadataKeyTargetFor_Express', () => { return new ListaExpressClasse(); });
        const classe = listExpress.CercaSeNoAggiungi(new ExpressClasse({ nomeOriginale: nomeClasse }));
        const metodo = classe.listaMetodi.CercaSeNoAggiungi(new ExpressMetodo({ nomeOriginale: nomeMetodo }));
        item.itemExpressParametro.nomeOriginale = parameterIndex.toString();
        item.itemExpressParametro.indexParameter = parameterIndex;
        metodo.listaParametri.CercaSeNoAggiungi(new ExpressParametro(item.itemExpressParametro));
        SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Express', listExpress);
    }
}
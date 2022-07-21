import { GetListaClasseMeta, SalvaListaMetaClasse } from "../metadata";
import { ListaMetadataClasse, MetadataClasse } from "../metadata/classe.metadata";
import { IMetaProprieta, MetadataProprieta } from "../metadata/proprieta.metadata";
import { ListaPostgresClasse, PostgresClasse } from "../postgres/classe.postgres";
import { IPostgresProprieta, PostgresProprieta } from "../postgres/proprieta.postgres";




export type TypeDecoratoreProprieta = {
    itemMetaProprieta?: IMetaProprieta,
    itemPostgresProprieta?: IPostgresProprieta,
};

export function decoratoreProprieta(item: TypeDecoratoreProprieta) {
    return (target: any, propertyKey: PropertyKey): any => {
        const nomeClasse = target.constructor.name;
        const nomeProprieta = propertyKey.toString();
        DecoratoreProprieta(nomeClasse, nomeProprieta, item);
    };
}
export function DecoratoreProprieta(nomeClasse: string, nomeProprieta: string, item: TypeDecoratoreProprieta) {
    try {
        if (item) {
            if (item.itemMetaProprieta) {
                const list: ListaMetadataClasse = GetListaClasseMeta<ListaMetadataClasse>('nomeMetadataKeyTargetFor_Metadata', () => { return new ListaMetadataClasse(); });

                const classe = list.CercaSeNoAggiungi(new MetadataClasse({ nomeOriginale: nomeClasse }));
                const proprieta = classe.listaProprieta.CercaSeNoAggiungi(new MetadataProprieta(item.itemMetaProprieta));
                proprieta.nome = nomeProprieta;
                SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Metadata', list);
            }
            if (item.itemPostgresProprieta) {
                const list: ListaPostgresClasse = GetListaClasseMeta<ListaPostgresClasse>('nomeMetadataKeyTargetFor_Postgres', () => { return new ListaPostgresClasse(); });

                const classe = list.CercaSeNoAggiungi(new PostgresClasse(
                    { 
                        nomeOriginale: nomeClasse, 
                        creaId: true, 
                        tracciamento:false,
                        abilitaUpdatedAt: true, 
                        abilitaDeletedAt: true, 
                        abilitaCreatedAt: true, 
                        nomeTabella: nomeClasse 
                    }));
                const proprieta = classe.listaProprieta.CercaSeNoAggiungi(new PostgresProprieta(item.itemPostgresProprieta));
                proprieta.nome = nomeProprieta;
                SalvaListaMetaClasse('nomeMetadataKeyTargetFor_Postgres', list);
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}


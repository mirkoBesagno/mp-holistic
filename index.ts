



import { Client } from "pg";
import "reflect-metadata";
import { decoratoreClasse } from "./bin/decoratori/classe.decoratore";
import { decoratoreMetodo } from "./bin/decoratori/metodo.decoratore";
import { decoratoreProprieta } from "./bin/decoratori/proprieta,decoratore";
import { ListaExpressClasse } from "./bin/express/classe.express";
import { Main } from "./bin/main/main";
import { GetListaClasseMeta } from "./bin/metadata";
import { ListaMetadataClasse } from "./bin/metadata/classe.metadata";


/* const Saluto:{
    itemParametro?: IMetaParametro | undefined;
    itemExpressParametro?: IExpressParametro | undefined;
} ={
    itemParametro:{tipo:'any', obbligatorio:false,indexParameter:0, nomeVariante:'e' },
    itemExpressParametro:{
        posizione:'query'
     }
} */

/* 
@decoratoreClasse({
    itemMetaClasse: {
        nomeVariante: 'a'
    }, itemExpressClasse: {
        nomeVariante: 'b'
    }, itemListaMetodi: [
        {
            nomeMetodo: 'SalutoDefinitoDallaClasse',
            decoratore: {
                itemMetaMetodo: {
                    nomeVariante: 'SalutoDefDalClas'
                }, itemExpressMetodo: {
                    nomeVariante: 'SalutoDefDalClasse'
                }
            }
        },
        {
            nomeMetodo: 'SalutoDefinitoDallaClasseConParametri',
            decoratore: {
                itemMetaMetodo: {
                    nomeVariante: 'SalutoDefinitoDallaClasseConParametri'
                }, itemExpressMetodo: {
                    nomeVariante: 'SalutoDefinitoDallaClasseConParametri'
                },
                itemListaParametri: [
                    {
                        nomeParametro: 'nome',
                        decoratore: {
                            itemExpressParametro: { posizione: 'query', nomeVariante: 'nome' },
                            itemParametro: { nomeVariante: 'nome' }
                        }
                    }
                ]
            }
        }
    ], itemPostgresClasse: {
        nomeVariante: 'b',
        abilitaCreatedAt: true,
        abilitaUpdatedAt: true,
        abilitaDeletedAt: true,
        creaId: true,
        nomeTabella: 'b'
    }
})
export class Persona {

    @decoratoreProprieta({
        itemMetaProprieta: { tipo: 'varchar(n)', nome: 'nomeFiscale' },
        itemPostgresProprieta: {
            nome: 'nomeFiscale', tipo: 'varchar(n)', sommario: '', descrizione: '',
            trigger: [
                {
                    Validatore: (NEW: any, OLD: any, argomenti: any[], instantevent: any, surgevent: any) => {
                        if (NEW == 'Mirko') {
                            throw new Error("Errore, no no!!!");
                        }
                    }, instantevent: 'BEFORE', surgevent: ['INSERT'], nomeFunzione: 'ctr', nomeTrigger: 'ctr'
                }
            ],
        }
    })
    nomeFiscale = '';

    @decoratoreMetodo({ itemMetaMetodo: { nomeVariante: 'Rinominato1' }, itemExpressMetodo: { nomeVariante: 'Rinominato2' } })
    SalutoDefinito() {
        return '-Ciao : SalutoDefinito';
    }

    @decoratoreMetodo()
    SalutoNonDefinito() {
        return '-Ciao : SalutoNonDefinito';

    }

    SalutoDefinitoDallaClasse() {
        return '-Ciao : SalutoDefinitoDallaClasse';
    }
    SalutoDefinitoDallaClasseConParametri(nome: string) {
        return '-Ciao : SalutoDefinitoDallaClasseConParametri: ' + nome + '   -;';
    }

    @decoratoreMetodo({
        itemMetaMetodo: { nomeVariante: 'Rinominato3' },
        itemExpressMetodo: { nomeVariante: 'Rinominato4' }
    })
    SalutoDefinitoConParametri(@decoratoreParametro({ itemExpressParametro: { posizione: 'query', nomeVariante: 'nome' }, itemParametro: { nomeVariante: 'nome' } }) nome: string) {
        return '-Ciao : SalutoDefinito con parametri: ' + nome + '   -;';
    }

    @decoratoreMetodo({
        itemMetaMetodo: { nomeVariante: 'Rinominato5' },
        itemExpressMetodo: { nomeVariante: 'Rinominato6' },
        itemListaParametri: [
            {
                nomeParametro: 'nome',
                decoratore: {
                    itemExpressParametro: { posizione: 'query', nomeVariante: 'nome' },
                    itemParametro: { nomeVariante: 'nome' }
                }
            }
        ]
    })
    SalutoDefinitoConParametriNelDcoratoreMetodo(nome: string) {
        return '-Ciao : SalutoDefinitoConParametriNelDcoratoreMetodo con parametri: ' + nome + '   -;';
    }

    @decoratoreMetodo({
        itemMetaMetodo: { nomeVariante: 'Rinominato7' },
        itemExpressMetodo: {
            nomeVariante: 'Rinominato8',
            metodoEventi: {
                Istanziatore: (parametri: IParametriEstratti, listaParametri: ListaMetadataParametro) => {
                    const tmp = new Persona();
                    tmp.nomeFiscale = 'ufgdfh';
                    return tmp;
                }
            }
        },
        itemListaParametri: [
            {
                nomeParametro: 'nome',
                decoratore: {
                    itemExpressParametro: { posizione: 'query', nomeVariante: 'nome' },
                    itemParametro: { nomeVariante: 'nome' }
                }
            }
        ]
    })
    SalutoDefinitoConParametriNelDcoratoreMetodoValidato(nome: string) {
        return '-Ciao : SalutoDefinitoConParametriNelDcoratoreMetodo con parametri: ' + nome + '   -; Sono fiscalmente: ' + this.nomeFiscale + '-;';
    }
} */


@decoratoreClasse({
    itemMetaClasse: {
        nomeVariante: 'a'
    },
    itemExpressClasse: {
        nomeVariante: 'b'
    },
    itemPostgresClasse: {
        nomeVariante: 'b',
        abilitaCreatedAt: true,
        abilitaUpdatedAt: true,
        abilitaDeletedAt: true,
        creaId: true,
        nomeTabella: 'b'
    }
})
export class Persona {

    @decoratoreProprieta({
        itemMetaProprieta: { tipo: 'varchar(n)', nome: 'nomeFiscale' },
        itemPostgresProprieta: {
            nome: 'nomeFiscale', tipo: 'varchar(n)', sommario: '', descrizione: '',
            trigger: [
                {
                    Validatore: (NEW: any, OLD: any, argomenti: any[], instantevent: any, surgevent: any) => {
                        if (NEW == 'Mirko') {
                            throw new Error("Errore, no no!!!");
                        }
                    }, instantevent: 'BEFORE', surgevent: ['INSERT'], nomeFunzione: 'ctr', nomeTrigger: 'ctr'
                }
            ],
        }
    })
    nomeFiscale = '';

    @decoratoreMetodo({ itemMetaMetodo: { nomeVariante: 'Rinominato1' }, itemExpressMetodo: { nomeVariante: 'Rinominato2' } })
    SalutoDefinito() {
        return '-Ciao : SalutoDefinito';
    }

    @decoratoreMetodo()
    SalutoNonDefinito() {
        return '-Ciao : SalutoNonDefinito';

    }
}

function Start() {
    const tmp = GetListaClasseMeta<ListaMetadataClasse>('nomeMetadataKeyTargetFor_Metadata');
    const tmp1 = GetListaClasseMeta<ListaExpressClasse>('nomeMetadataKeyTargetFor_Express');
    console.log(tmp, tmp1);
}

Start();

const main = new Main('api', undefined, false);
main.expressMain.Inizializza('localhost', 8080, undefined, false);

main.postgresMain.InizializzaORM();

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'postgres',
    port: 5432,
});
main.postgresMain.IstanziaORM(client);
main.expressMain.ScriviFile(__dirname);
main.postgresMain.ScriviFile(__dirname);
main.expressMain.StartHttpServer();

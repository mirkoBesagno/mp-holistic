import { Client } from "pg";
import { GetListaClasseMeta } from "../metadata";
import { DropAllTable, ListaPostgresClasse, PostgresClasse, TriggerUpdate_updated_at_column } from "./classe.postgres";
import { ListaPolicy } from "./policy";
import { Role, User } from "./role";
import fs from 'fs';

export interface IConnectionOption {
    user?: string | undefined;
    database?: string | undefined;
    port: number;
    host: string;
    password?: string | undefined;
}


export interface IReturnQueryControllata {
    risultato?: string, errore?: {
        query: string,
        errore: string
    }, index: number
}

export async function EseguiQueryControllata(client: Client, query: string): Promise<IReturnQueryControllata> {
    try {
        if (query != "") {
            await client.query(query);
            console.log('ESEGUITOO : \n' + query);
            return {
                index: 0,
                errore: undefined,
                risultato: query
            }
        }
        return {
            index: 0,
            errore: undefined,
            risultato: query
        }
    } catch (error) {
        console.log('\n\nINIZIO Errroe : \n**********************\n\n');
        console.log('-Query:\n' + query + '\n\n');
        console.log('-Error:\n' + error);
        console.log('\n\nFINE Errroe : \n**********************\n\n');
        return {
            index: 0,
            errore: {
                query: query,
                errore: '' + error
            },
            risultato: undefined
        }
    }
}
export interface ISetInizializzaORM {
    /**
     * se noin settato o se impostato a true, comportera l'eliminazione preventiva di tutto il database e la pulizia di ruoli ecc, 
     * che inevitabilmente cancellera ogni dato. 
     */
    dropAllTable?: boolean,
    /**
     * registra qui i tuoi ruoli
     */
    listaRuoli?: Role[],
    /**
     * registra qui i tuoi user
     */
    listaUser?: User[]
}
export class MainPostgres {

    listaRuoli: Role[] = [];
    listaUser: User[] = [];
    elencoQuery: string[] = [];
    listaClassi: ListaPostgresClasse;
    constructor() {
        this.listaRuoli = [];
        this.listaUser = [];
        this.listaClassi = GetListaClasseMeta<ListaPostgresClasse>('nomeMetadataKeyTargetFor_Postgres', () => { return new ListaPostgresClasse(); });
    }

    InizializzaORM(item?: ISetInizializzaORM): string {
        try {
            if (item == undefined) item = {};
            const ritorno = '';
            this.elencoQuery.push(`CREATE EXTENSION plv8;`);
            if (item.dropAllTable == undefined || item.dropAllTable == true) {
                this.elencoQuery.push(DropAllTable());
            }
            this.elencoQuery.push(TriggerUpdate_updated_at_column());
            //
           // this.elencoQuery.push();
            //
            this.InizializzaRuoli(this.elencoQuery, item.listaRuoli ?? []);
            this.InizializzaUser(this.elencoQuery, item.listaUser ?? []);
            /*  */
            for (const element of this.listaClassi) {
                (<PostgresClasse>element).CostruisciCreazioneDB(this.elencoQuery, true);
            }
            /* for (const element of this.listaClassi) {
                (<PostgresClasse>element).CostruisciCreazioneDB(this.elencoQuery, false);
            } */
            for (const element of this.listaClassi) {
                (<PostgresClasse>element).CostruisciRelazioniDB(this.elencoQuery);
            }
            for (const element of this.listaClassi) {
                (<PostgresClasse>element).CostruisceGrant((<PostgresClasse>element).grants ?? [], this.elencoQuery);
            }
            for (const element of this.listaClassi) {
                if ((<PostgresClasse>element).listaPolicy) {
                    ((<PostgresClasse>element).listaPolicy ?? new ListaPolicy()).CostruiscePolicySicurezza(this.elencoQuery);
                }
            }
            this.InizializzaRuoliGrantGenerale(this.elencoQuery, this.listaRuoli);
            this.InizializzaUserGrantGenerale(this.elencoQuery, this.listaUser);
            return ritorno;
        } catch (error) {
            console.log('');
            throw error;
        }
    }
    async IstanziaORM(client: Client) {
        try {
            await client.connect();

            //console.log('\n!!!!!!?????######\n\n\n\n' + orm + '\n\n\n\n\n\n!!!!!!?????######\n');

            const vetRisultatiQuery: IReturnQueryControllata[] = [];
            for (let index = 0; index < this.elencoQuery.length; index++) {
                const element = this.elencoQuery[index];
                const tmp = await EseguiQueryControllata(client, element);
                tmp.index = index;
                vetRisultatiQuery.push(tmp);
            }

            console.log('*******');
            console.log('\n\n\n');
            // console.log(orm); 
            console.log('\n\n\n');
            console.log('*******');

            let count = 0;
            const tmp1 = [];
            for (let index = 0; index < vetRisultatiQuery.length; index++) {
                const element = vetRisultatiQuery[index];
                if (element.errore) {
                    console.log(element.errore);
                    tmp1.push(element.errore);
                    count++;
                }
            }
            console.log('*******');
            console.log('\n\n\n');
            console.log('Query finiti in errore: \n');
            // console.log(orm); 
            console.log(count);
            console.log('\n\n\n');
            console.log('*******');
            const tmp2 = [];
            count = 0;
            for (let index = 0; index < vetRisultatiQuery.length; index++) {
                const element = vetRisultatiQuery[index];
                if (element.risultato) {
                    console.log(element.risultato);
                    tmp2.push(element.risultato)
                    count++;
                }
            }
            console.log('*******');
            console.log('\n\n\n');
            console.log('Query finiti in eseguite: \n');
            // console.log(orm);
            console.log(count);
            console.log('\n\n\n');
            console.log('*******');
            count = 0;
        } catch (error) {
            console.log(error);
        }
    }
    async IstanziaTutto(client: Client) {
        this.InizializzaORM();
        await this.IstanziaORM(client);
    }
    async EseguiListaQuery(clientConnection: IConnectionOption, querys: string[]): Promise<IReturnQueryControllata[]> {
        const tmp = await this.EseguiQueryControllata(clientConnection, querys);
        return tmp;
    }
    private InizializzaRuoli(/* client: Client */elencoQuery: string[], listaRuoli?: Role[]) {
        let ritornoTmp = '';
        if (listaRuoli) {
            for (let index = 0; index < listaRuoli.length; index++) {
                const element = listaRuoli[index];
                const faxs = `CREATE ROLE "${element.nome}" WITH 
                ${element.option.isSuperUser != undefined && element.option.isSuperUser == true ? 'SUPERUSER' : 'NOSUPERUSER'} 
                ${element.option.creaDB != undefined && element.option.creaDB == true ? 'CREATEDB' : 'NOCREATEDB'}
                ${element.option.creaUser != undefined && element.option.creaUser == true ? 'CREATEROLE' : 'NOCREATEROLE'} 
                INHERIT 
                ${element.option.login != undefined && element.option.login == true ? 'LOGIN' : 'NOLOGIN'} 
                NOREPLICATION   
                NOBYPASSRLS 
                ENCRYPTED PASSWORD '${element.password}' 
                ${element.connectionLimit != undefined ? 'CONNECTION LIMIT ' + element.connectionLimit : ''} 
                ; \n`;
                const faxsDrop = `DROP ROLE IF EXISTS "${element.nome}";`;
                elencoQuery.push(faxsDrop);
                elencoQuery.push(faxs);
                ritornoTmp = faxs;
                this.listaRuoli.push(element);
            }
        }
        return ritornoTmp;
    }
    private InizializzaRuoliGrantGenerale(/* client: Client */elencoQuery: string[], listaRuoli?: Role[]) {
        let ritornoTmp = '';
        if (listaRuoli) {
            for (let index = 0; index < listaRuoli.length; index++) {
                const element = listaRuoli[index];
                const faxSchema = `GRANT USAGE
                ON ALL SEQUENCES IN SCHEMA public
                TO "${element.nome}";`;
                elencoQuery.push(faxSchema);
                const faxFunction = `GRANT EXECUTE
                ON ALL functions IN SCHEMA public
                    TO "${element.nome}";`;
                elencoQuery.push(faxFunction);
                ritornoTmp = faxSchema;
            }
        }
        return ritornoTmp;
    }
    private InizializzaUser(/* client: Client */elencoQuery: string[], listaUser?: User[]) {
        let ritornoTmp = '';
        if (listaUser) {
            for (let index = 0; index < listaUser.length; index++) {
                const element = listaUser[index];
                const costruisciRuoli = this.CostruisciRuoli(element.inRole);
                const faxs = `CREATE USER "${element.nome}" WITH 
                ${element.option.isSuperUser != undefined && element.option.isSuperUser == true ? 'SUPERUSER' : 'NOSUPERUSER'} 
                ${element.option.creaDB != undefined && element.option.creaDB == true ? 'CREATEDB' : 'NOCREATEDB'}
                ${element.option.creaUser != undefined && element.option.creaUser == true ? 'CREATEROLE' : 'NOCREATEROLE'} 
                INHERIT 
                ${element.option.login != undefined && element.option.login == true ? 'LOGIN' : 'NOLOGIN'} 
                NOREPLICATION  
                NOBYPASSRLS 
                PASSWORD '${element.password}' 
                ${element.connectionLimit != undefined ? 'CONNECTION LIMIT ' + element.connectionLimit : ''} 
                IN ROLE ${costruisciRuoli}
                ; \n`;

                const faxsDrop = `DROP USER IF EXISTS "${element.nome}";`;
                elencoQuery.push(faxsDrop);
                elencoQuery.push(faxs);
                this.listaUser.push(element);

                ritornoTmp = ritornoTmp + faxs;
            }
        }
        return ritornoTmp;
    }
    private InizializzaUserGrantGenerale(/* client: Client */elencoQuery: string[], listaUser?: User[]) {
        let ritornoTmp = '';
        if (listaUser) {
            for (let index = 0; index < listaUser.length; index++) {
                const element = listaUser[index];
                const faxSchema = `GRANT USAGE
                ON ALL SEQUENCES IN SCHEMA public
                TO "${element.nome}";`;
                elencoQuery.push(faxSchema);
                const faxFunction = `GRANT EXECUTE
                ON ALL functions IN SCHEMA public
                    TO "${element.nome}";`;
                elencoQuery.push(faxFunction);

                ritornoTmp = ritornoTmp + faxSchema;
            }
        }
        return ritornoTmp;
    }
    private CostruisciRuoli(item: string[]) {
        let ritorno = '';
        for (let index = 0; index < item.length; index++) {
            const element = item[index];
            if (index + 1 <= item.length && index != 0) ritorno = ritorno + ', ' + element;
            else ritorno = ritorno + ' ' + element;
        }
        return ritorno;
    }
    async EseguiQueryControllata(clientConnection: IConnectionOption, querys: string[]): Promise<IReturnQueryControllata[]> {
        try {
            const db = new Client({
                host: clientConnection.host,
                port: clientConnection.port,
                user: clientConnection.user,
                password: clientConnection.password,
                database: clientConnection.database
            })
            await db.connect();

            const vetRisultatiQuery: IReturnQueryControllata[] = [];
            for (let index = 0; index < querys.length; index++) {
                const element = querys[index];
                try {
                /* const result =  */await db.query(element);
                    console.log('ESEGUITOO : \n' + element);
                    vetRisultatiQuery.push({
                        index: index,
                        errore: undefined,
                        risultato: element
                    });
                } catch (error) {
                    console.log('\n\nINIZIO Errroe : \n**********************\n\n');
                    console.log('-Query:\n' + element + '\n\n');
                    console.log('-Error:\n' + error);
                    console.log('\n\nFINE Errroe : \n**********************\n\n');
                    vetRisultatiQuery.push({
                        index: index,
                        errore: {
                            query: element,
                            errore: '' + error
                        },
                        risultato: undefined
                    });
                }
            }
            return vetRisultatiQuery;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    ScriviFile(pathDoveScrivereFile: string): string {
        try {

            try {
                fs.rmSync(pathDoveScrivereFile + '/FileGenerati_MP/postgres', { recursive: true });
            } catch (error) {
                console.log("...");
            }
            fs.mkdirSync(pathDoveScrivereFile + '/FileGenerati_MP/postgres', { recursive: true });


            try {
                const path = pathDoveScrivereFile + '/FileGenerati_MP' + '/postgres';
                let query: string[] = [];

                fs.mkdirSync(path + '/Generici', { recursive: true });

                for (let index = 0; index < this.elencoQuery.length; index++) {
                    const element = this.elencoQuery[index];
                    //fs.writeFileSync(path + '/exe.dump', element.toString());
                    fs.appendFileSync(path + '/exe.dump', '\n' + element.toString());
                }

                for (const element of this.listaClassi) {
                    (<PostgresClasse>element).CostruisciCreazioneDB(query, false);
                }
                //fs.writeFileSync(path + '/Generici/relazioni.generale', query.toString());
                fs.appendFileSync(path + '/Generici/relazioni.generale', '\n' + query.toString());
                query = [];
                for (const element of this.listaClassi) {
                    (<PostgresClasse>element).CostruisceGrant((<PostgresClasse>element).grants ?? [], query);
                }
                //fs.writeFileSync(path + '/Generici/grant.generale', query.toString());
                fs.appendFileSync(path + '/Generici/grant.generale', '\n' + query.toString());
                query = [];
                for (const element of this.listaClassi) {
                    if ((<PostgresClasse>element).listaPolicy) {
                        ((<PostgresClasse>element).listaPolicy ?? new ListaPolicy()).CostruiscePolicySicurezza(query);
                        //fs.writeFileSync(path + '/Generici/policy.generale', query.toString());
                        fs.appendFileSync(path + '/Generici/policy.generale', '\n' + query.toString());
                    }
                }
                /*  */
                query = [];
                fs.mkdirSync(path + '/Specifici', { recursive: true });
                for (const element of this.listaClassi) {
                    const pathSpec = path + '/Specifici/' + element.nomeOriginale;
                    fs.mkdirSync(pathSpec, { recursive: true });
                    query = [];
                    (<PostgresClasse>element).CostruisciCreazioneDB(query, false);
                    //fs.writeFileSync(pathSpec + '/relazioni.' + element.nomeOriginale, query.toString());
                    fs.appendFileSync(pathSpec + '/relazioni.' + element.nomeOriginale, '\n' + query.toString());
                    query = [];
                    (<PostgresClasse>element).CostruisceGrant((<PostgresClasse>element).grants ?? [], query);
                    //fs.writeFileSync(pathSpec + '/grant.' + element.nomeOriginale, query.toString());
                    fs.appendFileSync(pathSpec + '/grant.' + element.nomeOriginale, '\n' + query.toString());
                    if ((<PostgresClasse>element).listaPolicy) {
                        query = [];
                        ((<PostgresClasse>element).listaPolicy ?? new ListaPolicy()).CostruiscePolicySicurezza(query);
                        //fs.writeFileSync(pathSpec + '/policy.' + element.nomeOriginale, query.toString());
                        fs.appendFileSync(pathSpec + '/policy.' + element.nomeOriginale, '\n' + query.toString());
                    }
                }

            } catch (error) {
                console.log(error);
            }
            return '';

        } catch (error: any | Error) {
            console.log(error);
            return error.message ?? '';
        }
    }
}
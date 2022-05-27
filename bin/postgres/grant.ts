



export type typeGrantEvent = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE' | 'REFERENCES' | 'TRIGGER' | 'ALL PRIVILEGES'
export interface IGrant {
    ruoli: string[],
    tabellaDestinazione?: string,
    colonneRiferimento?: string[]
    events: typeGrantEvent[]
    // where: (NEW: any, OLD: any) => void | true | Error
}

/* import { CostruisciEvents, CostruisciRuoli, EseguiQueryControllata } from "../classe/metadata-classe";


export class Grant {

    
    async CostruisceGrant(grants: IGrant[], client: Client) {
        let ritorno = '';
        for (let index = 0; index < grants.length; index++) {
            const element = grants[index];
            const eventitesto = CostruisciEvents(element.events);
            const ruolitesto = CostruisciRuoli(element.ruoli);
            const tmp = `GRANT ${eventitesto}
            ON ${this.nomeTabella} 
            TO ${ruolitesto}
            ;`;
            await EseguiQueryControllata(client, tmp);
            ritorno = ritorno + tmp;
        }
        for (let index = 0; index < this.listaProprieta.length; index++) {
            const element = this.listaProprieta[index];

            for (let index = 0; element.grants && index < element.grants.length; index++) {
                const element2 = element.grants[index];
                const eventitesto = CostruisciEvents(element2.events, element.nome);
                const ruolitesto = CostruisciRuoli(element2.ruoli);
                const tmp = `GRANT ${eventitesto} 
                ON "${this.nomeTabella}" 
                TO ${ruolitesto}
                ;`;
                ritorno = ritorno + tmp;
                await EseguiQueryControllata(client, tmp);
            }
        }
        return ritorno;
    }

} */





export type TypeIstantevent = 'BEFORE' | 'AFTER' | 'INSTEAD OF';

export type TypeSurgevent = 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';


export interface ITrigger {
    instantevent?: TypeIstantevent,
    surgevent?: TypeSurgevent[],
    nomeTrigger: string,
    nomeFunzione: string,
    Validatore: string | ((NEW: any, OLD: any, argomenti: any[], instantevent: any, surgevent: any) => void | Error),
    typeFunction?: 'plv8' | 'sql'
}

export class Trigger implements ITrigger {

    instantevent: TypeIstantevent;
    surgevent: TypeSurgevent[];
    nomeTrigger: string;
    nomeFunzione: string;
    Validatore: string | ((nuovo: any, vecchio: any, argomenti: any[], instantevent: any, surgevent: any) => void | Error);
    typeFunction?: 'plv8' | 'sql';

    CostruisceTrigger(nomeTabella: string): string {
        let tmp = '';
        for (let index = 0; index < this.surgevent.length; index++) {
            const el = this.surgevent[index];
            tmp = tmp + el;
            if (index + 1 < this.surgevent.length) {
                tmp = tmp + ' OR ';
            }
        }
        let corpoFunzione = '';
        try {
            if (typeof this.Validatore === 'function') {
                const strg = String(this.Validatore);

                const tt = strg.indexOf('{');
                const t1 = strg.substring(tt + 1, strg.length);
                const t2 = t1.lastIndexOf('}');
                const t3 = t1.substring(0, t2 - 1);
                corpoFunzione = t3;
            }
            else {
                corpoFunzione = String(this.Validatore);
            }

        } catch (error) {
            console.log('\n*****\n' + error + '\n********\n\n');
            corpoFunzione = '';
        }
        try {
            //COMMENT ON FUNCTION "FN_${this.nomeFunzione}"() IS 'Hei tanto roba questa è scritta usando plv8!!';
            const queri1 = `
                CREATE OR REPLACE FUNCTION "FN_${this.nomeFunzione}_xTR_${this.nomeTrigger}"() RETURNS trigger AS
                $$
                    ${corpoFunzione}
                $$
                LANGUAGE "${this.typeFunction ?? 'plv8'}";
        
                CREATE TRIGGER "TR_${this.nomeTrigger}"
                    ${this.instantevent} 
                    ${tmp} 
                    ON "${nomeTabella}" 
                    FOR EACH ROW
                    EXECUTE PROCEDURE "FN_${this.nomeFunzione}_xTR_${this.nomeTrigger}"();
                `;
            return queri1;
            //await client.query(queri1);
        } catch (error) {
            console.log('\n*****\n' + error + '\n********\n\n');
        }
        return '';
    }
    constructor(item?: ITrigger) {
        if (item) {
            this.instantevent = item.instantevent ?? 'BEFORE';
            this.surgevent = item.surgevent ?? ['INSERT','DELETE','UPDATE'];
            this.nomeTrigger = item.nomeTrigger;
            this.nomeFunzione = item.nomeFunzione;
            this.Validatore = item.Validatore;
            this.typeFunction = item.typeFunction;
        } else {
            this.instantevent = 'AFTER';
            this.surgevent = ['INSERT','DELETE','UPDATE'];
            this.nomeTrigger = '';
            this.nomeFunzione = '';
            this.Validatore = '';
            this.typeFunction = 'sql';
        }
    }
}
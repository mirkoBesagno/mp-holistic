import { IMetaProprieta, ListaMetadataProprieta, MetadataProprieta } from "../metadata/proprieta.metadata";
import { ORMObject, tipo, VerificaGenerica } from "../utility";
import { ListaPostgresClasse } from "./classe.postgres";
import { Constraint, IConstraints } from "./constraint";
import { IGrant } from "./grant";
import { ITrigger, Trigger } from "./trigger";



export interface IPostgresProprieta extends IMetaProprieta {

    Constraints?: IConstraints;

    valore?: any;

    descrizione: string;
    sommario: string;
    trigger?: ITrigger[],
    grants?: IGrant[],

    getCheck?: (valore: any) => boolean | Error,
    setCheck?: (valore: any) => boolean | any | Error

}


export class PostgresProprieta extends MetadataProprieta implements IPostgresProprieta {

    //funzione 
    Constraints?: Constraint;
    /*  */


    valore: any;
    nome: string;
    tipo: tipo;

    descrizione: string;
    sommario: string;

    trigger?: Trigger[];
    grants?: IGrant[];

    constructor(item: IPostgresProprieta) {
        super(item);
        this.nome = item.nome;
        this.tipo = item.tipo;

        this.descrizione = "";
        this.sommario = "";
        /*  */
        if(item.nome && this.nomeOriginale == '') this.nomeOriginale = item.nome;

        if (item) {
            if (item.Constraints) this.Constraints = new Constraint(item.Constraints);
            if (item.sommario) this.sommario = item.sommario;
            if ((<ORMObject>(<tipo>item.tipo)).tipo &&
                (<ORMObject>(<tipo>item.tipo)).colonnaRiferimento &&
                (<ORMObject>(<tipo>item.tipo)).tabellaRiferimento) {
                this.tipo = new ORMObject(
                    (<ORMObject>item.tipo).colonnaRiferimento,
                    (<ORMObject>item.tipo).tabellaRiferimento,
                    (<ORMObject>item.tipo).onDelete,
                    (<ORMObject>item.tipo).onUpdate
                );
            }
            else {
                if (item.tipo) this.tipo = item.tipo;
            }
            if (item.valore) this.valore = item.valore;
            if (item.descrizione) this.descrizione = item.descrizione;
            if (item.nome) this.nome = item.nome;/* 
            else if (this.nome == '' || this.nome == undefined) this.nome = item.nome; */

            if (item.trigger) this.CostruisciListaTrigger(item.trigger);
            if (item.grants) this.grants = item.grants;
        }

    }

    Verifica(): boolean {
        try {
            if (VerificaGenerica(this.tipo, this.valore)) {
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.log('ciao');
            throw error;
        }
    }
    /* static Verifica(tipo: tipo, valore: any): boolean {
        try {
            switch (tipo) {
                case 'array':
                    valore = Array(valore);
                    break;
                case 'boolean':
                    valore = Boolean(valore);
                    break;
                case 'date':
                case 'timestamptz':
                    valore = new Date(valore);
                    break;
                case 'decimal':
                case 'smallint':
                case 'integer':
                case 'numeric':
                case 'real':
                case 'smallserial':
                case 'serial':
                    valore = Number(valore);
                    break;
                case 'object':
                    valore = Object(valore);
                    break;
                case 'text':
                case 'varchar(n)':
                case 'character(n)':
                    valore = String(valore);
                    break;
                case 'any': break;
                default:
                    return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    } */
    AppoggioCostruzioneStringa(item: tipo) {
        let tmpRitorno = '';
        switch (item) {
            //ARRAY
            case 'array': tmpRitorno = '"' + this.nome + '"' + " int"; break;
            //BOOLEAN
            case 'boolean': tmpRitorno = '"' + this.nome + '"' + " bool"; break;
            //DATE :
            case 'timestamptz': tmpRitorno = '"' + this.nome + '"' + " timestamptz"; break;
            case 'date': tmpRitorno = '"' + this.nome + '"' + " date"; break;
            //
            //NUMBER : case 'number': tmpRitorno = '"' + this.nome + '"' + " int"; break; // float8, int, int4, int8, decimal
            case 'decimal': tmpRitorno = '"' + this.nome + '"' + " decimal"; break;
            case 'smallint': tmpRitorno = '"' + this.nome + '"' + " smallint"; break;
            case 'integer': tmpRitorno = '"' + this.nome + '"' + " integer"; break;
            case 'numeric': tmpRitorno = '"' + this.nome + '"' + " numeric"; break;
            case 'real': tmpRitorno = '"' + this.nome + '"' + " real"; break;
            case 'smallserial': tmpRitorno = '"' + this.nome + '"' + " smallserial"; break;
            case 'serial': tmpRitorno = '"' + this.nome + '"' + " serial"; break;
            //
            //STRING :
            case 'text': tmpRitorno = '"' + this.nome + '"' + " text"; break;
            case 'varchar(n)': tmpRitorno = '"' + this.nome + '"' + " varchar(255)"; break;
            case 'character(n)': tmpRitorno = '"' + this.nome + '"' + " character(255)"; break;
            //
            //ANY
            case 'any': tmpRitorno = '"' + this.nome + '"' + " varchar(255)"; break;
            default: tmpRitorno = '"' + this.nome + '"' + " varchar(255)"; break;
        }
        return tmpRitorno;
    }
    CostruisciCreazioneDB(nomeClasse: string): string {
        let tmpRitorno = '';
        if (this.tipo instanceof ORMObject) {
            /* Qui creo alter table ecc.. */
            tmpRitorno = this.AppoggioCostruzioneStringa(this.tipo.colonnaRiferimento);
        }
        else {
            tmpRitorno = this.AppoggioCostruzioneStringa(this.tipo);
        }
        if (this.Constraints) {
            tmpRitorno = tmpRitorno + this.Constraints.CostruisciConstraint(nomeClasse)
        }
        return tmpRitorno;
    }
    /* CostruisciCkeck(element: ICheck, client: Client) {

        let corpoFunzione = '';
        try {
            if (typeof element.check === 'function') {
                const strg = String(element.check);

                const tt = strg.indexOf('{');
                const t1 = strg.substring(tt + 1, strg.length);
                const t2 = t1.lastIndexOf('}');
                const t3 = t1.substring(0, t2 - 1);
                corpoFunzione = t3;
                console.log(strg);
            }
            else {
                corpoFunzione = String(element.check);
                return '';
            }

        } catch (error) {
            console.log('\n*****\n' + error + '\n********\n\n');
            corpoFunzione = '';
        }
        const tmp = `
        CREATE OR REPLACE FUNCTION "FN_cn_ck_${element.nome}"() RETURNS boolean AS
        $$
            ${corpoFunzione}
        $$
        LANGUAGE "plv8";
        `
        EseguiQueryControllata(client, tmp);
        return 'FN_cn_ck_' + element.nome;
    } */
    CostruisciRelazioniDB(nomeTabella: string) {
        let tmpRitorno = '';
        if (this.tipo instanceof ORMObject) {
            /* Qui creo alter table ecc.. */
            tmpRitorno = `ALTER TABLE "${nomeTabella}"
            ADD CONSTRAINT "CO_${nomeTabella}_${this.tipo.tabellaRiferimento}" 
            FOREIGN KEY ("${this.nome}") 
            REFERENCES "${this.tipo.tabellaRiferimento}" (id)
            on delete ${this.tipo.onDelete ?? 'NO ACTION'}
            on update ${this.tipo.onUpdate ?? 'NO ACTION'}; `;//${parent_key_columns}
        }
        return tmpRitorno;
    }

    CostruisciListaTrigger(vet: ITrigger[]) {
        this.trigger = [];
        for (let index = 0; index < vet.length; index++) {
            const element = vet[index];
            this.trigger.push(new Trigger(element));
        }
    }
    async CostruisceTrigger(nomeTabella: string, elencoQuery: string[]/* client: Client */) {
        if (this.trigger) {
            for (let index = 0; index < this.trigger.length; index++) {
                const element = this.trigger[index];
                const query = element.CostruisceTrigger(nomeTabella);
                //await EseguiQueryControllata(client, query??'');
                if (query)
                    elencoQuery.push(query);
            }
        }
    }

}


export class ListaPostgresProprieta extends ListaMetadataProprieta {

    constructor() {
        super();

    }

    Mergia(item: ListaPostgresClasse) {
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

    CercaSeNoAggiungi(item: PostgresProprieta) {
        const t = super.CercaSeNoAggiungi(item);
        return <PostgresProprieta>t;
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
    Cerca(item: PostgresProprieta): PostgresProprieta | undefined {
        const t = super.Cerca(item);
        return <PostgresProprieta>t;
        /* for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) return element;
        }
        return undefined; */
    }

    AggiungiElemento(item: PostgresProprieta) {
        const t = super.AggiungiElemento(item);
        return <PostgresProprieta>t;
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
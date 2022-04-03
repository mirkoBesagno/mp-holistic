


import { Request } from "express";
import { IMetaParametro, ListaMetadataParametro, MetadataParametro } from "../metadata/parametro.metadata";
import { ListaMetadataProprieta } from "../metadata/proprieta.metadata";
import { VerificaGenerica } from "../utility";
import { ErroreMio } from "./utility/ErroreMio";
import { IParametriEstratti, IRitornoValidatore, TypeDovePossoTrovarlo, TypePosizione } from "./utility/utility";



export interface IExpressParametro extends IMetaParametro {

    valore?: any;

    dovePossoTrovarlo?: TypeDovePossoTrovarlo;

    posizione?: TypePosizione;

    autenticatore?: boolean;
    Validatore?: (parametro: any) => IRitornoValidatore;
}
export class ExpressParametro extends MetadataParametro implements IExpressParametro {

    valore: any;

    dovePossoTrovarlo: TypeDovePossoTrovarlo = 'rotta';

    posizione: TypePosizione = 'query';

    autenticatore = false;

    constructor(item: IExpressParametro) {
        super(item);
        if (item.posizione) this.posizione = item.posizione;
        if (item.autenticatore) this.autenticatore = item.autenticatore;
    }

    Validatore?: (parametro: any) => IRitornoValidatore;

    Verifica(): boolean {
        try {
            if (VerificaGenerica(this.tipo, this.valore)) {
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.log('');
            throw error;
        }
    }
    Init(item: ExpressParametro) {
        if (item.dovePossoTrovarlo != undefined) this.dovePossoTrovarlo = item.dovePossoTrovarlo;
        else this.dovePossoTrovarlo = 'rotta';

        if (item.Validatore != undefined) this.Validatore = item.Validatore;

        this.autenticatore = item.autenticatore ?? false;
        this.posizione = item.posizione ?? 'query';

    }

    PrintStruttura() {
        let tmp = '';
        tmp = tmp + "- " + this.tipo.toString() + " : " + this.nomeVariante + ' |\n';
        //tmp = tmp + '' + this. + '';
        tmp = tmp + '' + JSON.stringify(this, null, 4) + '';
        return tmp;
    }
}

export class ListaExpressParametro extends ListaMetadataParametro {

    constructor(item?: ListaMetadataProprieta) {
        super();
        if (item)
            for (let index = 0; index < item.length; index++) {
                const element = new ExpressParametro(item[index]);
                const tmp = this.Cerca(element);
                if (tmp) tmp.Mergia(element);
            }
    }

    GetThis() { return this; }
    Mergia(item: ListaExpressParametro) {
        const t = super.Mergia(item);
        return t;
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
    CercaSeNoAggiungi(item: ExpressParametro) {
        const t = super.CercaSeNoAggiungi(item);
        return <ExpressParametro>t;
        /* let parametro = undefined;
        for (let index = 0; index < this.length && parametro == undefined; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) parametro = element;
        }
        if (parametro == undefined) {
            if (item.GetThis) {
                parametro = <ExpressParametro>item.GetThis(item);
            }
            else {
                parametro = new MetadataParametro(item);
            }
            this.AggiungiElemento(parametro);
        }
        return parametro; */
    }
    Cerca(item: ExpressParametro): ExpressParametro | undefined {
        const t = super.Cerca(item);
        return <ExpressParametro>t;
        /* for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) return element;
        }
        return undefined; */
    }
    AggiungiElemento(item: ExpressParametro) {
        const t = super.AggiungiElemento(item);
        return <ExpressParametro>t;
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

    /**
     * Estrae i parametri dalla request, per estrarli legge i valori di se stesso e ne verifica le seguenti cose:
     * - che sia obbligatorio
     * - che sia Validato se prevede un validatore
     * - che sia Verificato
     * @param richiesta 
     * @returns 
     */
    EstraiParametriDaRequest(richiesta: Request): IParametriEstratti {
        const ritorno: IParametriEstratti = {
            errori: [], nontrovato: [], valoriParametri: []
        };
        for (let index = this.length - 1; index >= 0; index--) {
            const element = <ExpressParametro>this[index];
            let tmp = undefined;
            /* Verifico che l'emento sia o nel body o nella query o nella header, basandomi sulla sua posizione e lo metto in tmp*/
            if (richiesta.body[element.nomeVariante] != undefined && element.posizione == 'body') {
                tmp = richiesta.body[element.nomeVariante];
            }
            else if (richiesta.query[element.nomeVariante] != undefined && element.posizione == 'query') {
                tmp = richiesta.query[element.nomeVariante];
            }
            else if (richiesta.headers[element.nomeVariante] != undefined && element.posizione == 'header') {
                tmp = richiesta.headers[element.nomeVariante];
            }
            else { // se non c'è allora tmp = undefined, pensero poi a costruire l'errore
                /* if (element.obbligatorio == true) {
                    ritorno.nontrovato.push({
                        nome: element.nome,
                        posizioneParametro: element.indexParameter
                    });
                } else {
                    tmp = undefined;
                } */
                tmp = undefined;
            }
            ritorno.valoriParametri.push(tmp);
            element.valore = tmp;
            //vado a verificare il validatore, a cui sara riservato il massimo della priorita, se presente non eseguirà altri controlli oltre a lui
            if (element.Validatore) {
                const rit = element.Validatore(tmp)
                if (rit.approvato == false) {
                    rit.terminale = element;
                    ritorno.errori.push(rit)
                }
            }
            else {
                // se il validatore non c'è lo vado a verificare
                if (element.Verifica() == false) {
                    ritorno.errori.push({
                        approvato: false,
                        terminale: element,
                        messaggio: 'Attenzione parametro: ' + element.nomeVariante + ', parametro non convertibile.'
                    })
                } else if (tmp == undefined && element.obbligatorio == true) {
                    ritorno.errori.push({
                        approvato: false,
                        terminale: element,
                        messaggio: 'Attenzione parametro: ' + element.nomeVariante + ', segnato come obbligatorio. Messaggio auto creato.'
                    })
                }
            }
            if (element.autenticatore == true && tmp == undefined) {
                throw new ErroreMio({
                    codiceErrore: 401,
                    messaggio: 'Attenzione autenticazione mancante.'
                });
            }
        }
        return ritorno;
    }

    GetAutenticatore(): ExpressParametro | Array<ExpressParametro> | undefined {
        const ritorno: Array<ExpressParametro> = [];
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if ((<ExpressParametro>element).autenticatore == true) {
                ritorno.push(<ExpressParametro>element);
            }
        }
        if (ritorno.length > 0) { 
            if (ritorno.length == 1) {
                return ritorno[0];
            } else {
                return ritorno;
            }
        }
        else {
            return undefined;
        }
    }
}
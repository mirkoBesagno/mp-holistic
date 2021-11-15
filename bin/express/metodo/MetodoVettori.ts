import { IReturn, ConstruisciErrore } from "../utility/utility";
import { Request } from "express";
import fs from 'fs';
import { SanificatoreCampo } from "../utility/SanificatoreCampo";
import { RispostaControllo } from "../utility/RispostaControllo";
import { Risposta } from "../utility/Risposta";
import { IClasseRiferimento, IHtml } from "./utility";



export interface IMetodoVettori {
    ListaSanificatori?: SanificatoreCampo[];
    RisposteDiControllo?: RispostaControllo[];
    nomiClasseRiferimento?: IClasseRiferimento[];
    listaHtml?: IHtml[];
}


export class MetodoVettori implements IMetodoVettori {
    ListaSanificatori?: SanificatoreCampo[];
    RisposteDiControllo?: RispostaControllo[];
    nomiClasseRiferimento?: IClasseRiferimento[];
    listaHtml: IHtml[] = [];

    Init(init: IMetodoVettori) {
        if (init.nomiClasseRiferimento != undefined)
            this.nomiClasseRiferimento = init.nomiClasseRiferimento;
        if (init.ListaSanificatori)
            this.ListaSanificatori = init.ListaSanificatori;
        if (init.RisposteDiControllo)
            this.RisposteDiControllo = init.RisposteDiControllo;
        if (init.listaHtml) {
            for (let index = 0; index < init.listaHtml.length; index++) {
                const element = init.listaHtml[index];
                if (element.percorsoIndipendente == undefined)
                    element.percorsoIndipendente = false;

                if (element.html != undefined && element.htmlPath == undefined
                    && this.listaHtml.find(x => {
                        if (x.path == element.path)
                            return true; else
                            return false;
                    }) == undefined) {
                    this.listaHtml.push({
                        contenuto: element.html,
                        path: element.path,
                        percorsoIndipendente: element.percorsoIndipendente
                    });
                    // this.listaHtml?.contenuto = element.html;
                } else if (element.html == undefined && element.htmlPath != undefined
                    && this.listaHtml.find(x => {
                        if (x.path == element.path)
                            return true; else
                            return false;
                    }) == undefined) {
                    this.listaHtml.push({
                        contenuto: fs.readFileSync(element.htmlPath).toString(),
                        path: element.path,
                        percorsoIndipendente: element.percorsoIndipendente
                    });
                    // this.listaHtml?.contenuto = fs.readFileSync(element.htmlPath).toString();
                }
            }
        }
    }

    CercaRispostaConTrigger(richiesta: Request): Risposta | undefined {

        let tmp = undefined;

        if (this.RisposteDiControllo) {
            for (let index = 0; index < this.RisposteDiControllo.length; index++) {
                const element = this.RisposteDiControllo[index].risposta;
                if (element && element.trigger) {
                    if (element.trigger.posizione == 'body')
                        tmp = richiesta.body[element.trigger.nome];
                    if (element.trigger.posizione == 'header')
                        tmp = richiesta.headers[element.trigger.nome];
                    if (element.trigger.posizione == 'query')
                        tmp = richiesta.query[element.trigger.nome];
                    if (tmp == element.trigger.valore)
                        return element;
                }
            }
        }
        return undefined;
    }

    VerificaPresenzaRispostaControllata(item: IReturn | undefined): boolean {
        if (this.RisposteDiControllo != undefined) {
            for (let index = 0; index < this.RisposteDiControllo.length; index++) {
                const element = this.RisposteDiControllo[index];
                if (element.trigger == item?.stato) {
                    return true;
                }
            }
        }
        return false;
    }
    async EseguiRispostaControllata(item: IReturn | undefined): Promise<IReturn> {
        if (this.RisposteDiControllo != undefined) {
            for (let index = 0; index < this.RisposteDiControllo.length; index++) {
                const element = this.RisposteDiControllo[index];
                if ((element).trigger == item?.stato) {
                    if (element.onModificaRisposta && element) {
                        const tmp = await element.onModificaRisposta(item);
                        if (tmp)
                            return tmp;
                        else {
                            return ConstruisciErrore('Attenzione errore!');
                        }
                    }
                    else {
                        return item;
                    }
                }
            }
        }
        if (item)
            return item;
        else {
            return ConstruisciErrore('Attenzione errore!');
        }
    }
    VerificaTrigger(richiesta: Request): boolean {

        let tmp = undefined;

        if (this.RisposteDiControllo) {
            for (let index = 0; index < this.RisposteDiControllo.length; index++) {
                const element = this.RisposteDiControllo[index].risposta;
                if (element && element.trigger) {
                    if (element.trigger.posizione == 'body')
                        tmp = richiesta.body[element.trigger.nome];
                    if (element.trigger.posizione == 'header')
                        tmp = richiesta.headers[element.trigger.nome];
                    if (element.trigger.posizione == 'query')
                        tmp = richiesta.query[element.trigger.nome];
                    if (tmp == element.trigger.valore)
                        return true;
                }
            }
        }

        return false;
    }
    PrintStruttura() {
        let ritorno = '';
        if (this.ListaSanificatori) ritorno = ritorno + '\nListaSanificatori :' + JSON.stringify(this.ListaSanificatori);
        if (this.RisposteDiControllo) ritorno = ritorno + '\nRisposteDiControllo :' + JSON.stringify(this.RisposteDiControllo);
        if (this.nomiClasseRiferimento) ritorno = ritorno + '\nnomiClasseRiferimento :' + JSON.stringify(this.nomiClasseRiferimento);
        if (this.listaHtml) ritorno = ritorno + '\nlistaHtml :' + JSON.stringify(this.listaHtml);
        return ritorno;
    }
}
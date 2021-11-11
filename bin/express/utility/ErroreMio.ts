import { IErroreMio } from "./utility";





export class ErroreMio extends Error {
    codiceErrore: number;
    percorsoErrore?: string;
    nomeClasse?: string;
    nomeFunzione?: string;
    constructor(item: IErroreMio) {
        super(item.messaggio);
        this.codiceErrore = item.codiceErrore;
        if (item.percorsoErrore) {
            this.percorsoErrore = item.percorsoErrore;
        }
        if (item.nomeClasse) {
            this.nomeClasse = item.nomeClasse;
            this.percorsoErrore = this.percorsoErrore + '_CLASSE_->' + this.nomeClasse
        }
        if (item.nomeFunzione) {
            this.nomeFunzione = item.nomeFunzione;
            this.percorsoErrore = this.percorsoErrore + '_FUNZIONE_->' + this.nomeFunzione
        }
    }
}
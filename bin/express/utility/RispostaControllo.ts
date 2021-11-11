import { Risposta } from "./Risposta";
import { IReturn } from "./utility";

export class RispostaControllo {

    trigger: number;
    risposta?: Risposta;
    onModificaRisposta?: (dati: IReturn) => IReturn | Promise<IReturn>;
    constructor() {
        this.trigger = 0;
    }
}
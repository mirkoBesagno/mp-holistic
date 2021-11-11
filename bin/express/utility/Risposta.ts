import { tipo } from "../../utility";
import { TypePosizione } from "./utility";

export class Risposta {
    stato: number;
    descrizione: string;
    valori: {
        nome: string,
        tipo: tipo,
        note?: string
    }[];

    trigger?: { nome: string, valore: any, posizione: TypePosizione };
    htmlPath?: string;
    html?: string;
    isHandlebars?: boolean;

    constructor() {
        this.stato = 200;
        this.descrizione = '';
        this.valori = [];
        this.isHandlebars = false;
    }
}
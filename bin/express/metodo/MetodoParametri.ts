import { Response } from "express";
import { IReturn, TypeInterazone, TypeMetod } from "../utility/utility";
import { IRaccoltaPercorsi } from "./utility";

export interface IFile {
    path: string
    send?:(res:Response, item:IReturn)=>null,
    catch?:(res:Response, error:any)=>null
}

export interface IMetodoParametri {
    percorsi?: IRaccoltaPercorsi;
    //schemaSwagger?: any;
    /**Specifica se il percorso dato deve essere concatenato al percorso della classe o se è da prendere singolarmente di default è falso e quindi il percorso andra a sommarsi al percorso della classe */
    percorsoIndipendente?: boolean;
    /** Specifica il tipo, questo puo essere: "get" | "put" | "post" | "patch" | "purge" | "delete" */
    tipo?: TypeMetod;
    /** specifica il percorso di una particolare, se non impostato prende il nome della classe */
    path?: string;
    /** l'interazione è come viene gestito il metodo, puo essere : "rotta" | "middleware" | "ambo" */
    interazione?: TypeInterazone;
    /** la descrizione è utile piu nel menu o in caso di output */
    descrizione?: string;
    /** il sommario è una versione piu semplice della descrizione */
    sommario?: string;
    /** */
    isFile?: IFile;
}
export class MetodoParametri implements IMetodoParametri {

    isFile?: IFile | undefined;

    percorsi = { pathGlobal: '', patheader: '', porta: 0 };
    percorsoIndipendente = false;
    tipo: TypeMetod = 'get';
    path = '';
    interazione: TypeInterazone = 'rotta';
    Init(item: IMetodoParametri, pathAlternativo?: string) {

        if (item.percorsoIndipendente) {
            this.percorsoIndipendente = item.percorsoIndipendente;
        }
        else {
            this.percorsoIndipendente = false;
        }

        if (item.tipo != undefined) {
            this.tipo = item.tipo;
        }


        /* else if (item.tipo == undefined && pramsIndex == 0) this.tipo = 'get';
        else if (item.tipo == undefined && pramsIndex > 0) this.tipo = 'post'; */
        else if (this.tipo == undefined) {
            this.tipo = 'get';
        }

        if (item.interazione != undefined) {
            this.interazione = item.interazione;
        }
        else {
            this.interazione = 'rotta';
        }

        if (item.path != undefined) {
            this.path = item.path;
        }
        else if (pathAlternativo && (this.path == undefined || this.path == '')) {
            this.path = pathAlternativo
        }

        if (item.percorsi) {
            this.percorsi.patheader = item.percorsi.patheader;
            this.percorsi.porta = item.percorsi.porta;
        }
        if (this.percorsoIndipendente) {
            this.percorsi.pathGlobal = '/' + this.path;
        }
        else {
            this.percorsi.pathGlobal = this.percorsi.pathGlobal + '/' + this.path;
        }

        if (item.isFile) {
            this.isFile = item.isFile;
        }
    }

    PrintStruttura(): string {
        let ritorno = '';
        if (this.percorsi) ritorno = ritorno + '\npercorsi :' + JSON.stringify(this.percorsi);
        if (this.percorsoIndipendente) ritorno = ritorno + '\npercorsoIndipendente :' + JSON.stringify(this.percorsoIndipendente);
        if (this.tipo) ritorno = ritorno + '\ntipo :' + this.tipo;
        if (this.path) ritorno = ritorno + '\npath :' + this.path;
        if (this.interazione) ritorno = ritorno + '\ninterazione :' + this.interazione;
        return ritorno;
    }
}





import express from "express";
import { MainExpress } from "../express/main.express";
import { MainPostgres } from "../postgres/main.postgres";

/* export class User {
    nome: string;
    option: {
        creaTabelle: boolean,
        creaUser: boolean
    };
    inGroup: string[];
    constructor() {
        this.nome = '';
        this.option = { creaTabelle: false, creaUser: false };
        this.inGroup = [];
    }
} */

export interface ICache { body: any, stato: number }



export class Main {
    expressMain: MainExpress;
    postgresMain: MainPostgres;
    /** 
     * @param path: questo deve essere impostata, sara poi usata per creare la root dei percorsi. es: 'api' -> localhost.../api/../../
     * @param server: consiglio undefined, altrimenti passare un server express sara poi usato invece di creare un nuovo express
     * @param isMultiProcesso: consiglio di impostarla a falsa, di fatto sara poi usata in altre maniera per istanziare sotto processi 
     * @param pathExe: consiglio di impostarla undefined cosi che sia il processo a definirla per i sotto processi.
     */
    constructor(path: string, server?: express.Express | undefined, isMultiProcesso?: boolean | undefined, pathExe?: string | undefined) {
        this.expressMain = new MainExpress(path, server, isMultiProcesso);

        this.postgresMain = new MainPostgres();

        if (pathExe) {
            MainExpress.pathExe = pathExe ?? '';
        }
    }

}
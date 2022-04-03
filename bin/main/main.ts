



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
    constructor(path: string, server?: express.Express | undefined, isMultiProcesso?: boolean | undefined, pathExe?: string | undefined) {
        this.expressMain = new MainExpress(path, server, isMultiProcesso);

        this.postgresMain = new MainPostgres();

        if (pathExe) {
            MainExpress.pathExe = pathExe ?? '';
        }
    }

}
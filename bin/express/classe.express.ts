import express, { Request, Response, Router } from "express";
import { IMetaClasse, ListaMetadataClasse, MetadataClasse } from "../metadata/classe.metadata";
import { ExpressMetodo, ListaExpressMetodo } from "./metodo.express";
import fs from 'fs';
import { IParametriEstratti } from "./utility/utility";
import { ListaMetadataParametro } from "../metadata/parametro.metadata";
import { IHtml, IRaccoltaPercorsi } from "./metodo/utility";
import { ExpressParametro } from "./parametro.express";


export interface IExpressClasse extends IMetaClasse {
    id?: string;
    nome?: string;
    rotte?: Router;
    path?: string;
    percorsi?: IRaccoltaPercorsi;
    html?: IHtml[];
    LogGenerale?: any;
    cacheOptionMemory?: { durationSecondi: number };
    Istanziatore?: (parametri: IParametriEstratti, listaParametri: ListaMetadataParametro) => Promise<any> | any;
}

export class ExpressClasse extends MetadataClasse implements IExpressClasse {

    listaMetodi = new ListaExpressMetodo();

    id = '';
    nome = '';
    rotte: Router = express();
    path = '';

    percorsi: IRaccoltaPercorsi = { pathGlobal: '', patheader: '', porta: 0 };
    html: IHtml[] = [];

    LogGenerale?: any;
    cacheOptionMemory?: { durationSecondi: number };
    Istanziatore?: (parametri: IParametriEstratti, listaParametri: ListaMetadataParametro) => Promise<any> | any;

    GetThis() { return this; }
    constructor(item: IExpressClasse) {
        super(item);

        if (item.id != undefined) this.id = item.id;

        if (item.nome != undefined) this.nome = item.nome;

        if (item.rotte != undefined) this.rotte = item.rotte;

        if (item.path != undefined) this.path = item.path;

        if (this.path == undefined || this.path == '') this.path = this.nomeVariante;


        if (item.percorsi) this.percorsi = item.percorsi;

        if (item.html) {
            this.html = [];
            for (let index = 0; index < item.html.length; index++) {
                const element = item.html[index];
                if (element.percorsoIndipendente == undefined) element.percorsoIndipendente = false;

                if (element.html != undefined && element.htmlPath == undefined
                    && this.html.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    this.html.push({
                        contenuto: element.html,
                        path: element.path,
                        percorsoIndipendente: element.percorsoIndipendente
                    });
                } else if (element.html == undefined && element.htmlPath != undefined
                    && this.html.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    try {
                        this.html.push({
                            contenuto: fs.readFileSync(element.htmlPath).toString(),
                            path: element.path,
                            percorsoIndipendente: element.percorsoIndipendente
                        });
                    } catch (error) {
                        this.html.push({
                            contenuto: 'Nessun contenuto',
                            path: element.path,
                            percorsoIndipendente: element.percorsoIndipendente
                        });
                    }
                }
            }
        }

        if (item.LogGenerale) {
            this.listaMetodi.forEach(element => {
                if ((<ExpressMetodo>element).metodoEventi.onLog == undefined)
                    (<ExpressMetodo>element).metodoEventi.onLog = item.LogGenerale;
            });
            this.LogGenerale = item.LogGenerale;
        }

        if (item.Istanziatore) {
            this.listaMetodi.forEach(metodo => {
                let contiene = false;
                (<ExpressMetodo>metodo).listaParametri.forEach(parametro => {
                    if ((<ExpressParametro>parametro).autenticatore == true) contiene = true;
                });
                if (contiene) (<ExpressMetodo>metodo).metodoEventi.Istanziatore = item.Istanziatore;
            });
            this.Istanziatore = item.Istanziatore;
        }

        if (item.cacheOptionMemory) {
            this.listaMetodi.forEach(element => {
                if ((<ExpressMetodo>element).metodoLimitazioni.cacheOptionMemory == undefined) {
                    (<ExpressMetodo>element).metodoLimitazioni.cacheOptionMemory = item.cacheOptionMemory ?? { durationSecondi: 1 };
                }
            })
            this.cacheOptionMemory = item.cacheOptionMemory;
        }

        /* if (item.classeSwagger && item.classeSwagger != '') {
            this.classeSwagger = item.classeSwagger;
            this.metaRif.listaMetodi.forEach(element => {
                if (element.metodoExpress.swaggerClassi) {
                    const ris = element.swaggerClassi.find(x => { if (x == this.classeSwagger) return true; else return false; })
                    if (ris == undefined && this.classeSwagger) {
                        element.swaggerClassi.push(this.classeSwagger);
                    }
                }
            });
        } */
    }
    Mergia(item: ExpressClasse) {
        super.Mergia(item);

        if (item.id != undefined && item.id != '') this.id = item.id;

        if (item.nome != undefined && item.nome != '') this.nome = item.nome;

        if (item.rotte != undefined) this.rotte = item.rotte;

        if (item.path != undefined && item.path != '') this.path = item.path;


        if (item.percorsi) this.percorsi = item.percorsi;

        if (item.html) {
            this.html = [];
            for (let index = 0; index < item.html.length; index++) {
                const element = item.html[index];
                if (element.percorsoIndipendente == undefined) element.percorsoIndipendente = false;

                if (element.html != undefined && element.htmlPath == undefined
                    && this.html.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    this.html.push({
                        contenuto: element.html,
                        path: element.path,
                        percorsoIndipendente: element.percorsoIndipendente
                    });
                } else if (element.html == undefined && element.htmlPath != undefined
                    && this.html.find(x => { if (x.path == element.path) return true; else return false; }) == undefined) {
                    try {
                        this.html.push({
                            contenuto: fs.readFileSync(element.htmlPath).toString(),
                            path: element.path,
                            percorsoIndipendente: element.percorsoIndipendente
                        });
                    } catch (error) {
                        this.html.push({
                            contenuto: 'Nessun contenuto',
                            path: element.path,
                            percorsoIndipendente: element.percorsoIndipendente
                        });
                    }
                } else if (this.html.find(x => { if (x.path == element.path) return true; else return false; }) != undefined) {
                    this.html.find(x => { if (x.path == element.path) return true; else return false; });
                    //debugger;
                }
            }
        }

        if (item.LogGenerale) {
            this.listaMetodi.forEach(element => {
                if ((<ExpressMetodo>element).metodoEventi.onLog == undefined)
                    (<ExpressMetodo>element).metodoEventi.onLog = item.LogGenerale;
            });
            this.LogGenerale = item.LogGenerale;
        }

        if (item.Istanziatore) {
            this.listaMetodi.forEach(metodo => {
                let contiene = false;
                (<ExpressMetodo>metodo).listaParametri.forEach(parametro => {
                    if ((<ExpressParametro>parametro).autenticatore == true) contiene = true;
                });
                if (contiene) (<ExpressMetodo>metodo).metodoEventi.Istanziatore = item.Istanziatore;
            });
            this.Istanziatore = item.Istanziatore;
        }

        if (item.cacheOptionMemory) {
            this.listaMetodi.forEach(element => {
                if ((<ExpressMetodo>element).metodoLimitazioni.cacheOptionMemory == undefined) {
                    (<ExpressMetodo>element).metodoLimitazioni.cacheOptionMemory = item.cacheOptionMemory ?? { durationSecondi: 1 };
                }
            })
            this.cacheOptionMemory = item.cacheOptionMemory;
        }
    }
    SettaPathRoot_e_Global(item: string, percorsi: IRaccoltaPercorsi, app: any) {
        /*  */

        if (percorsi.patheader == undefined) this.percorsi.patheader = "localhost";
        else this.percorsi.patheader = percorsi.patheader;

        if (percorsi.porta == undefined) this.percorsi.porta = 3000;
        else this.percorsi.porta = percorsi.porta;

        const pathGlobal = percorsi.pathGlobal + '/' + this.path;
        this.percorsi.pathGlobal = pathGlobal;

        /*  */
        this.ConfiguraListaRotteHTML(app, pathGlobal);
        this.listaMetodi.ConfiguraListaRotteApplicazione(app, this.percorsi);
    }
    ConfiguraListaRotteHTML(app: any, pathGlobal: string) {
        for (let index = 0; index < this.html.length; index++) {
            const element = this.html[index];
            //element.ConfiguraRotteHtml(app, this.percorsi.pathGlobal,)
            let percorsoTmp = '';
            if (element.percorsoIndipendente)
                '/' + element.path;
            else
                percorsoTmp = pathGlobal + '/' + element.path;

            app.get(percorsoTmp,
                //this.cors,
                //this.helmet,
                async (req: Request, res: Response) => {
                    if (this.html)
                        res.send(element.contenuto);
                    else
                        res.sendStatus(404);
                });
        }
    }
    
    EstraiListaTriggerPath() {
        //const ritorno = Array<{ pathScatenante: string, listaPath: string[] }>();
        for (let index = 0; index < this.listaMetodi.length; index++) {
            const element = <ExpressMetodo>(this.listaMetodi[index]);
            if (element.metodoSpawProcess.pathAccept && element.metodoSpawProcess.isSpawTrigger) {
                console.log('Ciao');

                /* ritorno.push({
                pathScatenante:element.metodoParametri.path   
                }); */
            }
        }
    }
}

export class ListaExpressClasse extends ListaMetadataClasse {
    /* static nomeMetadataKeyTargetFor_Express = "ListaExpressClasse"; */

    constructor() {
        super();
    }

    Mergia(item: ListaExpressClasse) {
        const t = super.Mergia(item);
        return t;
        /* 
        for (let index = 0; index < item.length; index++) {
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
    CercaSeNoAggiungi(item: ExpressClasse) {
        const t = super.CercaSeNoAggiungi(item);
        return <ExpressClasse>t;
        /* 
        let classe = undefined;

        for (let index = 0; index < this.length && classe == undefined; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) classe = element;
        }
        if (classe == undefined) {
            classe = new ExpressClasse(item);
            this.AggiungiElemento(classe);
        }
        return classe; */
    }
    Cerca(item: ExpressClasse): ExpressClasse | undefined {
        const t = super.CercaSeNoAggiungi(item);
        return <ExpressClasse>t;
        /* 
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) return <ExpressClasse>element;
        }
        return undefined; */
    }

    AggiungiElemento(item: ExpressClasse) {
        const t = super.AggiungiElemento(item);
        return <ExpressClasse>t;
        /* 
        for (let index = 0; index < this.length; index++) {
            const element = this[index];
            if (Meta.Compara(element, item) == 0) {
                this[index].Mergia(item);
                return this[index];
            }
        }
        this.push(item);
        return item; */
    }

    ConfiguraListaRotteApplicazione(path: string, percorsi: IRaccoltaPercorsi, serverExpressDecorato: any) {
        for (let index = 0; index < this.length; index++) {
            const element = <ExpressClasse>this[index];
            element.SettaPathRoot_e_Global(path, percorsi, serverExpressDecorato);
        }
    }
    EstraiPath(){
        for (let index = 0; index < this.length; index++) {
            const element = <ExpressClasse>(this[index]);
            element.EstraiListaTriggerPath();
        }
    }
}
/* 
export function GetListaClasseExpress() {
    let tmp: ListaExpressClasse | undefined = undefined;
    tmp = Reflect.getMetadata(ListaExpressClasse.nomeMetadataKeyTargetFor_Express, targetTerminale);
    if (tmp == undefined) {
        tmp = new ListaExpressClasse();
    }
    return tmp;
}
export function SalvaListaClasseExpress(tmp: ListaExpressClasse) {
    Reflect.defineMetadata(ListaExpressClasse.nomeMetadataKeyTargetFor_Express, tmp, targetTerminale);
}  */
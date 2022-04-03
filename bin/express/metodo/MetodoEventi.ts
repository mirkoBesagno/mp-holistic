import { Request } from "express";
import { ListaMetadataParametro } from "../../metadata/parametro.metadata";
import { IReturn, IParametriEstratti, IRitornoValidatore } from "../utility/utility";



export interface IMetodoEventi {
    /**
     * se impostata permette di determinare cosa succedera nel momento dell'errore
     */
    onChiamataInErrore?: (logOut: string, result: any, logIn: string, errore: any) => IReturn;
    onPrimaDiEseguireMetodo?: (parametri: IParametriEstratti) => IParametriEstratti | Promise<IParametriEstratti>;
    /**
     * se impostata permette di  verificare lo stato quando il metodo va a buon fine.
     */
    onChiamataCompletata?: (logOut: string, result: any, logIn: string, errore: any) => void;
    onLog?: (logOut: string, result: any, logIn: string, errore: any) => void;

    Validatore?: (parametri: IParametriEstratti, listaParametri: ListaMetadataParametro) => IRitornoValidatore | void;

    Istanziatore?: (parametri: IParametriEstratti, listaParametri: ListaMetadataParametro) => Promise<any> | any;

    onRispostaControllatePradefinita?: (dati: IReturn) => IReturn | Promise<IReturn>;

    onPrimaDiTerminareLaChiamata?: (res: IReturn) => IReturn;

    onDopoAverTerminatoLaFunzione?: (item: any) => any;

    onPrimaDiEseguire?: (req: Request) => Request | Promise<Request>;
}
export class MetodoEventi implements IMetodoEventi {

    onChiamataInErrore?: (logOut: any, result: any, logIn: any, errore: any) => IReturn;
    onPrimaDiEseguireMetodo?: (parametri: IParametriEstratti) => IParametriEstratti | Promise<IParametriEstratti>;

    onChiamataCompletata?: (logOut: any, result: any, logIn: any, errore: any) => void;
    onLog?: (logOut: any, result: any, logIn: any, errore: any) => void;

    onRispostaControllatePradefinita?: (dati: IReturn) => IReturn | Promise<IReturn>;
    onPrimaDiTerminareLaChiamata?: (res: IReturn) => IReturn;
    onDopoAverTerminatoLaFunzione?: (item: any) => any;
    onPrimaDiEseguire?: (req: Request) => Request | Promise<Request>;


    Validatore?: (parametri: IParametriEstratti, listaParametri: ListaMetadataParametro) => IRitornoValidatore | void;

    Istanziatore?: (parametri: IParametriEstratti, listaParametri: ListaMetadataParametro) => any;

    Init(init: IMetodoEventi) {
        if (init.onChiamataCompletata != null) this.onChiamataCompletata = init.onChiamataCompletata;
        if (init.onLog != null) this.onLog = init.onLog;
        if (init.onChiamataInErrore) this.onChiamataCompletata = init.onChiamataCompletata;
        if (init.onPrimaDiEseguireMetodo) this.onPrimaDiEseguireMetodo = init.onPrimaDiEseguireMetodo;
        if (init.onLog) this.onLog = init.onLog;
        if (init.onRispostaControllatePradefinita) this.onRispostaControllatePradefinita = init.onRispostaControllatePradefinita;
        if (init.onPrimaDiTerminareLaChiamata) this.onPrimaDiTerminareLaChiamata = init.onPrimaDiTerminareLaChiamata;
        if (init.onDopoAverTerminatoLaFunzione) this.onDopoAverTerminatoLaFunzione = init.onDopoAverTerminatoLaFunzione;
        if (init.onPrimaDiEseguire) this.onPrimaDiEseguire = init.onPrimaDiEseguire;
        if (init.Validatore != null) this.Validatore = init.Validatore;
        if (init.Istanziatore != null && init.Istanziatore != undefined) this.Istanziatore = init.Istanziatore;
    }
    PrintStruttura() {
        let parametri = '';
        if (this.onChiamataCompletata) parametri = parametri + '\tonChiamataCompletata :' + this.onChiamataCompletata.toString();
        if (this.onPrimaDiEseguireMetodo) parametri = parametri + '\tonLog :' + this.onPrimaDiEseguireMetodo.toString();
        if (this.onChiamataInErrore) parametri = parametri + '\tonChiamataInErrore :' + this.onChiamataInErrore.toString();
        if (this.onLog) parametri = parametri + '\tonLog :' + this.onLog.toString();
        if (this.Validatore) parametri = parametri + '\tonLog :' + this.Validatore.toString();
        if (this.Istanziatore) parametri = parametri + '\tonLog :' + this.Istanziatore.toString();
        if (this.onPrimaDiEseguireMetodo) parametri = parametri + '\tonPrimaDiEseguireMetodo :' + this.onPrimaDiEseguireMetodo.toString();
        if (this.onPrimaDiTerminareLaChiamata) parametri = parametri + '\tonPrimaDiTerminareLaChiamata :' + this.onPrimaDiTerminareLaChiamata.toString();
        if (this.onRispostaControllatePradefinita) parametri = parametri + '\tonRispostaControllatePradefinita :' + this.onRispostaControllatePradefinita.toString();
        if (this.onDopoAverTerminatoLaFunzione) parametri = parametri + '\tonLog :' + this.onDopoAverTerminatoLaFunzione.toString();
        if (this.onPrimaDiEseguire) parametri = parametri + '\tonLog :' + this.onPrimaDiEseguire.toString();
        return parametri;
    }

}
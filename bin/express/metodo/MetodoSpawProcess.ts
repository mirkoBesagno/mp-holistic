import { IReturn, ISpawTrigger } from "../utility/utility";


export interface ITriggerPath/* SpawProcess */ {
    pathScatenante:string;

    pathAccept: string[];
    pathDecline: string[];

    abilitato: boolean;
}

/**
 * attenzione
 */
export interface IMetodoSpawProcess {
    /**
     * questo deve essere settato sul nuome della variabile che verera restituita, questa poi verra estratta dalla risposta (nel body) sara usato per gestire il redirect dei metodi a seguire.
     * es 
     * ... 
     * {
     * ...
     * isSpawTrigger:'xxx_esempio_xxx'
     * ...
     * }
     * ... 
     * ...
     * return <IReturn>{
            stato: 200,
            body: {
                ...
                xxx_esempio_xxx: xxx
                ...
            }
        };
     * ...
     */
    isSpawTrigger?: string;
    /**
     * questo sara un vettore di variabili, specifica dove potra trovare un possibile valore che determinare il sotto processo di destinazione.
     */
    checkSpawTrigger?: ISpawTrigger[];

    pathAccept?: string[];
}

/**
 * fondamentale
 */
export class MetodoSpawProcess implements IMetodoSpawProcess {

    isSpawTrigger?: string;
    checkSpawTrigger?: ISpawTrigger[];

    pathAccept?: string[] | undefined;

    Init(item: IMetodoSpawProcess) {
        if (item.isSpawTrigger) this.isSpawTrigger = item.isSpawTrigger;
        if (item.checkSpawTrigger) this.checkSpawTrigger = item.checkSpawTrigger;

        if (item.pathAccept) {
            this.pathAccept = item.pathAccept
        }
    }

    VerificaPresenzaSpawnTrigger(res: IReturn) {
        if (res.body instanceof Object && this.isSpawTrigger) {
            if (this.isSpawTrigger in res.body) {
                return true;
            }
        }
        /* if (this.checkSpawTrigger)
            for (let index = 0; index < this.checkSpawTrigger.length; index++) {
                const element = this.checkSpawTrigger[index];
                
                if (res.[element.posizione] instanceof Object && this.isSpawTrigger) {
                    if (this.isSpawTrigger in res.body) {
                        return true;
                    }
                }
            } */

        /*  for (let index = 0; index < Main.vettoreProcessi.length; index++) {
             const element = Main.vettoreProcessi[index];
             if(element.nomeVariabile)
         } */
        return false;
    }
    PrintStruttura(): string {
        let ritorno = '';
        if (this.isSpawTrigger) ritorno = ritorno + '\nisSpawTrigger :' + this.isSpawTrigger;
        if (this.checkSpawTrigger) ritorno = ritorno + '\ncacheOptionMemory :' + JSON.stringify(this.checkSpawTrigger);
        return ritorno;
    }

}
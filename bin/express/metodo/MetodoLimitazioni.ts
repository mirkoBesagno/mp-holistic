import cors from "cors";
import helmet from "helmet";
import { ISpawTrigger, IReturn } from "../utility/utility";

import { Options as OptSlowDows } from "express-slow-down";
import { Options as OptRateLimit } from "express-rate-limit";

/* import { Options as OptionsCache } from "express-redis-cache"; */
import { Request } from "express";
import { Response } from "express";



export interface IMetodoLimitazioni {
    slow_down?: OptSlowDows;
    rate_limit?: OptRateLimit;
    cors?: any;
    helmet?: any;
    middleware?: any[];
    /* cacheOptionRedis?: OptionsCache; */
    cacheOptionMemory?: { durationSecondi: number };
    isSpawTrigger?: string;
    checkSpawTrigger?: ISpawTrigger[];
}

/**
 * 
 */
 export class MetodoLimitazioni implements IMetodoLimitazioni {

    isSpawTrigger?: string;
    checkSpawTrigger?: ISpawTrigger[];
    slow_down: OptSlowDows = {
        windowMs: 3 * 60 * 1000, // 15 minutes
        delayAfter: 100, // allow 100 requests per 15 minutes, then...
        delayMs: 500, // begin adding 500ms of delay per request above 100:
        onLimitReached: (req: Request, res: Response, options: OptSlowDows) => {
            res.status(555).send("rate_limit : onLimitReached")
            throw new Error("Errore: rate_limit : onLimitReached");
        }
    };
    rate_limit: OptRateLimit = {
        windowMs: 3 * 60 * 1000, // 15 minutes
        max: 100,
        onLimitReached: (req: Request, res: Response, options: OptRateLimit) => {
            res.status(555).send("rate_limit : onLimitReached")
            throw new Error("Errroe: rate_limit : onLimitReached");
        }
    };
    cors = cors();
    helmet = helmet();
    middleware = [];
    //cacheOptionRedis: OptionsCache;
    cacheOptionMemory: { durationSecondi: number } = { durationSecondi: 1 };
    Init(item: IMetodoLimitazioni) {
        if (item.slow_down) this.slow_down = item.slow_down;
        if (item.rate_limit) this.rate_limit = item.rate_limit;
        if (item.cacheOptionMemory) this.cacheOptionMemory = item.cacheOptionMemory;
        if (item.isSpawTrigger) this.isSpawTrigger = item.isSpawTrigger;
    }

    VerificaPresenzaSpawnTrigger(res: IReturn) {
        if (res.body instanceof Object && this.isSpawTrigger) {
            if (this.isSpawTrigger in res.body) {
                return true;
            }
        }

        /*  for (let index = 0; index < Main.vettoreProcessi.length; index++) {
             const element = Main.vettoreProcessi[index];
             if(element.nomeVariabile)
         } */
        return false;
    }

}
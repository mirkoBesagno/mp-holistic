import cors from "cors";
import helmet from "helmet";

import { Options as OptSlowDows } from "express-slow-down";
import { Options as OptRateLimit } from "express-rate-limit";
import { Request, Response } from "express";

/* import { Options as OptionsCache } from "express-redis-cache"; */
/* import { Request, Response } from "express"; */



export interface IMetodoLimitazioni {
    slow_down?: OptSlowDows;
    rate_limit?: Partial<OptRateLimit>;
    cors?: any;
    helmet?: any;
    middleware?: any[];
    /* cacheOptionRedis?: OptionsCache; */
    cacheOptionMemory?: { durationSecondi: number };    
}

/**
 * 
 */
export class MetodoLimitazioni implements IMetodoLimitazioni {
 
    slow_down?: OptSlowDows = /* undefined; */ {
        windowMs: 1000,//3 * 60 * 1000, // 15 minutes
        delayAfter: 1000, // allow 100 requests per 15 minutes, then...
        delayMs: 5000, // begin adding 500ms of delay per request above 100:
        maxDelayMs: 6000,
        onLimitReached: (req: Request, res: Response, options: OptSlowDows) => {
            res.status(555).send("rate_limit : onLimitReached")
            throw new Error("Errore: rate_limit : onLimitReached");
        }
    };
    rate_limit?: Partial<OptRateLimit> =/*  undefined */{
        windowMs: 500,//3 * 60 * 1000, // 15 minutes
        max: 1000,
        onLimitReached: (req: Request, res: Response, options: Partial<OptRateLimit>) => {
            res.status(555).send("rate_limit : onLimitReached")
            throw new Error("Errroe: rate_limit : onLimitReached");
        }
    };
    cors = cors();
    helmet = helmet();
    middleware: any[] = [];
    //cacheOptionRedis: OptionsCache;
    cacheOptionMemory?: { durationSecondi: number } = undefined;//= { durationSecondi: 1 };
    Init(item: IMetodoLimitazioni) { 
        if (item.slow_down) this.slow_down = item.slow_down;
        if (item.rate_limit) this.rate_limit = item.rate_limit;
        if (item.middleware) this.middleware = item.middleware;
        if (item.cacheOptionMemory) this.cacheOptionMemory = item.cacheOptionMemory;
    }
    
    PrintStruttura(): string {
        let ritorno = ''; 
        if (this.slow_down) ritorno = ritorno + '\nslow_down :' + JSON.stringify(this.slow_down);
        if (this.rate_limit) ritorno = ritorno + '\nrate_limit :' + JSON.stringify(this.rate_limit);
        if (this.cors) ritorno = ritorno + '\ncors :' + JSON.stringify(this.cors);
        if (this.helmet) ritorno = ritorno + '\nhelmet :' + JSON.stringify(this.helmet);
        if (this.middleware) ritorno = ritorno + '\nmiddleware :' + JSON.stringify(this.middleware);
        if (this.cacheOptionMemory) ritorno = ritorno + '\ncacheOptionMemory :' + JSON.stringify(this.cacheOptionMemory);
        return ritorno;
    }

}
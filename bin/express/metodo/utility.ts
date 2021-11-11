


export interface IClasseRiferimento {
    nome: string,
    listaMiddleware?: any[]
}

export interface IHtml {
    path: string,
    percorsoIndipendente?: boolean,

    htmlPath?: string,
    html?: string,
    contenuto: string
}

export interface IRaccoltaPercorsi {
    pathGlobal: string, patheader: string, porta: number
}
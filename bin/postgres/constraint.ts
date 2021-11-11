

export interface ICheck {
    check?: string /* | ((NEW: any, OLD: any) => void | true | Error) */,
    nome?: string,
}

export interface IUnique {
    unique?: any,
    nome?: string,
}



export interface IConstraints {
    check?: ICheck;
    notNull?: boolean;
    unique?: IUnique;
}


export class Constraint implements IConstraints {

    check?: ICheck;
    notNull?: boolean;
    unique?: IUnique;

    constructor(item: IConstraints) {
        this.unique = item.unique;
        this.check = item.check;
        this.notNull = item.notNull;
    }

    CostruisciConstraint(nomeClasse: string) {
        let ritorno = '';
        if (this.unique) ritorno = ritorno + ' CONSTRAINT ' + '"' + 'cn_' + nomeClasse + '_' + this.unique.nome + '"' + ' UNIQUE';
        if (this.notNull) ritorno = ritorno + ' NOT NULL';
        if (this.check) ritorno = ritorno + ' CONSTRAINT ' + '"' + 'cn_ck_' + nomeClasse + '_' + this.check.nome + '"' + ' CHECK(' + this.check.check + ')';
        return ritorno;
    }

}
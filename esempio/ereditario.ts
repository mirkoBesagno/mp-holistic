import { mpCls, mpPrp } from "..";


@mpCls({ itemMetaClasse: {} })
class Primo {
    constructor() {

    }
}

@mpCls({ itemMetaClasse: {} })
export class Secondo {

    @mpPrp({
        itemMetaProprieta: { nome: '', tipo: 'any' },
        itemPostgresProprieta: { nome: '', tipo: 
        {colonnaRiferimento:'serial',tabellaRiferimento:'Primo',tipo:'object'}, 
        descrizione: '', sommario: '' }
    })
    oggettto: Primo = new Primo();

    constructor() {

    }
}
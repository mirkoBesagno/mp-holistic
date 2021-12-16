

 
import "reflect-metadata"; 
import { Main } from "./bin/main/main";

import { decoratoreClasse } from "./bin/decoratori/classe.decoratore";
import { decoratoreMetodo } from "./bin/decoratori/metodo.decoratore";
import { decoratoreProprieta } from "./bin/decoratori/proprieta.decoratore";
import { decoratoreParametro } from "./bin/decoratori/parametro.decoratore";

export { Main as Main };
/* export { mpMet as mpMet }; */
/* export { mpMetGen as mpMetGen }; */
export { decoratoreMetodo as mpMtd };
export { decoratoreParametro as mpPrm };
export { decoratoreClasse as mpCls };
export { decoratoreProprieta as mpPrp }

/* export { ErroreMio as ErroreMio };
export { IRitornoValidatore as IRitornoValidatore };
export { GestioneErrore as GestioneErrore };

export { IParametriEstratti as IParametriEstratti };
export { ListaTerminaleParametro as ListaTerminaleParametro };

export { ILogbase as ILogbase }; */
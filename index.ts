

 
import "reflect-metadata"; 
import { Main } from "./bin/main/main";

import { decoratoreClasse } from "./bin/decoratori/classe.decoratore";
import { decoratoreMetodo } from "./bin/decoratori/metodo.decoratore";
import { decoratoreProprieta } from "./bin/decoratori/proprieta.decoratore";
import { decoratoreParametro } from "./bin/decoratori/parametro.decoratore";

import { ListaExpressClasse } from "./bin/express/classe.express";
import { GetListaClasseMeta } from "./bin/metadata";
import { ListaMetadataClasse } from "./bin/metadata/classe.metadata";

import { ORMObject } from "./bin/utility";

import { ErroreMio } from "./bin/express/utility/ErroreMio";

import { Response } from "express";

export { Main as Main };
/* export { mpMet as mpMet }; */
/* export { mpMetGen as mpMetGen }; */
export { decoratoreMetodo as mpMtd };
export { decoratoreParametro as mpPrm };
export { decoratoreClasse as mpCls };
export { decoratoreProprieta as mpPrp };

/*** */

export { ListaExpressClasse as ListaExpressClasse};
export { GetListaClasseMeta as GetListaClasseMeta};
export { ListaMetadataClasse as ListaMetadataClasse};

export { ORMObject as ORMObject };
export { ErroreMio as ErroreMio };

export { Response as Response };

/*export { IRitornoValidatore as IRitornoValidatore };
export { GestioneErrore as GestioneErrore };

export { IParametriEstratti as IParametriEstratti };
export { ListaTerminaleParametro as ListaTerminaleParametro };

export { ILogbase as ILogbase }; 
*/
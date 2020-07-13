import { Injectable } from '@angular/core';
import * as printJS from 'print-js';


@Injectable({
  providedIn: 'root'
})
export class ImpresionService {

  constructor() { }

  imprimirJson(json: JSON, prop: any, len: number, heder: string){
    var cabezal = 'LISTADO DE '+ heder + ' - GALERIA JUJUY  ' + " Registros:" + "  (" + len + ") ";
    printJS({printable: json , properties: prop,
     type: 'json' , header: cabezal , headerStyle:'font-weight: 50;',
     documentTitle:'GALERIA JUJUY',
     gridHeaderStyle: 'font-weight: bold; border: 1px black solid; background: lightgray; ' , 
     gridStyle:'border: 1px lightgray solid; text-align: center ; margin-bottom: -1px;' ,
    })
  }

}

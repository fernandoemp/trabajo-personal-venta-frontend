import { Pipe, PipeTransform } from '@angular/core';
import { Propietario } from '../models/propietario';

@Pipe({
  name: 'filterDni'
})
export class FilterDniPipe implements PipeTransform {

  transform(value: Array<Propietario>, ...arg: any): any {
    const resultadoBusqueda = [];
    for (const prop of value){
      if(arg !== ''){
        if (prop.dni.toString().match(arg)){
          resultadoBusqueda.push(prop);
        }
      }
      else{
        resultadoBusqueda.push(prop);
      }

      }
    return resultadoBusqueda;

  }
}

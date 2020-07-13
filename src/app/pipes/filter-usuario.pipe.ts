import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../models/usuario';

@Pipe({
  name: 'filterUsuario'
})
export class FilterUsuarioPipe implements PipeTransform {

  transform(value: Array<Usuario>, ...arg: any): any {
    const resultadoBusqueda = [];
    for (const usuario of value){
      if (arg !== ''){
        if (usuario.usuario.match(arg)){
          resultadoBusqueda.push(usuario);
        }
      }
      else{
        resultadoBusqueda.push(usuario);
        }
      }
    return resultadoBusqueda;
  }
}


import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'filtro'
})

export class FilterLocal {

    transform(value: any, arg: any): any{
        
        const resultado = [];
        for(const locale of value){
            if(arg != null){
                if(locale.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
                    resultado.push(locale);
                }
            }
            else{
                return value;
            }
        }
        return resultado;
    }

}

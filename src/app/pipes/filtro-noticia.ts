import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'noticiaFiltro'
})


export class FiltroNoticia {

    transform(value: any, arg: any): any{
        
        const resultado = [];
        for(const noti of value){
            if(arg != null){
                if(noti.titulo.toLowerCase().indexOf(arg.toLowerCase()) > -1 ){
                    resultado.push(noti);
                }
            }
            else{
                return value;
            }
        }
        return resultado;
    }
}

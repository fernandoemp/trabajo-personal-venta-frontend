export class Local {
    _id: number;
    nombre: string;
    superficie: number;
    imagen: Array<string> = new Array<string>();
    alquilado: boolean;
    costomes: number;
    descripcion: string;
    banios: number;
    servicios: Array<string> = new Array<string>();
    precio: number;
    fechaModificacion: Date;
    fb_id: string; //para guardar la pub de fb

    nombreServicios: string = ""; //solo para la impresion del json

    Local(){

    }

}

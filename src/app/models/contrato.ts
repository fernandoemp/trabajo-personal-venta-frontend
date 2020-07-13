import { Local } from './local';
import { Propietario } from './propietario';

export class Contrato {
    _id: number;
    fecha: Date;
    propietario: Propietario;
    costoTotalAlq: number;
    locales: Array<Local> = new Array<Local>();
    descripcion: string;
    cerrado: boolean;
    estado: string;
    duracion: number;

    nombreLocales: string = ""; //solo para impirmir eljson

    Contrato(){

    }
}

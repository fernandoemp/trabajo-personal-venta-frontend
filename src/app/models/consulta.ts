import { Usuario } from './usuario';

export class Consulta {
  // tslint:disable-next-line: variable-name
  _id: string;
  texto: string;
  asunto: string;
  fechaPublicacion: Date;
  usuario: Usuario;
  borrado: boolean;
  estado: string;
  procesadoPor: string;
  fechaProcesado: Date;
  fechaRespuesta: Date;

  // tslint:disable-next-line: max-line-length
  constructor(id?: string, texto?: string, asunto?: string, fechaPublicacion?: Date, usuario?: Usuario, borrado?: boolean, estado?: string, procesadoPor?: string, fechaProcesado?: Date, fechaRespuesta?: Date){
    this._id = id;
    this.texto = texto;
    this.asunto = asunto;
    this.fechaPublicacion = fechaPublicacion;
    this.usuario = usuario;
    this.borrado = borrado;
    this.estado = estado;
    this.procesadoPor = procesadoPor;
    this.fechaProcesado = fechaProcesado;
    this.fechaRespuesta = fechaRespuesta;
  }
}

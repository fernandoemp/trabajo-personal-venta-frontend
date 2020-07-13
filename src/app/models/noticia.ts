import { Usuario } from './usuario';

export class Noticia {
    // tslint:disable-next-line: variable-name
    _id: string;
    imagen: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
    usuario: Usuario;
    vigente: boolean;

    constructor(id?: string, imagen?: string, titulo?: string, descripcion?: string, fecha?: Date, usuario?: Usuario, vigente?: boolean) {
        this._id = id;
        this.imagen = imagen;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.usuario = usuario;
        this.vigente = vigente;
    }

}

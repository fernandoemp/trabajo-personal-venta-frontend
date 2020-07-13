import { Mensaje } from './mensaje';
import { Carrito } from './carrito';
import { Articulo } from './articulo';


export class Usuario {
  // tslint:disable-next-line: variable-name
  _id: string;
  usuario: string;
  password: string;
  activo: boolean;
  borrado: boolean;
  perfil: string;
  fotoPerfil: string;
  fechaAltaUsuario: Date;
  mensajes: Array<Mensaje>;
  carrito: Carrito;
  compras: Array<Articulo>;

  // tslint:disable-next-line: max-line-length
  constructor(id?: string, usuario?: string, password?: string, activo?: boolean, borrado?: boolean, perfil?: string, fotoPerfil?: string, fechaAltaUsuario?: Date, mensajes?: Array<Mensaje>, carrito?: Carrito, compras?: Array<Articulo>) {
    this._id = id;
    this.usuario = usuario;
    this.password = password;
    this.activo = activo;
    this.borrado = borrado;
    this.perfil = perfil;
    this.fotoPerfil = fotoPerfil;
    this.fechaAltaUsuario = new Date();
    this.mensajes = new Array<Mensaje>();
    this.carrito = new Carrito();
    this.compras = new Array<Articulo>();
  }
}



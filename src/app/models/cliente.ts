export class Cliente {
  // tslint:disable-next-line: variable-name
    _id: string;
    apellido: string;
    nombres: string;
    dni: number;
    email: string;
    telefono: number;
    direccion: string;
    borrado: boolean;

    // tslint:disable-next-line: max-line-length
    constructor(id?: string, apellido?: string, nombres?: string, dni?: number, emai?: string, telefono?: number, direccion?: string , borrado?: boolean) {
        this._id = id;
        this.apellido = apellido;
        this.nombres = nombres;
        this.dni = dni;
        this.email = emai;
        this.telefono = telefono;
        this.direccion = direccion;
        this.borrado = borrado;
    }
}


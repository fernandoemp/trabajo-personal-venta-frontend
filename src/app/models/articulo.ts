import { Producto } from './producto';

export class Articulo {
    // tslint:disable-next-line: variable-name
    _id: number;
    producto: Producto;
    cantidad: number;
    precio: number;

    // tslint:disable-next-line: max-line-length
    constructor(id?: number, producto?: Producto, cantidad?: number, precio?: number) {
        this._id = id;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precio = precio;
    }
}

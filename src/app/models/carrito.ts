import { Articulo } from './articulo';

export class Carrito {
  // tslint:disable-next-line: variable-name
  _id: string;
  articulos: Array<Articulo>;
  total: number;

  constructor(id?: string, articulos?: Array<Articulo>, total?: number){
      this._id = id;
      this.articulos = new Array<Articulo>();
      this.total = total;
  }
}

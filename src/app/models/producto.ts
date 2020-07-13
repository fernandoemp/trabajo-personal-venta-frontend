export class Producto {
  // tslint:disable-next-line: variable-name
  _id: string;
  titulo: string;
  descripción: string;
  precio: number;
  tallas: string;
  colores: string;
  medidas: string;
  genero: string;
  descuento: number;
  stock: number;

  // tslint:disable-next-line: max-line-length
  constructor(id?: string, titulo?: string, descripción?: string, precio?: number, tallas?: string, colores?: string, medidas?: string, genero?: string, descuento?: number, stock?: number){
    this._id = id;
    this.titulo = titulo;
    this.descripción = descripción;
    this.precio = precio;
    this.tallas = tallas;
    this.colores = colores;
    this.medidas = medidas;
    this.genero = genero;
    this.descuento = descuento;
    this.stock = stock;
  }
}

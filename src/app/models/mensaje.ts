export class Mensaje {
  // tslint:disable-next-line: variable-name
  _id: string;
  usuarioRemitente: string;
  usuarioDestinatario: string;
  asunto: string;
  texto: string;
  leido: boolean;
  fechaEnviado: Date;

  // tslint:disable-next-line: max-line-length
  constructor(id?: string, usuarioRemitente?: string, usuarioDestinatario?: string, asunto?: string, texto?: string, leido?: boolean, fechaEnviado?: Date){
      this._id = id;
      this.usuarioRemitente = usuarioRemitente;
      this.usuarioDestinatario = usuarioDestinatario;
      this.asunto = asunto;
      this.texto = texto;
      this.leido = leido;
      this.fechaEnviado = fechaEnviado;
  }

}

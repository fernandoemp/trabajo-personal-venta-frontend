import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

 // urlBase = 'https://trabajofinalpysw2020.herokuapp.com/api/usuarios/';

  urlBase = 'http://localhost:3000/api/usuarios/';

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient) {

  }

  signUp(usuario: Usuario): Observable<any>{
    console.log(usuario);
    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(usuario);

    return this._http.post(this.urlBase + 'signup', body, httpOptions);
  }

  updateUsuario(usuario: Usuario): Observable<any>{

    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(usuario);

    return this._http.put(this.urlBase + usuario._id, body, httpOptions);
  }

  updatePasswordUsuario(usuario: Usuario): Observable<any>{

    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(usuario);

    return this._http.put(this.urlBase + 'change/' + usuario._id, body, httpOptions);
  }
  getUsuarios(): Observable<any>{
    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({

      })
    };
    return this._http.get(this.urlBase, httpOptions);
  }

  public getUsuarioById(id: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
     // tslint:disable-next-line: prefer-const
    return this._http.get(this.urlBase + id, httpOptions);
  }

  public getUsuarioByEmail(email: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
     // tslint:disable-next-line: prefer-const
    return this._http.get(this.urlBase + 'email/' + email, httpOptions);
  }


  public findMensajeUsuario(id: string, fechaRespuesta: Date): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
     // tslint:disable-next-line: prefer-const
    return this._http.get(this.urlBase + 'mensaje/' + id + '&' + fechaRespuesta, httpOptions);
  }
  deleteUsuario(usuario: Usuario): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.delete( this.urlBase + usuario._id , httpOptions );
  }


}

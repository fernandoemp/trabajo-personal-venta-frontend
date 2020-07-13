import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Novedad } from '../models/novedad';

@Injectable({
  providedIn: 'root'
})
export class NovedadService {

  cantNovedades = 0;
   urlBase = 'http://localhost:3000/api/novedades/';
  //urlBase = 'https://trabajofinalpysw2020.herokuapp.com/api/novedades/';
  cantMensajePorUser = 0;

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient) {
  }

  getNovedades(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.get(this.urlBase, httpOptions);
  }

  getNovedadesSinProcesar(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.get(this.urlBase + 'sinProcesar', httpOptions);
  }

  addNovedad(novedad: Novedad): Observable<any>{
    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(novedad);

    return this._http.post(this.urlBase, body, httpOptions);
  }

  updateNovedad(novedad: Novedad): Observable<any>{

    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(novedad);

    return this._http.put(this.urlBase + novedad._id, body, httpOptions);
  }

  deleteNovedad(novedad: Novedad): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.delete( this.urlBase + novedad._id , httpOptions );
  }
}

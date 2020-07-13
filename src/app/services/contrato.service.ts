import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contrato } from '../models/contrato';


@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  urlBase = 'http://localhost:3000/api/contratos/';
  //urlBase = 'https://trabajofinalpysw2020.herokuapp.com/api/contratos/';


  constructor(private _http: HttpClient) {

  }

  getContratos(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.get(this.urlBase, httpOptions);
  }

  getContrato(contrato: Contrato): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.get(this.urlBase + contrato._id, httpOptions);
  }


  addContrato(contrato: Contrato): Observable<any>{
    console.log(contrato);
    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(contrato);

    return this._http.post(this.urlBase, body, httpOptions);
  }

  updateContrato(contrato: Contrato): Observable<any>{

    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(contrato);

    return this._http.put(this.urlBase + contrato._id, body, httpOptions);
  }

  deleteContrato(contrato: Contrato):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.delete( this.urlBase + contrato._id , httpOptions );
  }

}

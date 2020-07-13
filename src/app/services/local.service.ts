import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Local } from '../models/local';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  locales: Array<Local>;
  urlBase = 'http://localhost:3000/api/locales/';

  //urlBase = 'https://trabajofinalpysw2020.herokuapp.com/api/locales/';
  localIndividual: Local; //para mostrar el local individual

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient) {
    this.locales = new Array<Local>();
  }


  getLocales(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.get(this.urlBase, httpOptions);
  }

  getLocalesNoAlquilados(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.get(this.urlBase + "disponibles" , httpOptions);
  }

  addLocal(local: Local): Observable<any>{
    console.log(local);
    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(local);

    return this._http.post(this.urlBase, body, httpOptions);
  }

  updateLocal(local: Local): Observable<any>{

    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(local);

    return this._http.put(this.urlBase + local._id, body, httpOptions);
  }

  deleteLocal(local: Local):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.delete( this.urlBase + local._id , httpOptions );
  }

  getServicios(){
    return ["Electricidad","Agua Corriente", "Telefono","Gas Natural", "Desague Cloacal"];
  }

}

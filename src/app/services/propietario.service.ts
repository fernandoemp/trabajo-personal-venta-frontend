import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Propietario } from '../models/propietario';

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {

  urlBase = 'http://localhost:3000/api/propietarios/';

  // urlBase = 'https://trabajofinalpysw2020.herokuapp.com/api/propietarios/';


  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient) {
  }

  getPropietarios(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.get(this.urlBase, httpOptions);
  }

  addPropietario(prop: Propietario): Observable<any>{
    console.log(prop);
    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(prop);

    return this._http.post(this.urlBase, body, httpOptions);
  }

  updatePropietario(prop: Propietario): Observable<any>{
  console.log(prop);
  const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
  const body = JSON.stringify(prop);

  return this._http.put(this.urlBase + prop._id, body, httpOptions);
  }

  deletePropietario(prop: Propietario): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.delete( this.urlBase + prop._id , httpOptions );
  }

  // news added
  public getPropietario(p: Propietario): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.get(this.urlBase + p._id, httpOptions);
  }

  public getPropietarioByEmail(email: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
     // tslint:disable-next-line: prefer-const
    return this._http.get(this.urlBase + 'email/' + email, httpOptions);
  }
}

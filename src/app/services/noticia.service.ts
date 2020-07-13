import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Noticia } from '../models/noticia';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {

  noticia: Noticia;
  urlBase = 'http://localhost:3000/api/noticias/';

  //urlBase = 'https://trabajofinalpysw2020.herokuapp.com/api/noticias/';


  constructor(private _http: HttpClient) {
    this.noticia = new Noticia();
  }

  getNoticiasVigentes(): Observable<any> {
    console.log("entro a get noticias vigente");
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.get(this.urlBase + "vigentes", httpOptions);
  }

  getNoticias(): Observable<any> {
    console.log("entro a get noticias");
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this._http.get(this.urlBase, httpOptions);
  }

  addNoticia(n: Noticia): Observable<any> {
    console.log(n);
    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(n);

    return this._http.post(this.urlBase, body, httpOptions);
  }

  updateNoticia(prop: Noticia): Observable<any>{

    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    const body = JSON.stringify(prop);

    return this._http.put(this.urlBase + prop._id, body, httpOptions);
  }

  deleteNoticia(n: Noticia): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({

      })
    };
    return this._http.delete(this.urlBase + n._id, httpOptions);
  }
}

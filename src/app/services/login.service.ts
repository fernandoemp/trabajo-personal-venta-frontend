import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { PublicacionFbService } from './publicacion-fb.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  usuarioLogueado: Usuario;
  userLoggedIn = false;
  userLogueado: string;
  userLogueadoDisplay: string;
  userPerfil: string;
  userId: string;
  urlBase = 'http://localhost:3000/api/usuarios/';

  // urlBase = 'https://trabajofinalpysw2020.herokuapp.com/api/usuarios/';

  // tslint:disable-next-line: variable-name
  constructor(private _http: HttpClient, private router: Router, private fbService: PublicacionFbService, private toast: ToastrService) {
    this.userLoggedIn = false;
    this.userLogueado = '';
    this.userLogueadoDisplay = '';
    this.userPerfil = '';
    this.userId = '';
    this.usuarioLogueado = new Usuario();
    this.obtenerUsuarioLogueado();
  }
  obtenerUsuarioLogueado(){
    if (localStorage.getItem('usuario') !== null){
    this.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
    this.userLogueado = this.usuarioLogueado.usuario;
    this.userPerfil = this.usuarioLogueado.perfil;
    this.userId = this.usuarioLogueado._id;
    this.userLoggedIn = true;
    this.obtenerNombreCorto();
    }
 }

  public signIn(usuario: string, password: string): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const body = JSON.stringify({ usuario, password });
    return this._http.post(this.urlBase + 'signin', body, httpOption);
  }

  public signInFB(usuario: string): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const body = JSON.stringify({ usuario});
    return this._http.post(this.urlBase + 'signinFB', body, httpOption);
  }
  bloquearUsuarioByEmail(email: string): Observable<any>{
    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({
      })
    };

    return this._http.put(this.urlBase + 'bann/' + email, httpOptions);
  }
/* enviamos el token dentro de este metodo en su cabecera gracias a token service */
/*
  public getUsuarioSesionByToken(){
    const httpOptions = {
      // tslint:disable-next-line: new-parens
      headers: new HttpHeaders({

      })
    };
    return this._http.get(this.urlBase + 'user', httpOptions);
  }

public getUsuarioSesion(){
  /*enviamos el token en este metodo en header*/
  /*
  this.getUsuarioSesionByToken().subscribe(
    (result) => {
      if (localStorage.getItem('usuario') !== null){
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
        // tslint:disable-next-line: no-string-literal
        const user = result['usuario'];
        // tslint:disable-next-line: no-string-literal
        const perfil = result['perfil'];
        // tslint:disable-next-line: no-string-literal
        const id = result['_id'];
        if (usuarioLogueado._id === id && usuarioLogueado.perfil === perfil){
          // console.log('entro1');
         // tslint:disable-next-line: no-string-literal
         this.userLogueado = result['usuario'] ;
         // tslint:disable-next-line: no-string-literal
         this.userPerfil = result['perfil'];
         // tslint:disable-next-line: no-string-literal
         this.userId = result['_id'];
         this.userLoggedIn = true;
         this.obtenerNombreCorto();
        }
       else{
           this.toast.error('Inicie sesión nuevamente', 'Error de integridad');
           // console.log('entro2');
           this.logout();
           this.router.navigate(['signin']);
       }
      }
     else{
      console.log('sin json');
     }
    },
    (error) => {
      this.userLogueado = '';
      this.userPerfil = '';
      this.userId = '';
      this.userLoggedIn = false;
      this.logout();
    });
}*/
  public logout() {
    this.userLogueado = '';
    this.userLoggedIn = false;
    this.userPerfil = '';
    this.userId = '';
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.router.navigate(['inicio']);
    if (this.fbService.name !== ''){ // esto es para sacar tambien de la sesion si es qe ingreso con fb
      this.fbService.logoutFacebook();
      this.fbService.name = '';
    }
  }

  // comprueba existencia del token en local storage
  public loggedIn(){
    return !!localStorage.getItem('token');
  }
  // obtiene token del local storage
  public getToken(){
    return localStorage.getItem('token');
  }



  obtenerNombreCorto(){

    const arreglo = this.userLogueado.split('');
    const found = arreglo.findIndex(element => element === '@');

    if (found > 0){
      this.userLogueadoDisplay = this.userLogueado.substring(0, found);
    }
    else{
      this.userLogueadoDisplay = this.userLogueado;
    }
    }
  }


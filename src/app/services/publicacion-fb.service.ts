import { Injectable } from '@angular/core';
import { FacebookService, InitParams, LoginResponse } from 'ngx-fb';
import { ApiMethod } from 'ngx-fb/dist/esm/providers/facebook';

@Injectable({
  providedIn: 'root'
})
export class PublicacionFbService {

  token = "EAAILnz0cYFMBAHk7nTIlTsWXqWRuR13ZC4NknmveC17xaXR5vb3gcdoMsNDJRYCbtDzg9SVD0njtmY75Jz5fBnthrstLxrWW7sFVGUC6GKJvVZA2sYG3sQp0ZCjZBYlFkyoac49DO7F5mZBzO9vD8xY0Tt3TF9JnSIZBnTRxsRNxteN7fpP3eU1Dun29zfeQYOOztPzUkGpJsXqx8Wyj3U";
  //actualizarlo cada dos horas....
  resultadoID: any;
  id: string;

  name: string = ""; //name del usuario qe se loguea

  constructor(private fb: FacebookService) {
    this.iniciarFb();
  }

  iniciarFb() {
    /*
    appId Enzo: '4219579478083150' 
    appId Fernando: '575728506396755'
    */
    let initParams: InitParams = {
      appId: '575728506396755', // '575728506396755', 
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v7.0'
    };
    this.fb.init(initParams);
  }

  postFb(msj: string) {
    /*
    Página de facebook de Fernando '/103068891467783/feed' 
    Pagina de facebook Enzo: '/105949374516687/feed'
    */
    var apiMethod: ApiMethod = "post";
    return this.resultadoID = this.fb.api('/103068891467783/feed', apiMethod,
      {
        "message": msj,
        //El token hay que actualizar cada dos horas
        "access_token": this.token
      });
  }

  updateFb(msj: string, id: string) {
    var apiMethod: ApiMethod = "post";
    var resultado = this.fb.api('/' + id, apiMethod,
      {
        "message": msj,
        "access_token": this.token
      });
    resultado.then((value) => {
      console.log(value['success']);
    });
  }

  deleteFb(id: string) {
    var apiMethod: ApiMethod = "delete";
    var resultado = this.fb.api('/' + id, apiMethod,
      {
        "access_token": this.token
      });
    resultado.then((value) => {
      console.log(value['success']);
    });
  }

  getFb(id: string) {
    var apiMethod: ApiMethod = "get";
    return this.resultadoID = this.fb.api('/' + id, apiMethod,
      {
        "access_token": this.token
      });
  }

  /* loguin facebook */
  loginWithFacebook() {
    return this.fb.login();
  }

  logoutFacebook() {
    this.fb.logout();
  }

  //inciar con el appId diferente para la app de fb
  iniciarFbLoguin() {
    let initParams: InitParams = {
      appId: '2012027832263241',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v7.0'
    };
    this.fb.init(initParams);
  }

  //para traer el nombre del usuario qe se logueo por fb
  getUsuarioLoguead(id: string) {
    var apiMethod: ApiMethod = "get";
    return this.fb.api('/' + id, apiMethod,
      {
        "access_token": "EAAcl7bw4YkkBAMZB3lxnKei5HdF8rDN8r2H4Xv6Eisx8mHnlFYzi11E7Xfsp4XvyOcGo11VYIIBETy5l52ZCUEC9eMOySdhhyUCfMZBtlnUn7XMLKDTFpd7uMWdWjqV9qtzgsokY1gZAW6Jd3ZBCXdtzCd5bSEbZBp0oJEKaclZAO8MQlT5a39fPLpgtIj4bAmk3XY8NnuIzOBzGHziAI5V",
      });
  }

}

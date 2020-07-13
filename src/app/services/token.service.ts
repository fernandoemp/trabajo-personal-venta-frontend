import { Injectable } from '@angular/core';
import {  HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './../services/login.service';
/*https://www.youtube.com/watch?v=l_r9nRJ9YTk
explicacion de este tema y de guard
*/
@Injectable({
  providedIn: 'root'
})
export class TokenService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }

  // agrega a las cabeceras el token, si no existe envia null
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     const tokenizeReq = req.clone({
      setHeaders: {
        Authorization:  `Bearer ${this.loginService.getToken()}`
      }
     });
     return next.handle(tokenizeReq);
  }
}

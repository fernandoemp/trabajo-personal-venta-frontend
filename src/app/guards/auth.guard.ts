import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line: max-line-length
// Los guards son interfaces que permiten proteger las rutas en el frontend e indican al enrutador si se permitirá la navegación a una ruta o no.
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router, private toast: ToastrService){

  }
  // comprueba existencia del token
  canActivate(){
    if (this.loginService.loggedIn()){
      return true;
    }
    else{
      this.router.navigate(['/inicio']);
      this.toast.error('Accion no permitida');
      return false;
    }
  }
}

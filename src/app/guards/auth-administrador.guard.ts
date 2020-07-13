import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthAdministradorGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router, private toast: ToastrService){

  }
  // comprueba existencia del token
  canActivate(){
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (this.loginService.loggedIn() && (usuario.perfil === 'Administrador')){
      return true;
    }
    else{
      this.toast.error('Accion no permitida');
      this.router.navigate(['/inicio']);
      return false;
    }
  }
}

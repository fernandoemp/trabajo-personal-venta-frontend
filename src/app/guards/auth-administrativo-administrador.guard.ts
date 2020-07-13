import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthAdministrativoAdministradorGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router, private toast: ToastrService){

  }
  // comprueba existencia del token
  canActivate(){
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (this.loginService.loggedIn() && (usuario.perfil === 'Administrador' || usuario.perfil === 'Administrativo')) {
      return true;
    }
    else{
      this.router.navigate(['/inicio']);
      this.toast.error('Accion no permitida');
      return false;
  }
  }
}

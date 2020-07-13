import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { NovedadService } from 'src/app/services/novedad.service';
import { Novedad } from 'src/app/models/novedad';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {

  usuarioMsj: Usuario;

  constructor(public loginService: LoginService, public novedadService: NovedadService, public usuarioService: UsuarioService){
    this.loginService.obtenerUsuarioLogueado();
    this.usuarioMsj = new Usuario();
    this.calcularNovedades();
    this.getUsuarioByIdMensajes();
    this.novedadService.cantMensajePorUser = 0;
    this.novedadService.cantNovedades = 0;
  }

  calcularNovedades(){
    if (localStorage.getItem('usuario') !== null){
      this.novedadService.getNovedadesSinProcesar().subscribe(
        (result) => {
          result.forEach(element => {
            this.novedadService.cantNovedades ++;
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getUsuarioByIdMensajes(){
     if (localStorage.getItem('usuario') !== null){
        this.novedadService.cantMensajePorUser = 0;
        this.usuarioService.getUsuarioById(this.loginService.userId).subscribe(
        (result) => {
          if (result.status === 200){
            Object.assign(this.usuarioMsj, result.usuario);
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.usuarioMsj.mensajes.length; i++){
              if (this.usuarioMsj.mensajes[i].leido === false){
                this.novedadService.cantMensajePorUser ++ ;
              }
            }
          }
        },
        (error)  => {
          console.log(error);
        });
      }
    }
}

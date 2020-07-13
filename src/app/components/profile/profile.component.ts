import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PropietarioService } from 'src/app/services/propietario.service';
import { Usuario } from 'src/app/models/usuario';
import { Propietario } from 'src/app/models/propietario';
import { Toast, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Mensaje } from 'src/app/models/mensaje';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NovedadService } from 'src/app/services/novedad.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  propietario: Propietario;
  propietarioBackup: Propietario;
  modificar = false;
  passwordAux: string;
  mensaje: Mensaje;
  mensajes: Array<Mensaje>;
  mensajesLeidos: Array<Mensaje>;
  cantidadMensajes: number;
  cantidadMensajesLeidos: number;
  mensajeToast: string;

  usuarioMsj: Usuario;

  // tslint:disable-next-line: max-line-length
  constructor(public loginService: LoginService,private novedadService: NovedadService ,private usuarioService: UsuarioService, private propietarioService: PropietarioService, private toast: ToastrService, private router: Router, private modalService: NgbModal) {
    this.loginService.obtenerUsuarioLogueado();
    this.propietario = new Propietario();
    this.propietarioBackup = new Propietario();
    this.usuario = new Usuario();
    this.usuarioMsj = new Usuario();//para las notifs
    this.usuario.mensajes = new Array<Mensaje>();
    this.modificar = false;
    this.passwordAux = '';
    this.getUsuarioById();
    this.getPropietarioByEmail();
    this.mensajes = new Array<Mensaje>();
    this.mensajesLeidos = new Array<Mensaje>();
    this.mensaje = new Mensaje();
    this.cantidadMensajes = 0;
    this.cantidadMensajesLeidos = 0;
    this.obtenerMensajes();
    this.mensajeToast = '';
   }

  ngOnInit(): void {

  }

  getPropietarioByEmail(){
    this.propietarioService.getPropietarioByEmail(this.usuario.usuario).subscribe(
      (result) => {
        if (result.status === 200){
          Object.assign(this.propietario, result.propietario);
          Object.assign(this.propietarioBackup, result.propietario);
        }
      },
      (error)  => {
        console.log(error);
      });
  }

getUsuarioById(){
        Object.assign(this.usuario, JSON.parse(localStorage.getItem('usuario')));
        this.usuarioService.getUsuarioById(this.usuario._id).subscribe(
          (result) => {
            if (result.status === 200){
              Object.assign(this.usuario, result.usuario);
            }
          },
          (error)  => {
            console.log(error);
            this.toast.error('Usuario no encontrado. Contante al administrador');
          });
}

restaurarPropietario(){
  Object.assign(this.propietario, this.propietarioBackup);
}

  updatePropietario(){
    this.propietarioService.updatePropietario(this.propietario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Usuario modificado con exito');
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido actualizar sus datos. Contacte al administrador');
        }
      });
  }

  onFileChanges(file){
    console.log(file);
    if (file !== undefined){
       this.usuario.fotoPerfil = file[0].base64;
       this.mensajeToast = 'La foto de perfil ha sido cambiada';
       this.updateUsuario();
    }
  }

  verificarPassword(){
    return this.usuario.password === this.passwordAux;
  }

  onSubmit(form) {
    form.reset();
  }

  updatePasswordUsuario(){
    this.usuarioService.updatePasswordUsuario(this.usuario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Contraseña modificada con exito');
          this.usuario.password = '';
          this.passwordAux = '';
          localStorage.removeItem('token');
          this.router.navigate(['signin']);
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido actualizar el usuario. Contacte al administrador');
        }
      });
  }

  //////////// MENSAJES //////////

  obtenerMensajes(){
    this.cantidadMensajes = 0;
    this.cantidadMensajesLeidos = 0;
    this.mensajes = new Array<Mensaje>();
    this.mensajesLeidos = new Array<Mensaje>();
    this.usuarioService.getUsuarioById(this.usuario._id).subscribe(
      (result) => {
        if (result.status === 200){
          Object.assign(this.usuario, result.usuario);
          this.usuario.mensajes.forEach(element => {
            let msj = new Mensaje();
            Object.assign(msj, element);
            if (msj.leido === false){
                this.mensajes.push(msj);
                console.log(msj);
                this.cantidadMensajes += 1;
            }
            else{
                this.mensajesLeidos.push(msj);
                this.cantidadMensajesLeidos += 1;
            }
        }
        );
          //this.mensajes.sort((m2, m1) => new Date(m1.fechaEnviado).getTime() - new Date(m2.fechaEnviado).getTime());
          //this.mensajesLeidos.sort((m2, m1) => new Date(m1.fechaEnviado).getTime() - new Date(m2.fechaEnviado).getTime());
        }
      },
      (error)  => {
        console.log(error);
        this.toast.error('Usuario no encontrado. Contante al administrador');
      });
  }

  obtenerMensajesLeidos(){
    this.cantidadMensajesLeidos = 0;
    this.mensajes = new Array<Mensaje>();
    this.mensajes = this.mensajesLeidos;
    this.cantidadMensajesLeidos = this.mensajesLeidos.length;
  }


  updateUsuario(){
    this.usuarioService.updateUsuario(this.usuario).subscribe(
      (result) => {
        if (result.status === 200){
          if (this.mensajeToast !== ''){
            this.toast.success(this.mensajeToast);
            this.getUsuarioByIdMensajes(); // para actualizar el header
          }
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido realizar la acción. Contacte al administrador');
        }
      });
  }


  leerMensaje(mensaje: Mensaje, modal) {
    this.mensaje = new Mensaje();
    Object.assign(this.mensaje, mensaje);
    if (this.mensaje.leido === false){
      mensaje.leido = true;
      // tslint:disable-next-line: prefer-const
      let index = this.usuario.mensajes.findIndex( msj => msj._id === this.mensaje._id);
      this.mensaje.leido = true;
      console.log(this.usuario.mensajes);
      // this.usuario.mensajes.splice(index, 1, this.mensaje); // generaba error de vez en cuando
      this.usuario.mensajes.splice(index, 1)
      this.usuario.mensajes.push(this.mensaje);
      this.mensajeToast = '';
      this.updateUsuario();
      this.cantidadMensajesLeidos += 1;
      this.cantidadMensajes -= 1;
      this.mensajesLeidos.push(this.mensaje);
    }
    this.modalService.open(modal);
}
/* se desabilito esta opcion dado que se perdia informacion al momento de recuperar los mensajes de las novedades
eliminarMensaje(mensaje: Mensaje){
  const index = this.usuario.mensajes.findIndex( msj => msj._id === mensaje._id);
  this.usuario.mensajes.splice(index, 1);
  const index2 = this.mensajes.findIndex( msj => msj._id === mensaje._id);
  this.mensajes.splice(index2, 1);
  this.mensajeToast = '';
  this.updateUsuario();
  this.cantidadMensajesLeidos -= 1;
  this.toast.info('Mensaje Eliminado');
}
*/
// para actalziar el header de notificaciones
getUsuarioByIdMensajes(){
  this.novedadService.cantMensajePorUser = 0;
  Object.assign(this.usuarioMsj, JSON.parse(localStorage.getItem('usuario')));
  this.usuarioService.getUsuarioById(this.usuarioMsj._id).subscribe(
    (result) => {
      if (result.status === 200){
        Object.assign(this.usuarioMsj, result.usuario);
        for(var i =0; i< this.usuarioMsj.mensajes.length; i++){
          if(this.usuarioMsj.mensajes[i].leido == false){
            this.novedadService.cantMensajePorUser ++ ;
          }
        }
      }
    },
    (error)  => {
      console.log(error);
      this.toast.error('Usuario no encontrado. Contante al administrador');
    });
}

}

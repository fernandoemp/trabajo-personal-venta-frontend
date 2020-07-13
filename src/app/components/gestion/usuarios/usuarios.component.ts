import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PropietarioService } from 'src/app/services/propietario.service';
import { Propietario } from 'src/app/models/propietario';
import { Mensaje } from 'src/app/models/mensaje';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuario: Usuario;
  usuarios: Array<Usuario>;
  busqueda: string;
  propietario: Propietario;
  passwordAux: string;
  mostrarBorrados: boolean;
  mensaje: Mensaje;

  // tslint:disable-next-line: max-line-length
  constructor(private usuarioService: UsuarioService, private toast: ToastrService, public loginService: LoginService, private router: Router, private modalService: NgbModal, private propietarioService: PropietarioService) {
  this.loginService.obtenerUsuarioLogueado();
  this.usuario = new Usuario();
  this.usuario.activo = true;
  this.usuarios = new Array<Usuario>();
  this.getUsuarios();
  this.propietario = new Propietario();
  this.busqueda = '';
  this.passwordAux = '';
  this.mostrarBorrados = false;
  this.mensaje = new Mensaje();
  }

  ngOnInit(): void {
  }

  public signUp() {

    this.usuario.fechaAltaUsuario = new Date();
    this.usuarioService.signUp(this.usuario).subscribe(
        (result) => {
          console.log(result);
          if (result.status === 201){
            this.toast.success('Usuario registrado con exito');
            this.usuario = new Usuario();
            this.getUsuarios();
          }
        },
        (error)  => {
          console.log(error);
          if (error.status === 403){
            this.toast.warning('El usuario ya se encuentra registrado');
          }
          if (error.status === 404){
              this.toast.warning('El PROPIETARIO aún no se encuentra registrado');
          }
          if (error.status === 500){
            this.toast.error('No se ha podido registrar al usuario. Contacte al administrador');
          }
        });
  }

  obtenerUsuarioLogueado(){
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    this.loginService.usuarioLogueado = usuario.usuario;
    console.log(usuario.usuario);
  }
    updateUsuario(){
    this.usuarioService.updateUsuario(this.usuario).subscribe(
      (result) => {
        if (result.status === 200){
            this.toast.success('Usuario actualizado con exito');
            this.usuario = new Usuario();
            this.getUsuarios();
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido actualizar el usuario. Contacte al administrador');
        }
      });
  }

  deleteUsuario(){
    this.usuario.activo = false;
    this.usuario.borrado = true;
    this.usuarioService.updateUsuario(this.usuario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Usuario borrado con exito');
          this.usuario = new Usuario();
          this.getUsuarios();
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido borrar el usuario. Contacte al administrador');
        }
      });
  }

  deleteUsuarioDefinitivamente(){
    this.usuarioService.deleteUsuario(this.usuario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Usuario borrado con exito');
          this.usuario = new Usuario();
          this.getUsuarios();
          this.mostrarBorrados = false;
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido borrar el usuario. Contacte al administrador');
        }
      });
  }

  getUsuarios(){
    this.busqueda = '';
    this.usuarios = new Array<Usuario>();
    this.usuarioService.getUsuarios().subscribe(
      (result) => {
        this.loginService.userLogueado = result.usuario;
        result.usuarios.forEach(element => {
          // tslint:disable-next-line: prefer-const
          let user  = new Usuario();
          Object.assign(user, element);
          if (user.borrado !== true){
              this.usuarios.push(user);
          }
        });
      },
      (error)  => {
        let perfil = error.error.perfil;
        if (perfil !== this.loginService.userPerfil){
          const usuario = error.error.usuario;
          this.toast.error('Contacte al administrador', 'CUENTA BLOQUEADA');
          this.toast.error('Integridad del sistema alterado');
          localStorage.clear();
          this.loginService.bloquearUsuarioByEmail(usuario).subscribe(
          );
          this.loginService.logout();
        }
        if (error.permiso == null){
              this.router.navigate(['inicio']);
              this.loginService.logout();
          }
      });
  }


  restaurarUsuario(){
    this.usuario.activo = true;
    this.usuario.borrado = false;
    this.usuarioService.updateUsuario(this.usuario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Usuario borrado con exito');
          this.usuario = new Usuario();
          this.getUsuarios();
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido borrar el usuario. Contacte al administrador');
        }
      });
  }
  getUsuariosBorrados(){
    this.usuarios = new Array<Usuario>();
    this.usuarioService.getUsuarios().subscribe(
      (result) => {
        result.usuarios.forEach(element => {
          // tslint:disable-next-line: prefer-const
          let user  = new Usuario();
          Object.assign(user, element);
          if (user.borrado === true){
            this.usuarios.push(user);
          }
          });
      },
      (error)  => {
        console.log(error);
      });
  }

  updatePasswordUsuario(){
    this.usuarioService.updatePasswordUsuario(this.usuario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Contraseña modificada con exito');
          this.usuario = new Usuario();
          this.getUsuarios();
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido actualizar el usuario. Contacte al administrador');
        }
      });
  }
  getPropietarioByUsuario(usuario: Usuario){
    this.propietario = new Propietario();
    this.propietarioService.getPropietarioByEmail(usuario.usuario).subscribe(
      (result) => {
        if (result.status === 200){
          Object.assign(this.propietario, result.propietario);
        }
      },
      (error)  => {
        console.log(error);

      });
  }

  abrirModal(modal){
    this.modalService.open(modal);
  }

  public verModal(modal, usuario: Usuario) {
    this.modalService.open(modal);
    const oUsuario = new Usuario();
    Object.assign(oUsuario, usuario);
    this.usuario = oUsuario;
}

  limpiarCampos(){
    this.usuario = new Usuario();
    this.passwordAux = '';
    this.mensaje = new Mensaje();
  }

  seleccionarEstadoCuenta(seleccion: boolean){
    this.usuario.activo = seleccion;
  }

  verificarPassword(){
    return this.usuario.password === this.passwordAux;
  }

  onSubmit(form) {
    form.reset();
  }

  enviarMensaje(){
    this.mensaje.usuarioRemitente = this.loginService.userLogueado;
    this.mensaje.usuarioDestinatario = this.propietario.email;
    this.mensaje.fechaEnviado = new Date();
    // tslint:disable-next-line: prefer-const
    this.usuario.mensajes.push(this.mensaje);
    this.enviarMensajeUsuario();
    this.mensaje = new Mensaje();
  }

  enviarMensajeUsuario(){
    this.usuarioService.updateUsuario(this.usuario).subscribe(
      (result) => {
        if (result.status === 200){
            this.toast.success('Mensaje enviado');
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido actualizar el usuario. Contacte al administrador');
        }
      });
  }
}

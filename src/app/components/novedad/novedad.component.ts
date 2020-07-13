import { Component, OnInit } from '@angular/core';
import { Novedad } from 'src/app/models/novedad';
import { NovedadService } from 'src/app/services/novedad.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuario';
import { Mensaje } from 'src/app/models/mensaje';
import { UsuarioService } from 'src/app/services/usuario.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-novedad',
  templateUrl: './novedad.component.html',
  styleUrls: ['./novedad.component.css']
})
export class NovedadComponent implements OnInit {

  novedad: Novedad;
  procesar: boolean;
  booleans: Array<boolean>;
  totalSinProcesar: number;
  totalProcesadas: number;
  totalBorradas: number;
  procesadas: Array<Novedad>;
  novedades: Array<Novedad>;
  borradas: Array<Novedad>;
  sinProcesar: boolean;
  mensaje: Mensaje;
  novProc: boolean;
  novSinProc: boolean;
  usuarioNovedad: Usuario;

  // tslint:disable-next-line: max-line-length
  constructor(private novedadService: NovedadService, private toast: ToastrService, public loginService: LoginService, private router: Router, private modalService: NgbModal, private usuarioService: UsuarioService) {
    this.loginService.obtenerUsuarioLogueado();
    this.novedad = new Novedad();
    this.novedad.usuario = new Usuario();
    this.novedades = new Array<Novedad>();
    this.procesadas = new Array<Novedad>();
    this.borradas = new Array<Novedad>();
    this.booleans = new Array<boolean>();
    this.procesar = false;
    this.totalProcesadas = 0;
    this.totalBorradas = 0;
    this.getNovedades();
    this.sinProcesar = false;
    this.mensaje = new Mensaje();
    this.novSinProc = true;
    this.novProc = false;
    this.usuarioNovedad = new Usuario();
    this.usuarioNovedad.mensajes = new Array<Mensaje>();
  }

  ngOnInit(){

  }

  updateNovedad(novedad: Novedad){
    console.log('la novedad que llega');
    console.log(novedad);
    this.novedadService.updateNovedad(novedad).subscribe(
      (result) => {
        if (result.status === 200){
          this.novedad = new Novedad();
          this.actualizarNotificaciones();
        }
      },
      (error)  => {
        if (error.status === 500){
          this.toast.error('No se ha podido actualizar el estado de la novedad. Contacte al administrador');
        }
      });
  }

  deleteNovedad(novedad: Novedad, index: number){
    novedad.borrado = true;
    this.novedadService.updateNovedad(novedad).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Novedad eliminada');
          this.procesadas.splice(index, 1);
          this.totalProcesadas -= 1;
          this.borradas.push(novedad);
          this.totalBorradas += 1;
          let index2 = this.novedades.findIndex( nov => nov._id === novedad._id);
          if (this.novSinProc === true){
              this.getNovedades();
          }
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido actualizar el estado de la novedad. Contacte al administrador');
        }
      });
  }

  deleteNovedadPermanente(novedad: Novedad, index: number){
    this.novedadService.deleteNovedad(novedad).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Novedad eliminada');
          this.borradas.splice(index, 1);
          this.totalBorradas -= 1;
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido borrar la novedad. Contacte al administrador');
        }
      });
  }

  deleteAllNovedadesPermanente(){
    this.borradas.forEach(element => {
      // tslint:disable-next-line: prefer-const
      let nov  = new Novedad();
      Object.assign(nov, element);
      this.novedadService.deleteNovedad(nov).subscribe(
      (result) => {
        if (result.status === 200){

        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido borrar la novedad. Contacte al administrador');
        }
      });
    });
    this.borradas.splice(0, this.totalBorradas);
    this.totalBorradas = 0;
    this.toast.success('Novedades Borradas');
  }

  getNovedades(){
    this.novSinProc = true;
    this.novProc = true;
    this.totalSinProcesar = 0;
    this.totalProcesadas = 0;
    this.totalBorradas = 0;
    this.procesadas = new Array<Novedad>();
    this.borradas = new Array<Novedad>();
    this.novedades = new Array<Novedad>();
    this.novedadService.getNovedades().subscribe(
      (result) => {
        result.novedades.forEach(element => {
          // tslint:disable-next-line: prefer-const
          let nov  = new Novedad();
          Object.assign(nov, element);
          if (nov.usuario == null){
              nov.usuario = new Usuario();
              nov.usuario.usuario = 'Usuario Eliminado';
            }
          if (nov.borrado === false && nov.estado === 'Pendiente'){
              this.novedades.push(nov);
              this.totalSinProcesar += 1;
            }
          if (nov.borrado === false && nov.estado === 'Procesado'){
            this.procesadas.push(nov);
            this.totalProcesadas += 1;
          }
          if (nov.borrado === true){
            this.borradas.push(nov);
            this.totalBorradas += 1;
          }
        }
        );
        if (this.novedades.length === 0){
          this.toast.info('No existen novedades sin gestionar');
        }
        // this.novedades.sort((d2, d1) => new Date(d1.fechaPublicacion).getTime() - new Date(d2.fechaPublicacion).getTime());
        for (let index = 0; index < this.novedades.length; index++) {
          this.booleans[index] = false;
      }
      },
      (error)  => {
        console.log(error);
        let perfil = error.error.perfil;
        if (perfil !== this.loginService.userPerfil){
          const usuario = error.error.usuario;
          this.toast.error('Contacte al administrador', 'CUENTA BLOQUEADA');
          this.toast.error('Integridad del sistema alterado');
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
    getNovedadesProcesadas(){
    this.novSinProc = false;
    this.novProc = true;
    this.booleans = new Array<boolean>();
    this.novedades = new Array<Novedad>();
    // this.procesadas.sort((d2, d1) => new Date(d1.fechaProcesado).getTime() - new Date(d2.fechaProcesado).getTime());
    this.novedades = this.procesadas;
    for (let index = 0; index < this.novedades.length; index++) {
    this.booleans[index] = false;
  }

  }
    getNovedadesBorradas(){
    this.booleans = new Array<boolean>();
    this.novedades = new Array<Novedad>();
    // this.borradas.sort((d2, d1) => new Date(d1.fechaProcesado).getTime() - new Date(d2.fechaProcesado).getTime());
    this.novedades = this.borradas;
    for (let index = 0; index < this.novedades.length; index++) {
    this.booleans[index] = false;
  }
  }

  mostrarNovedad(index: number){
    this.booleans[index] = true;
  }
   cerrarNovedad(index: number){
    this.booleans[index] = false;
  }
  procesarNovedad(index: number, novedad: Novedad){
    Object.assign(this.novedad, novedad); // nuevo

    if (novedad.procesadoPor == null){
      novedad.procesadoPor = this.loginService.userLogueado;
      novedad.estado = 'Procesado';
      novedad.fechaProcesado = new Date();
      this.updateNovedad(novedad);
      this.totalSinProcesar -= 1;
      this.novedadService.cantNovedades --;  //para q se actualize el header
      this.totalProcesadas += 1;
      this.procesadas.push(novedad);
    }
  }
  actualizarNotificaciones(){
    this.novedadService.cantNovedades = 0;
    this.novedadService.getNovedadesSinProcesar().subscribe(
      (result) => {
        result.forEach(element => {
          this.novedadService.cantNovedades ++;
        });
      },
      (error) => {console.log(error);
      }
    );
  }



  enviarMensaje(){
    this.usuarioService.getUsuarioById(this.novedad.usuario._id).subscribe(
      (result) => {
        Object.assign(this.usuarioNovedad, result.usuario);
        this.mensaje.usuarioRemitente = this.loginService.userLogueado;
        this.mensaje.usuarioDestinatario = this.novedad.usuario.usuario;
        this.mensaje.asunto = 'Re: ' + this.novedad.asunto;
        this.mensaje.fechaEnviado = this.novedad.fechaRespuesta = new Date();
        this.usuarioNovedad.mensajes.push(this.mensaje);
        this.updateUsuario(this.usuarioNovedad);
        this.updateNovedad(this.novedad);
        this.getNovedades();
        this.mensaje = new Mensaje();
      },
      (error) => {
        console.log(error);
        this.toast.error('Usuario no encontrado. Contante al administrador');
      });
  }


updateUsuario(usuario: Usuario){
    this.usuarioService.updateUsuario(usuario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.info('Mensaje enviado');
        }
      },
      (error)  => {
        if (error.status === 500){
          this.toast.error('No se ha podido enviar el mensaje. Contacte al administrador');
        }
      });
  }

abrirModal(modal, novedad: Novedad) {
  Object.assign(this.novedad, novedad);
  this.modalService.open(modal);
}
abrirMensajeModal(modal, novedad: Novedad) {
  this.findMensajeUsuario(novedad);
  this.modalService.open(modal);
}


findMensajeUsuario(novedad: Novedad){
  console.log('find mensaje usuario');
  console.log(novedad);
  this.usuarioService.findMensajeUsuario(novedad.usuario._id, novedad.fechaRespuesta).subscribe(
    (result) => {
      if (result.status === 200){
         Object.assign(this.mensaje, result.mensaje);
      }
    },
    (error)  => {
      if (error.status === 404){
        this.toast.error('No se ha podido encontrar el usuario o mensaje');
      }
      if (error.status === 500){
        this.toast.error('Usuario o mensaje no encontrado');
      }
    });
}


limpiarCampos(){
  this.mensaje.texto = '';
}
}

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Novedad } from 'src/app/models/novedad';
import { NovedadService } from 'src/app/services/novedad.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { PublicacionFbService } from 'src/app/services/publicacion-fb.service';
import { Mensaje } from 'src/app/models/mensaje';

@Component({
  selector: 'app-contactenos',
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})
export class ContactenosComponent implements OnInit {
  usuario: Usuario;
  novedad: Novedad;

  // tslint:disable-next-line: max-line-length
  constructor(private novedadService: NovedadService, private toast: ToastrService, public loginService: LoginService, private router: Router, private modalService: NgbModal, usuarioService: UsuarioService, private fbService: PublicacionFbService) {
    this.loginService.obtenerUsuarioLogueado();
    this.usuario = new Usuario();
    this.novedad = new Novedad();
    this.novedad.usuario = new Usuario();
    this.novedad.usuario.mensajes = new Array<Mensaje>();

    this.getUsuario();
    this.novedad.usuario.usuario = this.usuario.usuario;
    if (this.fbService.name !== ''){
      this.novedad.usuario.usuario = 'userfb';
    }
  }

  ngOnInit(): void {

  }
  public enviarNovedad() {
    this.novedad.fechaPublicacion = new Date();
    this.novedad.usuario._id = this.usuario._id;
    this.novedadService.addNovedad(this.novedad).subscribe(
        (result) => {
          if (result.status === 201){
            this.toast.success('Novedad enviada con exito');
            this.actualizarNotificaciones();
            this.limpiarCampos();
          }
        },
        (error)  => {
            console.log(error);
            this.toast.error('No se ha podido registrar al propietario. Contacte al administrador');
        });
  }


 actualizarNotificaciones(){
  this.novedadService.cantNovedades = 0;
  this.novedadService.getNovedadesSinProcesar().subscribe(
    (result)=>{
      result.forEach(element => {
        this.novedadService.cantNovedades ++;
      });
    },
    (error)=> {console.log(error)}
  )
}

  getUsuario(){
    Object.assign(this.usuario, JSON.parse(localStorage.getItem('usuario')));

}

  limpiarCampos(){
    this.novedad.asunto = '';
    this.novedad.texto = '';
  }

onSubmit(form) {
  form.reset();
}
}

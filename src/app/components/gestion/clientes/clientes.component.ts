import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Propietario } from 'src/app/models/propietario';
import { PropietarioService } from 'src/app/services/propietario.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import swal from 'sweetalert2';
import { ImpresionService } from 'src/app/services/impresion.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  @ViewChild('datosusuario') modalUser;
  propietario: Propietario;
  propietarios: Array<Propietario>;
  busqueda: string;
  usuario: Usuario;
  mostrarBorrados: boolean;

  propJson: JSON;

  // tslint:disable-next-line: max-line-length
  constructor(private usuarioService: UsuarioService,  private printService: ImpresionService,  private toast: ToastrService, public loginService: LoginService, private router: Router, private modalService: NgbModal, private propietarioService: PropietarioService) {
    this.loginService.obtenerUsuarioLogueado();
    this.propietario = new Propietario();
    this.propietarios = new Array<Propietario>();
    this.getPropietarios();
    this.propietario = new Propietario();
    this.busqueda = '';
    this.usuario = new Usuario();
    this.mostrarBorrados = false;
  }

  ngOnInit(): void {

  }

  public registrarPropietario() {
    this.propietarioService.addPropietario(this.propietario).subscribe(
        (result) => {
          if (result.status === 201){
            this.toast.success('Propietario registrado con exito');
            this.propietario = new Propietario();
            /* this.nuevoUsuario(); */
            this.getPropietarios();
          }
        },
        (error)  => {
          console.log(error);
          if (error.status === 403){
            this.toast.warning('El dni ya se encuentran registrados');
          }
          if (error.status === 401){
            this.toast.warning('El e-mail ya se encuentran registrados');
          }
          if (error.status === 500){
            this.toast.error('No se ha podido registrar al propietario. Contacte al administrador');
          }
        });
  }

  updatePropietario(){
    this.propietarioService.updatePropietario(this.propietario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Propietario modificado con exito');
          this.propietario = new Propietario();
          this.getPropietarios();
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido actualizar el propietario. Contacte al administrador');
        }
      });
  }

  deletePropietario(){
    console.log(this.propietario);
    this.propietario.borrado = true;
    console.log(this.propietario);
    this.propietarioService.updatePropietario(this.propietario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Propietario borrado con exito');
          this.propietario = new Propietario();
          this.getPropietarios();
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido borrar el propietario. Contacte al administrador');
        }
      });
  }

  deletePropietarioDefinitivamente(){
    this.propietarioService.deletePropietario(this.propietario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Propietario borrado con exito');
          this.propietario = new Propietario();
          this.getPropietarios();
          this.mostrarBorrados = false;
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido borrar el propietario. Contacte al administrador');
        }
      });
  }

  getPropietarios(){
    this.propietarios = new Array<Propietario>();
    this.propietarioService.getPropietarios().subscribe(
      (result) => {
        result.propietarios.forEach(element => {
          // tslint:disable-next-line: prefer-const
          let prop  = new Propietario();
          Object.assign(prop, element);

          if (prop.borrado !== true){
              this.propietarios.push(prop);
          }
        });
        this.propJson = result.propietarios;
      },
      (error)  => {
        console.log(error);
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

  restaurarPropietario(){
    this.propietario.borrado = false;
    this.propietarioService.updatePropietario(this.propietario).subscribe(
      (result) => {
        if (result.status === 200){
          this.toast.success('Propietario restaurado con exito');
          this.propietario = new Propietario();
          this.getPropietarios();
        }
      },
      (error)  => {
        console.log(error);
        if (error.status === 500){
          this.toast.error('No se ha podido restaurado el propietario. Contacte al administrador');
        }
      });
  }
  getPropietariosBorrados(){
    this.propietarios = new Array<Propietario>();
    this.propietarioService.getPropietarios().subscribe(
      (result) => {
        result.propietarios.forEach(element => {
          // tslint:disable-next-line: prefer-const
          let prop  = new Propietario();
          Object.assign(prop, element);
          if (prop.borrado === true){
            this.propietarios.push(prop);
          }
          });
      },
      (error)  => {
        console.log(error);
      });
  }
  public abrirModal(modal) {
    this.modalService.open(modal);
}
  getUsuarioByEmail(propietario: Propietario){
    this.usuario = new Usuario();
    this.usuarioService.getUsuarioByEmail(propietario.email).subscribe(
      (result) => {
        console.log(result);
        if (result.status === 200){
          Object.assign(this.usuario, result.usuario);
          this.modalService.open(this.modalUser);
        }
      },
      (error)  => {
        if (error.status === 404){
          this.toast.warning('No existe un usuario asociado a este propietario');
        }
        if (error.status === 500){
          this.toast.error('Error interno. Contacte al administrador');
        }
      });
  }

  public verModal(modal, propietario: Propietario) {
      this.modalService.open(modal);
      const oPropietario = new Propietario();
      Object.assign(oPropietario, propietario);
      this.propietario = oPropietario;
}

  limpiarCampos(){
    this.propietario = new Propietario();
  }

  onSubmit(form) {
    form.reset();
  }

  imprimirJson(){
    if (this.propJson != null){
      for(let i in this.propJson){
        // tslint:disable-next-line: no-string-literal
        if (this.propJson[i]['borrado'] === true) {
          // tslint:disable-next-line: no-string-literal
          this.propJson[i]['borrado'] = 'NO';
        }
        else{
          // tslint:disable-next-line: no-string-literal
          if(this.propJson[i]['borrado'] === false ) {
            // tslint:disable-next-line: no-string-literal
            this.propJson[i]['borrado'] = 'SI';
          }
      }
    }
      // tslint:disable-next-line: no-var-keyword
      var array = [
        { field: 'apellido', displayName: 'Apellido'},
        { field: 'nombres', displayName: 'Nombres'},
        { field: 'email', displayName: 'E-mail'},
        { field: 'telefono', displayName: 'Telefono'},
        { field: 'dni', displayName: 'DNI'},
        { field: 'borrado', displayName: 'Activo'},
      ];
      this.printService.imprimirJson(this.propJson, array, this.propietarios.length, 'PROPIETARIOS');
    }
    else{
      this.toast.warning('No hay informacion para imprimir');
    }
  }
}

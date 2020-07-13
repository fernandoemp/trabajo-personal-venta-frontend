import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from 'src/app/services/local.service';
import { Local } from 'src/app/models/local';
import { LoginService } from 'src/app/services/login.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ImpresionService } from 'src/app/services/impresion.service';
import { PublicacionFbService } from 'src/app/services/publicacion-fb.service';
import {trigger, style, transition, animate, state} from '@angular/animations';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css'],
  providers: [NgbCarouselConfig],
  animations: [
    trigger('enterState', [
      state('void', style({
        transform: 'translateY(-100%)',
      })),
      transition(':enter', [
        animate(800, style({
          transform: 'translateY(0)',
        }))
      ])
    ])
  ]
})
export class LocalComponent implements OnInit {

  local: Local;
  localBorrar: Local;
  locales: Array<Local>;
  arrayImagenesLocal: Array<string>;
  arrayImgMuestras: Array<string>;
  stringimage: string;
  indiceBorrarImg: number;
  btnGuardar: Boolean = true;
  btnModificar: Boolean = false;

  tamMaxTexto = 200;
  tamTexto = 200;
  localJson: JSON;

  nombreRepetido = false;
  postearEnFb: boolean = false;
  servicios: Array<string>; //servicios reales desde el serviceLocal
  trabajando = false; //para q n interrumpa la accion al momento de postear

  // tslint:disable-next-line: max-line-length
  constructor(private localService: LocalService, private pubFb: PublicacionFbService , private printService: ImpresionService , private toastr: ToastrService, public config: NgbCarouselConfig, private loginService: LoginService, private router: Router) {
    this.loginService.obtenerUsuarioLogueado();
    this.localBorrar = new Local();
    this.local = new Local();
    this.locales = new Array<Local>();
    this.arrayImagenesLocal = new Array<string>();
    this.arrayImgMuestras = new Array<string>();
    this.refrescarLocales();
    this.servicios = this.localService.getServicios();
  }

  ngOnInit(): void {
    registerLocaleData( es );
  }


   // primero publica en fb una vez qe obtiene el fb_id lo guarda en la bd
  public guardarLocal(){
    this.trabajando = true;
    if(this.postearEnFb){
      var resultado  =  this.pubFb.postFb(this.prepararMsj());
      resultado.then((value) => {
        // crear varible, guardando y publicando en fb...
        this.local.fb_id = value['id'];
        this.guardarLocalBD();
        this.trabajando = false;
      })
    }
    else{
      this.local.fb_id = "no";
      this.guardarLocalBD();
    }

  }

  guardarLocalBD(){
    this.local.fechaModificacion = new Date();
    this.local.alquilado = false;
    this.local.imagen = this.arrayImagenesLocal;
    this.localService.addLocal(this.local).subscribe(
      (result) => {
        this.toastr.info("Local Agregado.");
        this.refrescarLocales();
      },
      (error) => {
        console.log(error);
      }
    )
    document.getElementById("btnLimpiar").click();
  }

  refrescarLocales(){
    this.locales = new Array<Local>();
    this.localService.getLocales().subscribe(
      (result) => {
        var lcl: Local = new Local();
        result['locales'].forEach(element => {
          Object.assign(lcl, element);
          this.locales.push(lcl);
          lcl = new Local();
          this.localJson = result['locales']; //imprimir el json
        });
      },
      (error) => {
        console.log(error);
        let perfil = error.error.perfil;
        if (perfil !== this.loginService.userPerfil){
          const usuario = error.error.usuario;
          this.toastr.error('Contacte al administrador', 'CUENTA BLOQUEADA');
          this.toastr.error('Integridad del sistema alterado');
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


  elegirLocal(local: Local){
    var vLocal = new Local();
    Object.assign(vLocal, local);
    this.arrayImagenesLocal = vLocal.imagen;
    this.local = vLocal;
    this.btnGuardar = false;
    this.btnModificar = true;
    this.tamTexto = 200 - this.local.descripcion.length;
    this.postearEnFb = true;
  }

  cargarLocalBorrar(local: Local){
    this.localBorrar = local;
  }

  borrarLocal(){
    if (this.local.fb_id != "no")
      this.pubFb.deleteFb(this.localBorrar.fb_id);

    this.localService.deleteLocal(this.localBorrar).subscribe(
      (result) => {
        this.toastr.info("Local Borrado.");
        this.localBorrar = new Local();
        this.refrescarLocales();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  limpiarLocal(){
    this.local = new Local();
    this.tamTexto = 200;
    this.arrayImagenesLocal = new Array<string>();
  }

  cancelarModificacion(){
    this.local = new Local();
    this.btnModificar = false;
    this.btnGuardar = true;
    this.arrayImagenesLocal = new Array<string>();
    this.postearEnFb = false;
  }

  //para actualizar la publicacion o si pasaron mas de un mes entonces publicarla d nuevo
  actualizarOPostear(){
    var date = new Date();
    var dateStr = String(date).substr(0, 10);
    var fechaInicio = new Date(dateStr).getTime();
    var date2 = new Date(this.local.fechaModificacion);
    var dateStr2 = String(date2).substr(0, 10);
    var fechaFin = new Date(dateStr2).getTime();
    var diff = fechaInicio - fechaFin ;
    var dias = diff / (1000 * 60 * 60 * 24);
    if (dias > 30)
      return true
    else
      return false;
  }

  modificarLocal(){

    if(this.actualizarOPostear()){
      this.trabajando = true;
      if(this.local.fb_id != "no")
        this.pubFb.deleteFb(this.local.fb_id);

      var resultado  =  this.pubFb.postFb(this.prepararMsj());
      resultado.then((value) => {
        //crear varible, guardando y publicando en fb...
        this.local.fb_id = value['id'];
        this.actualizarLocalBD();
        this.trabajando = false;
      })
    }
    else{
      if (this.local.fb_id != "no")
        this.pubFb.updateFb(this.prepararMsj(), this.local.fb_id);
      this.actualizarLocalBD();
    }

  }

  actualizarLocalBD(){
    this.local.fechaModificacion = new Date();
    this.local.alquilado = false; // siempre en no alquilado
    this.local.imagen = this.arrayImagenesLocal;
    this.localService.updateLocal(this.local).subscribe(
      (result) => {
        this.toastr.info("Local Modificado.");
        this.refrescarLocales()
      },
      (error) => {
        console.log(error);
      }
    );
    document.getElementById("btnLimpiar2").click();
    this.btnModificar = false;
    this.btnGuardar = true;
  }

  onFileChanges(files){
      console.log("File has changed:", files);
      var i = 0;
      while ( i < files.length){
        this.stringimage = files[i].base64;
        this.arrayImagenesLocal.push(this.stringimage);
        i = i + 1;
      }
  }
  cargarImagenBorrar(i: number){
    this.indiceBorrarImg = i;
  }
  emilinarImagenDelArray(){
    this.arrayImagenesLocal.splice(this.indiceBorrarImg, 1);
  }

  cargarImagenArray(img: Local){
    this.arrayImgMuestras = img.imagen;
  }
  limpiarArrayImg(){
    this.arrayImgMuestras = new Array<string>();
  }
  //a medida que se escribe en el textarea va cambiando el tamaño de texto disponible
  public cambiarTamTexto(){
    if (this.local.descripcion != null){
      this.tamTexto = 200;
      this.tamTexto -= this.local.descripcion.length;
    }
  }

  imprimirJson(){
    if (this.localJson != null){
      for (var i in this.localJson){
        var nombreTotal = "";
        for (var j = 0; j < this.localJson[i]['servicios'].length; j ++){
          var nombresLoc = this.localJson[i]['servicios'][j] + ". ";
          nombreTotal = nombreTotal + nombresLoc;
        }
        this.localJson[i]['nombreServicios'] = nombreTotal;

        var sup = this.localJson[i]['superficie'];

        if (String(sup).includes("m²") == false){
          this.localJson[i]['superficie'] = this.localJson[i]['superficie'] + " m²";
        }
        if (this.localJson[i]['alquilado'] == true)
          this.localJson[i]['alquilado'] = "SI";
        else
          if (this.localJson[i]['alquilado'] == false)
            this.localJson[i]['alquilado'] = "NO";
      }
      var array = [
        { field: 'nombre', displayName: 'Nombre'},
        { field: 'superficie', displayName: 'Superficie'},
        { field: 'precio', displayName: 'Precio Por Mes'},
        { field: 'banios', displayName: 'Baños'},
        { field: 'costomes', displayName: 'Clientes'},
        /* { field: 'descripcion', displayName: 'Descripcion del local '}, */
        { field: 'alquilado', displayName: 'Alquilado'},
        { field: 'nombreServicios', displayName: 'Servicios'}
      ];
      this.printService.imprimirJson(this.localJson, array, this.locales.length, "LOCALES");
    }
    else{
      this.toastr.warning("No hay informacion para imprimir");
    }
  }


  prepararMsj(){
    var serviciosTotal = "";
    for (var i = 0; i < this.local.servicios.length; i ++){
      serviciosTotal += " - " + this.local.servicios[i] + "\n";
    }
    return "ATENCION GENTE! Habilitamos un nuevo local !!! " + this.local.nombre.toUpperCase() +  "\n La superficie es de " + this.local.superficie
    + " m²" + "\n La cantidad de personas es de " + this.local.costomes + "\n Cuenta con " + this.local.banios  + " baños. "
    + "\n Ofrece los siguientes servicios \n" + serviciosTotal + "\n Y aqui una descripcion del mismo: \n "
    + this.local.descripcion + "\n Puedes ver las imagenes y acercarte a nosotros http://localhost:4200."
  }

  comprobarNombre(){
    if (this.local.nombre != null){
      var nombreInvalido = false;
      for(var i =0; i < this.locales.length; i++){
        if(this.local.nombre.toLowerCase() == this.locales[i].nombre.toLowerCase()){
          nombreInvalido = true;
        }
      }
      if (nombreInvalido == true)
        this.nombreRepetido = true;
      else
        this.nombreRepetido = false;
    }
  }

/*   agregarServicio(){
    this.serviciosTemp.push(this.servicioTemp);
    console.log("entro papa0");
  }
  borrarServicio(i: number){
    this.serviciosTemp.slice(i,1);
  } */
}

import { Component, OnInit } from '@angular/core';
import { Contrato } from 'src/app/models/contrato';
import { ToastrService } from 'ngx-toastr';
import { ContratoService } from 'src/app/services/contrato.service';
import { Propietario } from 'src/app/models/propietario';
import { Local } from 'src/app/models/local';
import { PropietarioService } from 'src/app/services/propietario.service';
import { LocalService } from 'src/app/services/local.service';
import { LoginService } from 'src/app/services/login.service';
import { ImpresionService } from 'src/app/services/impresion.service';
import { PublicacionFbService } from 'src/app/services/publicacion-fb.service';
import {trigger, style, transition, animate, state} from '@angular/animations';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css'],
  animations: [
    trigger('enterState',[
      state('void', style({
        transform: 'translateY(-100%)',
      })),
      transition(':enter',[
        animate(800, style({
          transform:'translateY(0)',
        }))
      ])
    ])
  ]
})
export class ContratoComponent implements OnInit {

  contrato: Contrato;
  contratos: Array<Contrato>;
  contratosTemp: Array<Contrato>; //temp hasta qe se calculen las fechas de vencimiento.
  contratoBorrar: Contrato;
  propietarios: Array<Propietario>;
  locales: Array<Local>;
  estadosContrato: Array<string>;
  localesTemporales: Array<Local>; // este es el array temportal donde se guardan los locales que se van seleccionando desde la listadesplegable
  localesTemporalesModal: Array<Local>; // solo para mostrar los temporales locales del historial de contratos
  propietarioModal: Propietario;
  btnGuardar: Boolean = true;
  btnModificar: Boolean = false;
  tamMaxTexto = 120;
  tamTexto = 120;
  contratoJson: JSON;

  precioLocal: number = 0;
  filterLocales: string;
  localesContratoElegido: Array<Local>;

  // tslint:disable-next-line: max-line-length
  constructor(private contratoService: ContratoService, private pubFb: PublicacionFbService ,private printService: ImpresionService ,private propService: PropietarioService, private localService: LocalService , private toastr: ToastrService, private loginService: LoginService, private router: Router) {
    this.loginService.obtenerUsuarioLogueado();
    this.contrato = new Contrato(); /* this.contrato.duracion = 1; */
    this.contratoBorrar = new Contrato();
    this.contratos = new Array<Contrato>();
    this.contratosTemp = new Array<Contrato>();
    this.propietarios = new Array<Propietario>();
    this.localesTemporales = new Array<Local>();
    this.localesContratoElegido = new Array<Local>();
    this.localesTemporalesModal = new Array<Local>();
    this.propietarioModal = new Propietario();
    this.estadosContrato = ['VIGENTE', 'NO_VIGENTE'];
    this.locales = new Array<Local>();
    this.refrescarContratosTemp();
    this.refrescarLocales();
    this.refrescarPropietarios();
  }

  ngOnInit(): void {
    registerLocaleData( es );
  }

  //registra un contrato
  public guardarContrato(){
    this.contrato.costoTotalAlq = this.precioLocal;
    this.contrato.locales = this.localesTemporales;
    this.contrato.fecha = new Date();
    this.contrato.estado = 'VIGENTE';
    this.alquilarLocal(this.contrato, true);
    this.contratoService.addContrato(this.contrato).subscribe(
      (result)=>{
        this.toastr.info('Contrato Agregado.');
        this.refrescarContratos();
        this.refrescarLocales();
      },
      (error)=>{
        console.log(error);
      }
    )
    this.contrato = new Contrato();
    this.filterLocales = "";
    this.precioLocal = 0;
    this.tamTexto = 120;
    this.localesTemporales = new Array<Local>();
  }

  actualizarLocal(local: Local){
    this.localService.updateLocal(local).subscribe(
      (result)=>{
        //se actualia el local
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  alquilarUno(local: Local){
    if(local.fb_id != "no"){
      console.log("aver aora; " + local.fb_id);
      this.pubFb.updateFb(this.prepararMsj(local, false), local.fb_id);
    }
    this.actualizarLocal(local);
  }

  desalquilarUno(local: Local){
    if(local.fb_id != "no")
      this.pubFb.updateFb(this.prepararMsj(local , true), local.fb_id);
    this.actualizarLocal(local);
  }

  alquilarLocal(contrato: Contrato,estado: boolean){
    for(var i= 0; i < contrato.locales.length; i++){
      contrato.locales[i].alquilado = estado;
      contrato.locales[i].fechaModificacion = new Date();
      if(estado == true){
        this.alquilarUno(contrato.locales[i]);
      }
      else{
        if(this.modificarOPostear(contrato)){
          this.desalquilarUno(contrato.locales[i]);
         /*  if(contrato.locales[i].fb_id != "no")
            this.pubFb.deleteFb(contrato.locales[i].fb_id);

          var resultado  =  this.pubFb.postFb(this.prepararMsj(contrato.locales[i], true));
          console.log(contrato.estado);
          resultado.then((value) => {
            contrato = contrato;
            console.log(contrato.locales[i].nombre);
            contrato.locales[i].fb_id = value['id'];
            this.actualizarLocal(contrato.locales[i]);
          }) */
        }
        else{
          this.desalquilarUno(contrato.locales[i]);
        }
      }
    }
  }

  refrescarContratos(){
    this.contratos = new Array<Contrato>();
    this.contratoService.getContratos().subscribe(
      (result)=>{
        var contr: Contrato = new Contrato();
        result.forEach(element => {
          Object.assign(contr, element);
          this.contratos.push(contr);
          contr = new Contrato();
        });
        console.log("entro a contratos ");
        this.contratoJson = result;
      },
      (error)=>{
        console.log(error);
      }
    )

  }

  calcularDuracionContratos(){
    var fechaHoy = new Date();
    for(var i=0 ; i < this.contratosTemp.length; i++){
      var fechaTtl = new Date(this.contratosTemp[i].fecha);
      fechaTtl = new Date(new Date(fechaTtl).setMonth( fechaTtl.getMonth() + this.contratosTemp[i].duracion));
      if(fechaTtl < fechaHoy && this.contratosTemp[i].estado == "VIGENTE"){
        /* console.log("es mayor :" + i) */
        this.contrato = this.contratosTemp[i];
        this.contrato.estado = "NO_VIGENTE";
        this.contrato.locales = this.contratosTemp[i].locales;
        this.modificarContrato(false);
      }
      fechaTtl = new Date();
     /*  console.log(this.contratosTemp[i].fecha + " ttl: " + fechaTtl  + "hoy:" + fechaHoy); */
    }
    this.refrescarContratos();
  }

  refrescarPropietarios(){
    this.propietarios = new Array<Propietario>();
    this.propService.getPropietarios().subscribe(
      (result)=>{
        var prop: Propietario = new Propietario();
        result.propietarios.forEach(element => {
          Object.assign(prop, element);
          this.propietarios.push(prop);
          prop = new Propietario();
        });
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  refrescarLocales(){
    this.locales = new Array<Local>();
    this.localService.getLocalesNoAlquilados().subscribe(
      (result)=>{
        var lcl: Local = new Local();
        result.forEach(element => {
          Object.assign(lcl, element);
          this.locales.push(lcl);
          lcl = new Local();
        })
        this.filterLocales = "";;
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  noEstaEnLaLista(local: Local): Boolean{
    var i = -1;
    i = this.localesTemporales.findIndex(element => element._id == local._id);
    if(i == -1)
      return true;
    else
      return false;
  }
  guardarLocalEnArrayTemp(local: Local){
    if(local != null){
      if(this.noEstaEnLaLista(local) == true){
        this.localesTemporales.push(local);
        this.toastr.info('Local agregado.');
        this.actualizarPrecio();
      }
      else
        this.toastr.warning('Este Local ya fue agregado.');
    }
    else{
      this.toastr.error('Debe seleccionar primero un local.');
    }
  }

  eliminarLocalDelArrayTemp(i: number){
    this.localesTemporales.splice(i,1);
    this.toastr.info('Local Eliminado.');
    this.actualizarPrecio();
  }

  actualizarPrecio(){
    var sumaTotal= 0;
    for( var i = 0; i < this.localesTemporales.length; i++){
      sumaTotal += this.localesTemporales[i].precio;
    }
    if(this.contrato.duracion == null)
      this.contrato.duracion = 1; //el minimo de meses
    this.precioLocal = sumaTotal * this.contrato.duracion;
  }

  elegirContrato(contrato: Contrato){
    contrato.propietario = this.propietarios.find(element=>element._id == contrato.propietario._id )
    var vCont = new Contrato();
    Object.assign(vCont,contrato);
    this.contrato.locales = vCont.locales;
    this.localesTemporales = vCont.locales;
    for(var i=0; i < this.localesTemporales.length; i++){
      this.localesContratoElegido.push(this.localesTemporales[i]);
    }
    this.contrato = vCont;
    this.precioLocal = this.contrato.costoTotalAlq;
    this.btnGuardar = false;
    this.btnModificar = true;
    this.tamTexto = 120 - this.contrato.descripcion.length;
  }

  cargarContratoBorrar(cont: Contrato){
    this.contratoBorrar = cont;
    this.propietarioModal = cont.propietario;
  }

  borrarContrato(){
    this.contratoBorrar.estado = 'NO_VIGENTE';
    this.alquilarLocal(this.contratoBorrar, false);
    this.contratoService.updateContrato(this.contratoBorrar).subscribe(
      (result)=>{
        this.toastr.info('Contrato Borrado.');
        this.contratoBorrar = new Contrato();
        this.refrescarContratos();
        this.refrescarLocales();
      },
      (error)=>{
        console.log(error);
      }
    );
    this.propietarioModal = new Propietario();
  }

  limpiarContrato(){
    this.tamTexto = 120;
    this.contrato = new Contrato();
    this.localesTemporales = new Array<Local>();
    this.filterLocales = "";
  }

  cancelarModificacion(){
    this.refrescarContratos();
    this.limpiarContrato();
    this.btnModificar = false;
    this.btnGuardar = true;
  }

  estaEnLista(array: Array<Local>, local: Local){
    var esta = false;
    for(var j = 0; j< array.length; j ++){
      if(local._id == array[j]._id){
        esta = true;
      }
    }
    return esta;
  }

  actualizarAlquilerLocales(){
    console.log(this.contrato._id.toString());
    for(var i=0; i < this.localesContratoElegido.length ; i ++){
      if(this.estaEnLista(this.localesTemporales, this.localesContratoElegido[i]) == false){
        this.localesContratoElegido[i].alquilado = false;
        this.localesContratoElegido[i].fechaModificacion = new Date();
        this.desalquilarUno(this.localesContratoElegido[i]);
      }
    }
    for(var i=0; i < this.localesTemporales.length ; i ++){
      if(this.estaEnLista(this.localesContratoElegido, this.localesTemporales[i]) == false){
        this.localesTemporales[i].alquilado = true;
        this.localesTemporales[i].fechaModificacion = new Date();
        this.alquilarUno(this.localesTemporales[i]);
      }
    }
  }

  modificarContrato(mostrarMsj: boolean){
    if(mostrarMsj){
      this.contrato.costoTotalAlq = this.precioLocal;
      this.actualizarAlquilerLocales();
      this.contrato.locales = this.localesTemporales;
    }
    else{
      for(var i = 0 ; i <this.contrato.locales.length ; i ++){
        this.contrato.locales[i].alquilado = true;
        this.contrato.locales[i].fechaModificacion = new Date();
        this.desalquilarUno(this.contrato.locales[i]);
      }
    }
    this.contratoService.updateContrato(this.contrato).subscribe(
      (result)=>{
        if(mostrarMsj){
          this.toastr.info("Contrato Modificado.");
        }
        this.refrescarContratos();
        this.refrescarLocales();
      },
      (error)=>{
        console.log(error);
      }
    );
    this.limpiarContrato();
    this.localesContratoElegido = new Array<Local>();
    this.btnModificar = false;
    this.btnGuardar = true;
  }

  cargarLocalModalMostrar(cnt: Contrato){
    this.localesTemporalesModal = cnt.locales;
  }


  //a medida que se escribe en el textarea va cambiando el tamaño de texto disponible
  public cambiarTamTexto(){
    if(this.contrato.descripcion != null){
      this.tamTexto = 120;
      this.tamTexto -= this.contrato.descripcion.length;
    }
  }

  //refrescar contratos temporal hasta que se controle la duracion de los contratos
  refrescarContratosTemp(){
    this.contratosTemp = new Array<Contrato>();
    this.contratoService.getContratos().subscribe(
      (result)=>{
        var contr: Contrato = new Contrato();
        result.forEach(element => {
          Object.assign(contr, element);
          this.contratosTemp.push(contr);
          contr = new Contrato();
        });
        this.calcularDuracionContratos();
      },
      (error)=>{
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


  imprimirJson(){
    if(this.contratoJson != null){
      for(var i in this.contratoJson){
        var nombreTotal = "";
        for(var j = 0; j < this.contratoJson[i]['locales'].length; j ++){
          var nombresLoc = this.contratoJson[i]['locales'][j]['nombre'] + ". ";
          nombreTotal = nombreTotal + nombresLoc;
        }
        this.contratoJson[i]['nombreLocales'] = nombreTotal;
        var date = this.contratoJson[i]['fecha'];
        this.contratoJson[i]['fecha'] = String(date).substr(0,10);
        if(this.contratoJson[i]['cerrado'] == true)
          this.contratoJson[i]['cerrado'] = "SI";
        else
          if(this.contratoJson[i]['cerrado'] == false )
            this.contratoJson[i]['cerrado'] = "NO";
      }
      var array = [
        { field: 'fecha', displayName: 'Fecha Acuerdo'},
        { field: 'estado', displayName: 'Estado'},
        { field: 'propietario.dni', displayName: 'DNI Propietario'},
        { field: 'nombreLocales', displayName: 'Nombre Locales'},
        /* { field: 'descripcion', displayName: 'Descripcion Contrato'}, */
        { field: 'cerrado', displayName: 'Cerrado'},
        { field: 'costoTotalAlq', displayName: 'Costo Total'},
        { field: 'duracion', displayName: 'Duracion (meses)'}
      ];
      this.printService.imprimirJson(this.contratoJson, array, this.contratos.length,"CONTRATOS");
    }
    else{
      this.toastr.warning("No hay informacion para imprimir");
    }
  }

  prepararMsj(local: Local, tipo: boolean){
    var serviciosTotal = "";
    for(var i = 0; i < local.servicios.length; i ++){
      serviciosTotal += " - " + local.servicios[i] + "\n";
    }

    if(tipo){
      return "NUEVAMENTE HABILITADO !! \n" +  "ATENCION GENTE! Habilitamos un nuevo local !!! " + local.nombre.toUpperCase() +  "\n La superficie es de " + local.superficie
      + " m²" + "\n La cantidad de personas es de " + local.costomes +"\n Cuenta con "+ local.banios  + " baños. "
      + "\n Ofrece los siguientes servicios \n" + serviciosTotal +"\n Y aqui una descripcion del mismo: \n "
      + local.descripcion + "\n Puedes ver las imagenes y acercarte a nosotros http://localhost:4200."
    }
    else{
      return "ACTUALMENTE ALQUILADO. \n" +  "ATENCION GENTE! Habilitamos un nuevo local !!! " + local.nombre.toUpperCase() +  "\n La superficie es de " + local.superficie
      + " m²" + "\n La cantidad de personas es de " + local.costomes +"\n Cuenta con "+ local.banios  + " baños. "
      + "\n Ofrece los siguientes servicios \n" + serviciosTotal +"\n Y aqui una descripcion del mismo: \n "
      + local.descripcion + "\n Puedes ver las imagenes y acercarte a nosotros http://localhost:4200."
    }
  }

  modificarOPostear(contrato: Contrato){
    var date = new Date();
    var dateStr = String(date).substr(0,10);
    var fechaInicio = new Date(dateStr).getTime();
    var date2 = new Date(contrato.fecha);
    var dateStr2 = String(date2).substr(0,10);
    var fechaFin = new Date(dateStr2).getTime();
    var diff = fechaInicio - fechaFin ;
    var dias = diff/(1000*60*60*24);
    if(dias > 7)
      return true
    else
      return false;
  }


}

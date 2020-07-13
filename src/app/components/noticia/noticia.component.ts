import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse } from 'ngx-fb';
import { ApiMethod } from 'ngx-fb/dist/esm/providers/facebook';


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Noticia } from '../../models/noticia';
import { Usuario } from '../../models/usuario';
import { NoticiaService } from 'src/app/services/noticia.service';
import { LoginService } from 'src/app/services/login.service';
import { PublicacionFbService } from 'src/app/services/publicacion-fb.service';
import { ImpresionService } from 'src/app/services/impresion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {

  noticia: Noticia;
  usuario: Usuario;
  /*
   _id: string;
    imagen: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
    usuario: Usuario;
    vigente: boolean;
  */
  postearEnFb: boolean;
  tamMaxTexto = 200;
  tamTexto = 200;
  stringImage: string;
  arrayImagenes: Array<string>;
  arrayImagenes2: Array<string>;
  administrar: boolean;
  noticias: Array<Noticia>;

  opcionSi = true;
  opcionNo = false;

  filterNoticia = "";
  noticiaJson: JSON;

  // tslint:disable-next-line: max-line-length
  constructor(private fb: FacebookService, private printService: ImpresionService ,public loginService: LoginService, private noticiaService: NoticiaService,
              private modalService: NgbModal, private toast: ToastrService, private pubFb: PublicacionFbService, private router: Router) {
      this.loginService.obtenerUsuarioLogueado();
      this.noticia = new Noticia();
      this.noticia.usuario = new Usuario();
      this.usuario = new Usuario();
      this.postearEnFb = false;
      this.arrayImagenes = new Array<string>();
      this.arrayImagenes2 = new Array<string>();
      this.administrar = false;
      this.noticias = new Array<Noticia>();
      this.buscarUsuario();
  }

  ngOnInit(): void {
  }

  public verModal(modal) {
    this.modalService.open(modal);
  }

  buscarUsuario() {
    Object.assign(this.usuario, JSON.parse(localStorage.getItem('usuario')));
  }

  publicar() {
    if (this.postearEnFb) {
      this.postFb();
    }
    this.noticia.imagen = this.arrayImagenes[0];
    this.noticia.fecha = new Date();
    this.noticia.usuario = this.loginService.usuarioLogueado;
    this.noticia.vigente = true;
    //aca falta el coso ese que crea noticias
    this.noticiaService.addNoticia(this.noticia).subscribe(
      (result) => {
        this.limpiarCampos();
        this.toast.success('Publicado con exito');
        this.obtenerNoticias();
      },
      (error) => {
        console.log(error);
      }
    )
  }

  obtenerNoticias() {
    this.noticias = new Array<Noticia>();
    this.noticiaService.getNoticias().subscribe(
      (result) => {
        var not: Noticia = new Noticia();

        result.forEach(element => {

          Object.assign(not, element);
          if(not.usuario == null){
            not.usuario = new Usuario();
            not.usuario.usuario = 'Undefined';
          }
          this.noticias.push(not);
          not = new Noticia();
        });
        this.noticiaJson = result;
      },
      (error) => {
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

  public verModal2(modal, noticia: Noticia) {
    this.modalService.open(modal);
    const oNoticia = new Noticia();
    Object.assign(oNoticia, noticia);
    this.noticia = oNoticia;
    this.arrayImagenes2[0] = this.noticia.imagen;
    this.cambiarTamTexto();
  }

  eliminar() {
    this.noticiaService.deleteNoticia(this.noticia).subscribe(
      (result) => {
        this.toast.success('Eliminado con éxtio');
        this.noticia = new Noticia();
        this.obtenerNoticias();
      },
      (error) => {
        this.toast.error('No se ha podido eliminar. Contacte al administrador');
      });
  }

  editar() {
    this.noticia.imagen = this.arrayImagenes2[0];
    this.noticiaService.updateNoticia(this.noticia).subscribe(
      (result) => {
        this.toast.success('Modificado con exito');
        this.limpiarCampos();
        this.obtenerNoticias();
      },
      (error) => {
        console.log(error);
        this.toast.error('No se ha podido modificar. Contacte al administrador');
      });
  }

  postFb() {
    this.pubFb.postFb(this.noticia.titulo + "\n" + this.noticia.descripcion);
  }

  onFileChanges(files) {
    console.log("File has changed:", files);
    this.stringImage = files[0].base64;
    this.arrayImagenes = new Array<string>();
    this.arrayImagenes.push(this.stringImage);
  }

  onFileChanges2(files) {
    console.log("File has changed:", files);
    this.stringImage = files[0].base64;
    this.arrayImagenes2 = new Array<string>();
    this.arrayImagenes2.push(this.stringImage);
  }

  public cambiarTamTexto() {
    if (this.noticia.descripcion != null) {
      this.tamTexto = 200;
      this.tamTexto -= this.noticia.descripcion.length;
    }
  }

  limpiarCampos() {
    this.noticia = new Noticia();
    this.postearEnFb = false;
    this.tamTexto = 200;
    this.arrayImagenes = new Array<string>();
    this.arrayImagenes2 = new Array<string>();
    this.filterNoticia = "";
  }

  cambiarValor() {
    if (this.administrar) {
      this.administrar = false;
      this.noticias = new Array<Noticia>();
    } else {
      this.administrar = true;
      this.obtenerNoticias();
    }
  }


  imprimirJson(){
    if (this.noticiaJson != null){
      for(var i in this.noticiaJson){
        if(this.noticiaJson[i]['vigente'] == true)
          this.noticiaJson[i]['vigente'] = "VIGENTE";
        else
          if(this.noticiaJson[i]['vigente'] == false)
            this.noticiaJson[i]['vigente'] = "NO_VIGENTE";

        var date = this.noticiaJson[i]['fecha'];
        this.noticiaJson[i]['fecha'] = String(date).substr(0,10);
      }
      var array = [
        { field: 'titulo', displayName: 'Titulo'},
        { field: 'fecha', displayName: 'Fecha Publicacion'},
        { field: 'descripcion', displayName: 'Descripcion'},
        { field: 'usuario.usuario', displayName: 'Usuario Redactor'},
        { field: 'vigente', displayName: 'Vigente'},
      ];
      this.printService.imprimirJson(this.noticiaJson, array, this.noticias.length, "NOTICIAS");
    }
    else{
      this.toast.warning("No hay informacion para imprimir");
    }
  }

}

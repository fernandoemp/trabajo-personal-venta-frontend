import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Noticia } from '../../models/noticia';
import { Usuario } from '../../models/usuario';
import { NoticiaService } from 'src/app/services/noticia.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {


  noticia: Noticia;
  usuario: Usuario;
  noticias: Array<Noticia>;


  // tslint:disable-next-line: max-line-length
  constructor(private noticiaService: NoticiaService, private modalService: NgbModal, private toast: ToastrService, private loginService: LoginService, private router: Router) {
    this.noticia = new Noticia();
    this.usuario = new Usuario();
    this.noticias = new Array<Noticia>();
    this.obtenerNoticias();
  }

  ngOnInit(): void {
  }

  public verModal(modal) {
    this.modalService.open(modal);
  }

  variable(n: Noticia) {
    this.noticia = n;
  }

  obtenerNoticias() {
    this.noticias = new Array<Noticia>();
    this.noticiaService.getNoticiasVigentes().subscribe(
      (result) => {
        var not: Noticia = new Noticia();
        result.forEach(element => {
          Object.assign(not, element);
          this.noticias.push(not);
          not = new Noticia();
        });
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


}

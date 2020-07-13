import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

import { Noticia } from '../../models/noticia';
import { NoticiaService } from 'src/app/services/noticia.service';
import { LocalService } from 'src/app/services/local.service';
import { Local } from 'src/app/models/local';

import { ActivatedRoute, Router } from '@angular/router';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  noticias: Array<Noticia>;
  locales: Array<Local>;
  publicacionesEnDias: Array<string>;

  // tslint:disable-next-line: max-line-length
  constructor(public loginService: LoginService, private router: Router, public noticiaService: NoticiaService, public localService: LocalService, private toast: ToastrService) {
    this.noticias = new Array<Noticia>();
    this.locales = new Array<Local>();
    this.publicacionesEnDias = new Array<string>();
    this.loginService.obtenerUsuarioLogueado();
    this.cargarNoticias();
    this.cargarLocales();
  }

  ngOnInit(): void {
    registerLocaleData(es);
  }


  cargarLocales() {
    this.locales = new Array<Local>();
    this.localService.getLocalesNoAlquilados().subscribe(
      (result) => {
        var lcl: Local = new Local();
        result.forEach(element => {
          Object.assign(lcl, element);
          this.locales.push(lcl);
          this.calcularDias(lcl.fechaModificacion);
          lcl = new Local();
        });
      },
      (error) => {
        console.log(error);
      });
  }

  cargarLocal(local: Local) {
    this.localService.localIndividual = local;
    this.router.navigateByUrl('/localindividual');
  }

  cargarNoticias() {
    this.noticias = new Array<Noticia>();
    this.noticiaService.getNoticiasVigentes().subscribe(
      (result) => {
        result.forEach(element => {
          // tslint:disable-next-line: prefer-const
          let not = new Noticia();
          Object.assign(not, element);
          this.noticias.push(not);
          not = new Noticia();
        });
      },
      (error) => {
        console.log(error);
      });
  }

  calcularDias(fechaCalcular: Date) {
    if (fechaCalcular != null) {
      var date = new Date();
      // tslint:disable-next-line: prefer-const
      var dateStr = String(date).substr(0, 10);
      var fechaInicio = new Date(dateStr).getTime();
      var date2 = new Date(fechaCalcular);
      var dateStr2 = String(date2).substr(0, 10);
      var fechaFin = new Date(dateStr2).getTime();
      var diff = fechaInicio - fechaFin;
      var dias = diff / (1000 * 60 * 60 * 24);
      if (dias == 0)
        this.publicacionesEnDias.push("hoy.");
      else
        this.publicacionesEnDias.push("hace " + dias + " días.");
    }
  }


}

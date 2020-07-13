import { Component, OnInit } from '@angular/core';
import { LocalService } from 'src/app/services/local.service';
import { Local } from 'src/app/models/local';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-local-individual',
  templateUrl: './local-individual.component.html',
  styleUrls: ['./local-individual.component.css'],
  providers: [NgbCarouselConfig]
})
export class LocalIndividualComponent implements OnInit {

  local: Local;
  publicacion: string;

  constructor(private localService: LocalService,public config: NgbCarouselConfig) { 
    this.local = this.localService.localIndividual;
    this.calcularDias();
  }

  ngOnInit(): void {
    registerLocaleData( es );
  }

  calcularDias(){
    if(this.local != null){
      var date = new Date();
      var dateStr = String(date).substr(0,10);
      var fechaInicio = new Date(dateStr).getTime();
      var date2 = new Date(this.local.fechaModificacion);
      var dateStr2 = String(date2).substr(0,10);
      var fechaFin = new Date(dateStr2).getTime();
      var diff = fechaInicio - fechaFin ;
      var dias = diff/(1000*60*60*24);
      if(dias == 0)
        this.publicacion = "hoy.";
      else
        this.publicacion = "hace "+ dias + " días.";
    }

  }
}

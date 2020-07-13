import { Component, OnInit } from '@angular/core';
import {trigger, style, transition, animate, state} from '@angular/animations';

import { HostListener, ElementRef } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css'],
  /* animations: [
    trigger('enterState',[
      state('void', style({
        transform: 'translateX(-100%)',
        opacity:.4
      })),
      transition(':enter',[
        animate(3000, style({
          transform:'translateX(0)',
          opacity:.4
        }))
      ])
    ])
  ] */
  animations: [
    trigger('scrollAnimation', [
      state('scrolled', style({
        transform: 'translateY(0)',

      })),
      state('normal', style({

        transform: 'translateY(200%)',
        opacity: .4,
      })),
      transition('scrolled => normal', animate('1000ms ease-out')),
      transition('normal => scrolled', animate('1000ms ease-in'))
    ]),
    trigger('enterState', [
      state('normal', style({
        transform: 'translateX(-100%)',

      })),
      state('scrolled', style({
        transform: 'translateX(0)',

      })),
      transition('scrolled => normal', animate('400ms ease-out')),
      transition('normal => scrolled', animate('400ms ease-in'))
    ])
  ]
})
export class NosotrosComponent implements OnInit {

  state = 'normal';

  constructor(public el: ElementRef, private loginService: LoginService) {
      this.loginService.obtenerUsuarioLogueado();
   }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
    checkScroll() {
      const componentPosition = this.el.nativeElement.offsetTop;
      const scrollPosition = window.scrollY;

      if (scrollPosition >= componentPosition) {
        this.state = 'scrolled';
      } else {
        this.state = 'normal';
      }

    }



}

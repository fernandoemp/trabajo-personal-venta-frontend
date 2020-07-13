import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario';
import { PublicacionFbService } from 'src/app/services/publicacion-fb.service';

import {LoginResponse } from 'ngx-fb';

import {trigger, style, transition, animate, state} from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('enterState',[
      state('void', style({
        transform: 'translateY(-100%)',
        top: 0,
        position: "absolute",
      })),
      transition(':enter',[
        animate(2000, style({
          transform:'translateY(0)',
          top: 0,
          position: "absolute",
        }))
      ])
    ]),
    trigger('fondo',[
      state('void', style({
        opacity: 0.2,
      })),
      transition(':enter',[
        animate(2000, style({
          opacity: 1,
        }))
      ])
    ])
  ]

})
export class LoginComponent implements OnInit {

  userform: Usuario = new Usuario();
  returnUrl: string;
  msglogin: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public loginService: LoginService,
              private toast: ToastrService,
              private fbService: PublicacionFbService) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/inicio';
  }

  signIn() {
    this.loginService.signIn(this.userform.usuario, this.userform.password)
        .subscribe(
            (result) => {
                  if (result.status === 200){
                     localStorage.setItem('token', result.token);
                     localStorage.setItem('usuario', JSON.stringify(result.usuario));
                     this.router.navigateByUrl(this.returnUrl);
                     this.toast.info('Bienvenido: ' + result.usuario.usuario); // mostra el nombre tambien
                  }
            },
            (error) => {
              if (error.status === 404){
                this.toast.warning('El usuario no existe');
              }
              if (error.status === 403){
                  this.toast.warning('Las contraseñas es invalida. Intente nuevamente');
                }
              if (error.status === 423){
                  this.toast.error('Su cuenta se encuentra bloqueada. Contacte al Administrador');
                }
              if (error.statis === 500){
                  this.toast.error('No se ha podido realizar la accion. Contacte al Administrador');
                }

            });
  }

  loguinFacebook(){
    this.fbService.iniciarFbLoguin();
    let res = this.fbService.loginWithFacebook();
    res.then((response: LoginResponse) =>
    {
      let name = this.fbService.getUsuarioLoguead(response.authResponse.userID);
      name.then((value) => {
         this.loginService.signInFB(value.name).subscribe(
           (result) => {
            localStorage.setItem('token', result.token);
            localStorage.setItem('usuario', JSON.stringify(value.name));
            console.log(response.authResponse.accessToken);
            this.loginService.userLoggedIn = true;
            this.loginService.userLogueado = value.name;
            this.loginService.userPerfil = 'Propietario';
            this.router.navigateByUrl(this.returnUrl);
            this.fbService.name = value.name; // para qe al momento de hacer logout cuando inicie con fb tambien se desloguee de fb
           }
         );
         this.toast.info('Bienvenido: ' + value.name);
      });
    })
    .catch((error: any) => console.error(error));
  }

}

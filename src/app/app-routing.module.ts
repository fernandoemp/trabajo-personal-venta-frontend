import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioComponent } from './components/inicio/inicio.component';
import { ContactenosComponent } from './components/contactenos/contactenos.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { UsuarioComponent } from './components/gestor/usuario/usuario.component';
import { LocalComponent } from './components/local/local.component';
import { ContratoComponent } from './components/contrato/contrato.component';
import { PropietariosComponent } from './components/propietarios/propietarios.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NovedadComponent } from './components/novedad/novedad.component';
import { AuthAdministradorGuard } from './guards/auth-administrador.guard';
import { AuthAdministrativoAdministradorGuard } from './guards/auth-administrativo-administrador.guard';
import { NoticiaComponent } from './components/noticia/noticia.component';
import { LocalIndividualComponent } from './components/local-individual/local-individual.component';
import { NoticiasComponent } from './components/noticias/noticias.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'contactenos', component: ContactenosComponent, canActivate: [AuthGuard]  },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'local', component: LocalComponent, canActivate: [AuthAdministrativoAdministradorGuard] },
  { path: 'contrato', component: ContratoComponent, canActivate: [AuthAdministrativoAdministradorGuard] },
  { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthAdministradorGuard]},
  { path: 'propietarios', component: PropietariosComponent, canActivate: [AuthAdministrativoAdministradorGuard]},
  { path: 'signin', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'novedades', component: NovedadComponent, canActivate: [AuthAdministrativoAdministradorGuard] },
  { path: 'noticia', component: NoticiaComponent,  canActivate: [AuthAdministrativoAdministradorGuard] },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'localindividual', component: LocalIndividualComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {

      anchorScrolling: 'enabled',
      scrollOffset: [0, 0],
      scrollPositionRestoration: 'top'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

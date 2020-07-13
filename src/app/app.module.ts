import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ContactenosComponent } from './components/contactenos/contactenos.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { PropietariosComponent } from './components/propietarios/propietarios.component';
import { FormsModule } from '@angular/forms';
import { NgxDataTableModule } from 'angular-9-datatable';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DniPipe } from './pipes/dni.pipe';
import { UsuarioComponent } from './components/gestor/usuario/usuario.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalComponent } from './components/local/local.component';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import { ContratoComponent } from './components/contrato/contrato.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from './guards/auth.guard';
import { AuthAdministradorGuard } from './guards/auth-administrador.guard';
import { AuthAdministrativoAdministradorGuard } from './guards/auth-administrativo-administrador.guard';
import { TokenService } from './services/token.service';
import { LoginService } from './services/login.service';
import { LoginComponent } from './components/login/login.component';
import { FacebookModule } from 'ngx-fb';
import { ProfileComponent } from './components/profile/profile.component';
import { NovedadComponent } from './components/novedad/novedad.component';
import { NoticiaComponent } from './components/noticia/noticia.component';
import { LocalIndividualComponent } from './components/local-individual/local-individual.component';
import { FilterDniPipe } from './pipes/filter-dni.pipe';
import { FilterUsuarioPipe } from './pipes/filter-usuario.pipe';
/* import { GoogleMapsModule } from '@angular/google-maps'  da un error si alguien quiero hacerl hagaloo...*/
import { FilterLocal } from 'src/app/pipes/filter-local';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { FiltroNoticia } from 'src/app/pipes/filtro-noticia';
import { UsuariosComponent } from './components/gestor/usuarios/usuarios.component';
import { ClientesComponent } from './components/gestor/clientes/clientes.component';
import { ProductosComponent } from './components/gestor/productos/productos.component';
import { VentasComponent } from './components/gestion/ventas/ventas.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    InicioComponent,
    ContactenosComponent,
    NosotrosComponent,
    DniPipe,
    UsuarioComponent,
    LocalComponent,
    ContratoComponent,
    PropietariosComponent,
    LoginComponent,
    ProfileComponent,
    NovedadComponent,
    NoticiaComponent,
    LocalIndividualComponent,
    FilterLocal,
    FilterDniPipe,
    FilterUsuarioPipe,
    NoticiasComponent,
    FiltroNoticia,
    UsuariosComponent,
    ClientesComponent,
    ProductosComponent,
    VentasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AlifeFileToBase64Module,
    FormsModule,
    NgxDataTableModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FacebookModule.forRoot(),

    /*    GoogleMapsModule,
       CommonModule, */
    /* GoogleMapsModule, */
    NgbModule
    /*   NgbModule */
  ],
  providers: [AuthGuard, AuthAdministradorGuard,
    AuthAdministrativoAdministradorGuard, LoginService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

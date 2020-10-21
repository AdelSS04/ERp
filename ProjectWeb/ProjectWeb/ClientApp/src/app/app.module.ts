import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { AuthGuardService } from './guards/auth-guard.service';
import { LoginAuthService } from './guards/login-auth.service';
import { JwtInterceptor } from './_helpers/jwt.Interceptor';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { GallerySliderComponent } from './gallery-slider/gallery-slider.component';
import { CustomerTypeComponent } from './Customer/customer-type/customer-type.component';
import { CustomerComponent } from './Customer/customer/customer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SalesComponent } from './Sales/sales/sales.component';
import { InvoiceListComponent } from './Sales/invoice-list/invoice-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { DatePipe } from '@angular/common';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { ContactComponent } from './contact/contact.component';
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AccessDeniedComponent,
    GallerySliderComponent,
    CustomerTypeComponent,
    CustomerComponent,
    SalesComponent,
    InvoiceListComponent,
    UserProfilComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    DataTablesModule,
    BrowserAnimationsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([])
  ],
  providers: [ AuthGuardService ,LoginAuthService, {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
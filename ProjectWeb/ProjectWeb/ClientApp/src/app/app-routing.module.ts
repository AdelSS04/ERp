import { InvoiceListComponent } from './Sales/invoice-list/invoice-list.component';
import { SalesComponent } from './Sales/sales/sales.component';
import { GallerySliderComponent } from './gallery-slider/gallery-slider.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ProductComponent } from './product/product.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { LoginAuthService } from './guards/login-auth.service';
import { CustomerTypeComponent } from './Customer/customer-type/customer-type.component';
import { CustomerComponent } from './Customer/customer/customer.component';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
{path :"Home", component: HomeComponent},
{path :'', component: HomeComponent, pathMatch: 'full'},
{path: 'Product',loadChildren: () => import('./product/product.module').then(m => m.ProductModule)},
{path :"Login", component: LoginComponent , canActivate : [LoginAuthService]},
{path :"Register", component: RegisterComponent, canActivate : [LoginAuthService]},
{path :"CustomerType", component: CustomerTypeComponent, canActivate : [AuthGuardService]},
{path :"Customer", component: CustomerComponent, canActivate : [AuthGuardService]},
{path :"Sales", component: SalesComponent},
{path :"Sales/:id", component: InvoiceListComponent},
{path :"profile", component: UserProfilComponent},
{path :"contact", component: ContactComponent},



{path :"Forbidden", component: AccessDeniedComponent},
{path :"Slider", component: GallerySliderComponent},
{path: '**', redirectTo: '/Home'}

  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }

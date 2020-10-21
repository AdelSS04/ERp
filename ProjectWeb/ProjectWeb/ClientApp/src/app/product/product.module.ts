import { ProductComponent } from './product.component';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { ProductRoutingModule } from './product-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuardService } from '../guards/auth-guard.service';

import { JwtInterceptor } from '../_helpers/jwt.Interceptor';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  declarations: [ProductComponent, ProductListComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ],
  providers: [
    AuthGuardService , {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
    ],
})
export class ProductModule { }

import { AuthGuardService } from './../guards/auth-guard.service';
import { ProductComponent } from './product.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';


const routes: Routes = [
  
    {path: '', component: ProductComponent, canActivate : [AuthGuardService]},
    {path: 'Product', component: ProductComponent, canActivate : [AuthGuardService]},
    {path: ':id', component : ProductListComponent, canActivate : [AuthGuardService]},

    ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

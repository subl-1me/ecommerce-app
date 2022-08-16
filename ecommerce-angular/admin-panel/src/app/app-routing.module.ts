import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

  // Customers
  import { CustomersComponent } from './components/customers/customers.component';
  import { RegisterComponent } from './components/customers/register/register.component';
  import { EditComponent } from './components/customers/edit/edit.component';

  // Products
  import { CreateComponent } from './components/products/create/create.component';
  import { ListComponent } from './components/products/list/list.component';
  import { EditProductComponent } from './components/products/edit/edit.component';
  import { InventoryComponent } from './components/products/inventory/inventory.component';
  import { GalleryComponent } from './components/products/gallery/gallery.component';

  // Coupons
  import { CouponComponent } from './components/coupon/coupon.component';
  import { AddComponent } from './components/coupon//add/add.component';

  // Messages
  import { MessagesComponent } from './components/messages/messages.component';

  // Etc
  import { ConfigsComponent } from './components/configs/configs.component';


// Guards
import { AdminGuard } from './guards/admin.guard';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [ AdminGuard ]},
  { path: 'login', component: LoginComponent },
  { path: 'panel', children: [
    { path: 'customers', component: CustomersComponent, canActivate: [ AdminGuard ]},
    { path: 'customers/register', component: RegisterComponent, canActivate: [ AdminGuard ]},
    { path: 'customers/edit/:id', component: EditComponent, canActivate: [ AdminGuard ]},

    { path: 'products/create', component: CreateComponent, canActivate: [ AdminGuard ]},
    { path: 'products', component: ListComponent, canActivate: [ AdminGuard ]},
    { path: 'product/edit/:id', component: EditProductComponent, canActivate: [ AdminGuard ]},
    { path: 'product/inventory/:id', component: InventoryComponent, canActivate: [ AdminGuard ]},
    { path: 'product/gallery/:id', component: GalleryComponent, canActivate: [ AdminGuard ]},

    { path: 'coupons', component: CouponComponent, canActivate: [ AdminGuard ]},
    { path: 'coupons/add', component: AddComponent, canActivate: [ AdminGuard ]},

    { path : 'messages', component: MessagesComponent, canActivate: [ AdminGuard ]},

    { path: 'configurations', component: ConfigsComponent, canActivate: [ AdminGuard ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

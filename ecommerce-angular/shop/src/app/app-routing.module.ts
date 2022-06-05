import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
  import { HomeComponent } from './components/home/home.component';
  import { LoginComponent } from './components/login/login.component';
  import { ListComponent } from './components/products/list/list.component';
  import { AdvancedSettingsComponent } from './components/profile/advanced-settings/advanced-settings.component';
  import { ProfileComponent } from './components/profile/profile.component';
  import { RegisterComponent } from './components/register/register.component';
  import { DetailComponent } from './components/products/detail/detail.component';
  import { CheckoutComponent } from './components/checkout/checkout.component';
  import { DirectionsComponent } from './components/profile/directions/directions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'settings', component: AdvancedSettingsComponent },
  { path: 'directions', component: DirectionsComponent },
  { path: 'products', component: ListComponent },
  { path: 'products/:category', component: ListComponent },
  { path: 'products/detail/:id', component: DetailComponent },
  { path: 'checkout', component: CheckoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

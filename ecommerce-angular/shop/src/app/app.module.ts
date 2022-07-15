import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

// plgs
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxStarRatingModule } from 'ngx-star-rating';

// Components 
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileListGroupComponent } from './components/profile-list-group/profile-list-group.component';
import { AdvancedSettingsComponent } from './components/profile/advanced-settings/advanced-settings.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ListComponent } from './components/products/list/list.component';
import { DetailComponent } from './components/products/detail/detail.component';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { DirectionsComponent } from './components/profile/directions/directions.component';
import { StripeComponent } from './components/checkout/stripe/stripe.component';
import { ContactComponent } from './components/contact/contact.component';
import { MyOrdersComponent } from './components/profile/my-orders/my-orders.component';
import { OrderDetailComponent } from './components/profile/order-detail/order-detail.component';
import { ReviewComponent } from './components/review/review.component';
import { WishlistComponent } from './components/navbar/wishlist/wishlist.component';
import { ReviewsComponent } from './components/products/reviews/reviews.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ProfileListGroupComponent,
    AdvancedSettingsComponent,
    BreadcrumbComponent,
    ListComponent,
    DetailComponent,
    CartModalComponent,
    CheckoutComponent,
    DirectionsComponent,
    StripeComponent,
    ContactComponent,
    MyOrdersComponent,
    OrderDetailComponent,
    ReviewComponent,
    WishlistComponent,
    ReviewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    NgxPayPalModule,
    ReactiveFormsModule,
    NgxStarRatingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

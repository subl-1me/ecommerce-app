import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { LoginComponent } from './components/login/login.component';
import { CustomersComponent } from './components/customers/customers.component';
import { RegisterComponent } from './components/customers/register/register.component';
import { EditComponent } from './components/customers/edit/edit.component';
import { CreateComponent } from './components/products/create/create.component';
import { EditProductComponent } from './components/products/edit/edit.component';
import { ListComponent } from './components/products/list/list.component';
import { OptionsButtonComponent } from './components/utils/options-button/options-button.component';
import { InventoryComponent } from './components/products/inventory/inventory.component';
import { CouponComponent } from './components/coupon/coupon.component';
import { AddComponent } from './components/coupon/add/add.component';
import { ConfigsComponent } from './components/configs/configs.component';

// Some plugins
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxFileDropModule } from 'ngx-file-drop';
import { GalleryComponent } from './components/products/gallery/gallery.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SideBarComponent,
    LoginComponent,
    CustomersComponent,
    RegisterComponent,
    EditComponent,
    CreateComponent,
    ListComponent,
    OptionsButtonComponent,
    EditProductComponent,
    InventoryComponent,
    CouponComponent,
    AddComponent,
    ConfigsComponent,
    GalleryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    FontAwesomeModule,
    NgxFileDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

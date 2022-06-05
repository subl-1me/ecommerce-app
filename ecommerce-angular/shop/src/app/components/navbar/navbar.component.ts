import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// Icons
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { Customer } from 'src/app/models/customer';
import { Product } from 'src/app/models/product';

import { CustomerService } from 'src/app/services/customer.service';
import { ConfigsService } from 'src/app/services/configs.service';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [ CustomerService, ConfigsService, ProductsService ]
})
export class NavbarComponent implements OnInit {

  @Output() openCartModal = new EventEmitter<boolean>();


  public customer: Customer;
  public _idStorage: any;
  public categories: any;

  public showFavsMenu: boolean;

  public productsFav: any;
  public loadedProducts: Array<Product>;


  // icons
  faHeart = faHeart;
  faCartShopping = faCartShopping;
  faUser = faUser;
  faMagnifyingGlass = faMagnifyingGlass;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faPlus = faPlus;

  constructor(
    private _customerService: CustomerService,
    private _configsService: ConfigsService,
    private _productsService: ProductsService
  ) {
    this.customer = {
      names: '',
      surnames: '',
    }
    this._idStorage = localStorage.getItem('_id') != undefined ? localStorage.getItem('_id') : null;
    this.productsFav = JSON.parse(localStorage.getItem('productsFav') || '[]');
    this.loadedProducts = [];

    this.showFavsMenu = false;
   }

  ngOnInit(): void {
    this.getCustomer();
    this.getCategories();
    this.getProductsFav();
  }

  getCustomer():void{
    this._customerService.getCustomerById(this._idStorage).subscribe((response) => {
      if(!response.customer) return;

      this.customer = {
        names: response.customer.names,
        surnames: response.customer.surnames
      }
    })
  }

  logOut():void{
    if(!this._idStorage){
      console.log('Not logged.');
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    location.reload();
  }

  getCategories():void{
    this._configsService.getShopConfigs().subscribe((response) => {
      if(!response.actualConfig) return;

      console.log(response);
      this.categories = response.actualConfig[0].categories;
    })
  }

  enableFavsMenu():void{
    if(this.showFavsMenu){
      this.showFavsMenu = false;
      return;
    }
    this.showFavsMenu = true;
  }

  disableFavsMenu():void{
    this.showFavsMenu = false;
  }

  isOnMenu(event:any):void{
    if(event.target.className !== 'card-body' || event.target.className !== 'text-muted'){
      this.showFavsMenu = false;
      return;
    }
  }

  getProductsFav():void{

    for(let i = 0; i < this.productsFav.length; i++){
      this._productsService.getProductById(this.productsFav[i]).subscribe((response) => {
        if(response.product){
          this.loadedProducts.push(response.product);
        }
      })
    }
  }

  updatedBreadcrumb():void{
    
  }

  openCart():void{
    this.openCartModal.emit(true);
  }
}

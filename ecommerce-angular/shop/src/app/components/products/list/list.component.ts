import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { ConfigsService } from '../../../services/configs.service';

import { faHeart, faThList } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ ConfigsService, ProductsService ]
})
export class ListComponent implements OnInit, DoCheck {

  public customerID: any;

  public _idStorage: any;
  public categories: any;

  public filterCategory: any = [];
  public checkArray: any = [];

  public min: number;
  public max: number;
  public sortByOption: any;
  public productsAmount: number;
  public totalProducts: number;
  public totalProductsMessage: string;
  public noItemsFoundMessage: string;

  public addToCartMesssage: string;

  public productsCount: any;

  public expandProductCard: boolean;

  faHeart = faHeart;
  faStar = faStar;
  faCartShopping = faCartShopping;

  public products = Array<Product>();

  constructor(
    private _ConfigsService: ConfigsService,
    private _productsService: ProductsService,
    private _router: ActivatedRoute
  ) { 

    this.customerID = this._router.snapshot.queryParams['_id'];

    this.expandProductCard = false;
    this.min = 0;
    this.max = 0;
    this.sortByOption = "default";
    this.productsAmount = 9;
    this.totalProducts = 0;
    this.totalProductsMessage = '';
    this.noItemsFoundMessage = '';
    this.addToCartMesssage = '';
  }

  ngOnInit(): void {
    this.products = [];
    this._idStorage = localStorage.getItem('_id');
    this.getUserInfo();
    this.getProducts('');
    this.getCategoryRoute();
  }

  getCategoryRoute():void{
    let categoryRoute = this._router.snapshot.paramMap.get('category')?.toLowerCase();
    if(!categoryRoute) return;

    this.getProductsByCategory(categoryRoute);
  }

  ngDoCheck(): void {
  }

  getUserInfo():void{
    this._ConfigsService.getShopConfigs().subscribe((response) => {
      this.categories = response.actualConfig[0].categories;
    })
  }

  getProducts(filter:string):void{

    this._productsService.getProducts(filter).subscribe((response) => {
      if(!response.products) return;

      this.products = response.products;


      this.totalProducts = this.products.length;
      this.products = this.products.splice(0, this.productsAmount);
    })
  }

  getProductsByFilter():void{
    this._productsService.getProducts(this.filterCategory).subscribe((response) => {
      if(response.message){
        this.noItemsFoundMessage = 'No items found with that name.';
        return;
      }

      this.noItemsFoundMessage = '';
      this.products = response.products;
    })
  }

  getProductsByCategory(category:string, event?:any):void{
    if(!event){
      this._productsService.getProductsByCategory(category).subscribe((response) =>{
        if(!response.products) return;

        this.products = response.products;
      })
    }

    if(!event) return;

    if(!this.checkArray.includes(category)){
      this.checkArray.push(category);
    }

    if(!event.target.checked){
      if(this.checkArray.includes(category)){
        let index = this.checkArray.indexOf(category);
        this.checkArray.splice(index, 1);
      }
    }

    if(this.checkArray.length == 0){
      this.getProducts('');
      return;
    }
    
    this._productsService.getProductsByCategory(category).subscribe((response) => {
      if(!response.products) return;

      this.products = response.products;
    })
  }

  onSubmit(){
    if(this.min == 0 && this.max == 0){
      this.getProducts('');
      return;
    }

    this.products = this.products.filter((item) => {
      if(item.price != undefined){
        return +item.price >= this.min && +item.price <= this.max;
      }

      return;
    })

    return;
  }

  sortBy():void{
    switch(this.sortByOption){
      case 'popularity':
        this.products.sort(function(a, b) {
          if(a.sales < b.sales) return 1;
          if(a.sales > b.sales) return -1;

          return 0;
        })
        break;
      case 'lowestPrice':
        this.products.sort(function(a, b) {
          if(a.price > b.price) return 1;
          if(a.price < b.price) return -1;

          return 0;
        })
        break;
      case 'highestPrice':
        this.products.sort(function(a, b) {
          if(a.price < b.price) return 1;
          if(a.price > b.price) return -1;
  
          return 0;
        })
        break;
      case 'default':
        this.getProducts('');
        break;
    }
  }

  showAmount(){
    if(this.productsAmount < 0){
      this.productsAmount = 0;
      return;
    }
    if(this.productsAmount > this.totalProducts){
      this.productsAmount = this.totalProducts;
      this.totalProductsMessage = 'You can only show ' + this.totalProducts + ' products.';
    }else{
      this.totalProductsMessage = '';
    }

    this.getProducts('');
    this.sortByOption = 'default';
    this.products = this.products.splice(0, this.productsAmount); 
  }

  addToCart(productID:any):void{
    if(!this.customerID){
      this.addToCartMesssage = 'Please, log in to add products.';
      return;
    }

    this.addToCartMesssage = ''
  }

}

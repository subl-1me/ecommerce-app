import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { IdentityService } from 'src/app/services/identity.service';
import { ProductInventoryService } from 'src/app/services/product-inventory.service';

// Models
import { ProductInventory } from 'src/app/models/productInventory';

// Icons
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  providers: [ IdentityService, ProductInventoryService ]
})
export class InventoryComponent implements OnInit {

  // Icons
  faTrash = faTrash;
  faAngleLeft = faAngleLeft;
  faPlus = faPlus;

  public token: any;
  public adminID: any;
  public productID: any;

  public isProductAdded: boolean;

  public inventories: any;
  public newProductInventory: ProductInventory;

  constructor(
    private _identityService: IdentityService,
    private _ProductInventoryService: ProductInventoryService,
    private _router: ActivatedRoute
  ) {
    this.token = this._identityService.getToken();
    this.productID = this._router.snapshot.paramMap.get('id');
    this.adminID = localStorage.getItem('_id');
    this.newProductInventory = {};
    this.isProductAdded = false;
   }

  ngOnInit(): void {
    this.getInventories();
  }

  getInventories():void{
    this._ProductInventoryService.inventories(this.token, this.productID).subscribe((response) => {
      if(!response.inventories){}

      this.inventories = response.inventories;
      this.registerSuccessStatus();
    })
  }

  addNewInventoryRegister(form:any):void{
    this.newProductInventory.product = this.productID;
    this.newProductInventory.admin = this.adminID;

    this._ProductInventoryService.add(this. token, this.newProductInventory).subscribe((response) => {
      if(!response.newInventory){
        console.log('error');
        return;
      }

      form.reset();
      this.getInventories();
      this.isProductAdded = true;
      console.log(response);
    })
  }

  removeInventoryRegister(inventoryRegisterID:any):void{
    this._ProductInventoryService.remove(this.token, inventoryRegisterID).subscribe((response) => {
      this.getInventories();
      console.log(response)
    })
  }

  registerSuccessStatus():void{
    var self = this;
    setTimeout(function(){
      self.isProductAdded = false;
    }, 2000);
  }

}

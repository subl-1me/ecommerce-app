import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { IdentityService } from 'src/app/services/identity.service';
import { ProductInventoryService } from 'src/app/services/product-inventory.service';

// Models
import ProductInventory from 'src/app/models/productInventory';

// Icons
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Auth from 'src/app/models/auth';
import { Product } from 'src/app/models/product';
import ProductVariant from 'src/app/models/productVariant';
import { lastValueFrom } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import VariantValue from 'src/app/models/variantValue';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  providers: [IdentityService, ProductInventoryService, ProductService],
})
export class InventoryComponent implements OnInit {
  // Icons
  faTrash = faTrash;
  faAngleLeft = faAngleLeft;
  faPlus = faPlus;

  public productId: string;
  public auth: Auth = this._identityService.getAuth();

  public isProductAdded: boolean;

  public inventories: any;
  public newProductInventory: ProductInventory;
  public productVariants: ProductVariant[] = [];

  constructor(
    private _identityService: IdentityService,
    private _ProductInventoryService: ProductInventoryService,
    private _router: ActivatedRoute,
    private _productService: ProductService,
  ) {
    this.inventories = [];
    this.productId = this._router.snapshot.paramMap.get('id') || '';
    this.newProductInventory = {
      product: '',
      addedBy: '',
      qty: 0,
      provider: '',
    };
    this.isProductAdded = false;
  }

  ngOnInit(): void {
    this.getInventories();
    this.getProductVariant();
  }

  public async getProductVariant(): Promise<void> {
    const response = await lastValueFrom(
      this._productService.getById(this.productId, this.auth.jwt),
    );

    if (!response.success) {
      alert('Error fetching product data:' + response.message);
      return;
    }

    this.productVariants = response.product.variants;
  }

  getInventories(): void {
    this._ProductInventoryService
      .inventories(this.productId, this.auth.jwt)
      .subscribe((response) => {
        if (!response.success) {
          alert(response.message);
          return;
        }

        console.log(response);
        this.inventories = response.inventories;
        this.registerSuccessStatus();
      });
  }

  public getProductColorVariants(): any {
    const colors = this.productVariants.find((val) => val.name === 'Color');
    if (!colors) {
      return [];
    }

    return colors.values;
  }

  public getProductSizeVariants(): any {
    const sizes = this.productVariants.find((val) => val.name === 'Size');
    if (!sizes) {
      return [];
    }

    return sizes.values;
  }

  addNewInventoryRegister(form: any): void {
    this.newProductInventory.product = this.productId;
    this.newProductInventory.addedBy = this.auth.admin._id || 'undefined';

    this._ProductInventoryService
      .add(this.newProductInventory, this.auth.jwt)
      .subscribe((response) => {
        if (!response.success) {
          alert(response.message);
          return;
        }

        console.log(response);
        form.reset();
        this.getInventories();
        this.isProductAdded = true;
        console.log(response);
      });
  }

  removeInventoryRegister(inventoryRegisterID: any): void {
    this._ProductInventoryService
      .remove(inventoryRegisterID, this.auth.jwt)
      .subscribe((response) => {
        this.getInventories();
        console.log(response);
      });
  }

  registerSuccessStatus(): void {
    var self = this;
    setTimeout(function () {
      self.isProductAdded = false;
    }, 2000);
  }
}

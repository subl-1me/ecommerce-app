import { Component, OnInit, Input } from '@angular/core';

// Services
import { ProductService } from 'src/app/services/product.service';
import { CustomersService } from 'src/app/services/customers.service';
import { IdentityService } from 'src/app/services/identity.service';

// Icons
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faCartFlatbed } from '@fortawesome/free-solid-svg-icons/faCartFlatbed';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-options-button',
  templateUrl: './options-button.component.html',
  styleUrls: ['./options-button.component.css'],
  providers: [ ProductService, CustomersService, IdentityService ]
})
export class OptionsButtonComponent implements OnInit {

  // Icons
  faPen = faPen;
  faCartFlatbed = faCartFlatbed;
  faTrash = faTrash;
  faGear = faGear;
  faPlusCircle = faPlusCircle;


  @Input() id: any;
  @Input() path: any;
  @Input() context: string;

  public token: any;

  constructor(
    private _customersService: CustomersService,
    private _productService: ProductService,
    private _identityService: IdentityService
  ) { 
    this.context = '';
    this.token = this._identityService.getToken();
  }

  ngOnInit(): void {
  }

  remove():void{
    switch(this.context){
      case 'products':
        this.removeProduct();
        break;
      case 'customers':
        this.removeCustomer();
        break;
      default:
        console.log('Something went wrong.');
        break;
    }
  }

  removeProduct():void{
    this._productService.remove(this.token, this.id).subscribe((res) => {
      this.context = '';
      location.reload();
      console.log(res);
    })
  }

  removeCustomer():void{
    this._customersService.remove(this.token, this.id).subscribe((res) => {
      this.context = '';
      location.reload();
    })
  }

}

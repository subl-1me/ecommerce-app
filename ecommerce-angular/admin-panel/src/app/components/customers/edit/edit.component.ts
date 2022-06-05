import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Models
import { Customer } from '../../../models/customer';

// Icons
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';

// Services
import { CustomersService } from 'src/app/services/customers.service';
import { IdentityService } from 'src/app/services/identity.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ CustomersService, IdentityService ]
})
export class EditComponent implements OnInit {

  // Icons
  faAngleLeft = faAngleLeft;
  faPlus = faPlus;
  faSave = faSave;

  public customer: Customer;
  public token: any;
  public customerId: any;
  public responseStatus: string;

  constructor(
    private _customerService: CustomersService,
    private _identityService: IdentityService,
    private _router: ActivatedRoute
  ) { 
    this.customer = {};
    this.token = this._identityService.getToken();
    this.responseStatus = '';
  }

  ngOnInit(): void {
    this.customerId = this._router.snapshot.paramMap.get('id');

    this.getCustomer();
  }

  getCustomer():void{
    this._customerService.listById(this.token, this.customerId).subscribe((response) => {
      console.log(response);
      this.customer = response.customer;
    })
  }

  edit(form:any):void{
    this._customerService.edit(this.customer, this.token, this.customerId).subscribe((response) => {
      if(response.status == 'success'){
        this.getCustomer();
        this.responseStatus = response.status;
      }else{
        this.responseStatus = response.status;
      }
    })
  }

}

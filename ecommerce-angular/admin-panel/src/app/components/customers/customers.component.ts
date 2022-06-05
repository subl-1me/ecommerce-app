import { Component, OnInit } from '@angular/core';

// Models
import { Customer } from '../../models/customer';

// icons
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// Services
import { CustomersService } from 'src/app/services/customers.service';
import { IdentityService } from 'src/app/services/identity.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  providers: [ CustomersService, IdentityService ]
})
export class CustomersComponent implements OnInit {

  // icons
  faPlus = faPlus;

  public customers = Array<Customer>();
  public filter: string;
  public searchMessage: string;
  public token: any;

  public edit = '/panel/customers/edit/';

  constructor(
    private _customersService: CustomersService,
    private _identityService: IdentityService,
  ) { 
    this.customers = [];
    this.filter = '';
    this.searchMessage = '';
    this.token = this._identityService.getToken();
  }

  ngOnInit():void {
    this.list();
  }

  list():void{
    this._customersService.list(this.token).subscribe((res) => {
      if(res.status == 'success'){
        this.searchMessage = res.status;
        this.customers = res.customers;
        console.log(res);
      }
    })
  }

  filterBy(type:string){
    this._customersService.filterBy(type, this.filter, this.token).subscribe((res) => {
      if(res.status == 'error') this.searchMessage = res.status;
      this.customers = res.customers;
    })
  }

}

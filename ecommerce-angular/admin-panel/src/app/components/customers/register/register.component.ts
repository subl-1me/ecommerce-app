import { Component, OnInit } from '@angular/core';

// Services
import { IdentityService } from 'src/app/services/identity.service';
import { CustomersService } from 'src/app/services/customers.service';

// icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

// Models
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [IdentityService, CustomersService],
})
export class RegisterComponent implements OnInit {
  // Icons
  faAdd = faAdd;
  faAngleLeft = faAngleLeft;

  public newCustomer = {} as Customer;
  public token: any;
  public responseMessage: string;
  public formSubmitted: boolean;

  today: Date = new Date();

  constructor(
    private _identityService: IdentityService,
    private _customerService: CustomersService,
  ) {
    this.formSubmitted = false;
    this.newCustomer.password = 'none';
    this.token = this._identityService.getToken();
    this.responseMessage = '';
  }

  ngOnInit(): void {
    console.log(this.newCustomer);
  }

  register(form: any) {
    this._customerService
      .create(this.newCustomer, this.token)
      .subscribe((res) => {
        if (res.message == 'success') {
          this.resetForm(form);
        } else {
          console.log(res);
          this.responseMessage = 'error';
        }
      });
  }

  resetForm(form: any) {
    this.newCustomer = {
      names: '',
      surnames: '',
      email: '',
      dni: 0,
      gender: '',
    };
    form.reset();
    form.controls['gender'].setValue('Choose...');
  }
}

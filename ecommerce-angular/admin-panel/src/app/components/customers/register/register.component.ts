import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    private _router: Router,
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
    console.log(this.newCustomer);
    this._customerService
      .create(this.newCustomer, this.token)
      .subscribe((res) => {
        if (res.message == 'success') {
          this._router.navigate(['/panel/customers/list']);
        } else {
          console.log(res);
          this.responseMessage = 'error';
        }
      });
  }

  resetForm(form: any) {
    if (confirm('Are you sure you want to clear all fields?')) {
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
}

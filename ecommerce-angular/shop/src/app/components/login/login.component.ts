import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerService } from 'src/app/services/customer.service';
import { ConfigsService } from 'src/app/services/configs.service';

import { Customer } from 'src/app/models/customer';
import { Config } from 'src/app/models/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [CustomerService],
})
export class LoginComponent implements OnInit {
  public customer: Customer;
  public token: any;
  public config: Config;

  constructor(
    private _customerService: CustomerService,
    private _router: Router,
    private _configService: ConfigsService,
  ) {
    this.config = {
      categories: [],
      _id: '',
      logo: {
        path: '',
        public_id: '',
      },
      shopName: '',
    };
    this.customer = {
      email: '',
      password: '',
    };
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.isLogged();
    this.loadConfig();
  }

  private loadConfig(): void {
    this._configService.getShopConfigs().subscribe((response) => {
      this.config = response.actualConfig[0];
    });
  }

  public onSubmit(form: any): void {
    if (form.invalid) {
      console.log('Llena bien los datos, culero.');
      return;
    }

    this._customerService.login(this.customer).subscribe((response) => {
      if (!response.customer) {
        console.log(response.message);
        return;
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('_id', response.customer._id);
      location.reload();
    });
  }

  isLogged(): void {
    if (this.token && this.customer.names != '') this._router.navigate(['']);
  }
}

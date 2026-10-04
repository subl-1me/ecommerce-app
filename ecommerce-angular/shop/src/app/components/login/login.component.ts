import { Component, OnInit } from '@angular/core';

import { CustomerService } from 'src/app/services/customer.service';
import { ConfigsService } from 'src/app/services/configs.service';
import { Router } from '@angular/router';

import { Customer } from 'src/app/models/customer';
import { Config } from 'src/app/models/config';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [CustomerService, Router],
})
export class LoginComponent implements OnInit {
  public customer: Customer;
  public config: Config;

  constructor(
    private _customerService: CustomerService,
    private _configService: ConfigsService,
    private _router: Router,
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
      username: '',
      names: '',
      surnames: '',
      email: '',
      password: '',
      cart: {
        _id: '',
        items: [],
      },
      wishlist: [],
    };
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    await lastValueFrom(this._configService.getShopConfigs());
  }

  public async onSubmit(form: any): Promise<void> {
    if (form.invalid) {
      return;
    }

    const response = await lastValueFrom(
      this._customerService.login(this.customer),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    if (!response.auth) {
      alert('Unknown authentication error: ' + response.message);
      return;
    }

    const user = {
      _id: response.customer._id,
      names: response.customer.names,
      surnames: response.customer.surnames,
      email: response.customer.email,
      cart: response.customer.cart,
      wishlist: response.customer.wishlist,
      createdAt: response.customer.createdAt,
      updatedAt: response.customer.updatedAt,
    };

    const auth = {
      user,
      jwt: response.jwt,
    };
    localStorage.setItem('auth', JSON.stringify(auth));
    this._router.navigate(['']); // go to home
  }
}

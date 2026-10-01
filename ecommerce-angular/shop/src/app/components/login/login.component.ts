import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerService } from 'src/app/services/customer.service';
import { ConfigsService } from 'src/app/services/configs.service';

import { Customer } from 'src/app/models/customer';
import { Config } from 'src/app/models/config';
import { lastValueFrom } from 'rxjs';

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

    const user = {
      sub: response.customer.sub,
      names: response.customer.names,
      surnames: response.customer.surnames,
      email: response.customer.email,
      createdAt: response.customer.createdAt,
      updatedAt: response.customer.updatedAt,
    };

    const auth = {
      user,
      jwt: response.jwt,
    };
    localStorage.setItem('auth', JSON.stringify(auth));
    location.reload();
  }

  isLogged(): void {
    if (this.token && this.customer.names != '') this._router.navigate(['']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { Customer } from 'src/app/models/customer';

// Services
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [CustomerService],
})
export class RegisterComponent implements OnInit {
  public customer: Customer;
  public confirmPasswordTemp: string;
  public onSubmitMessage: string;

  constructor(
    private _customerService: CustomerService,
    private _router: Router,
  ) {
    this.customer = {
      username: '',
      names: '',
      surnames: '',
      email: '',
      password: '',
      wishlist: [],
    };
    this.confirmPasswordTemp = '';
    this.onSubmitMessage = '';
  }

  ngOnInit(): void {}

  public async onSubmit(_form: any): Promise<void> {
    const response = await lastValueFrom(
      this._customerService.register(this.customer),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    this._router.navigate(['/login']);
  }
  public isPasswordOk(): boolean {
    if (this.confirmPasswordTemp === this.customer.password) {
      this.onSubmitMessage = 'success';
      return true;
    }

    this.onSubmitMessage = 'error';
    return false;
  }
}

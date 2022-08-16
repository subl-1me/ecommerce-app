import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerService } from 'src/app/services/customer.service';

import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ CustomerService ]
})
export class LoginComponent implements OnInit {

  public customer: Customer;
  public token: any;

  constructor(
    private _customerService: CustomerService,
    private _router: Router
  ) {
    this.customer = {
      email: '',
      password: ''
    }
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
    this.isLogged();
  }

  public onSubmit(form:any):void{
    if(form.invalid){
      console.log('Llena bien los datos, culero.');
      return;
    }

    this._customerService.login(this.customer).subscribe((response) => {
      if(!response.customer){
        console.log(response.message);
        return;
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('_id', response.customer._id);
      location.reload();
    });
    
  }

  isLogged():void{
    if(this.token && this.customer.names != '') this._router.navigate(['']);
  }



}

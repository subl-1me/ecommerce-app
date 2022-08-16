
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Customer } from 'src/app/models/customer';

// Services
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ CustomerService ]
})
export class RegisterComponent implements OnInit {

  public customer: Customer;
  public token: any;

  public confirmPasswordTemp: string;

  public onSubmitMessage: string;

  constructor(
    private _customerService: CustomerService,
    private _router: Router
  ) { 
    this.customer = {
      names: '',
      surnames: '',
      email: '',
      password: '',
    }
    this.confirmPasswordTemp = '';
    this.onSubmitMessage = '';
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.isLogged();
  }

  public onSubmit(form:any):void{
    if(form.invalid){
      console.log('Fuck you.');
      return;
    }

    if(!this.isPasswordOk()) return;

    this.onSubmitMessage = '';

    this._customerService.register(this.customer).subscribe((response) => {
      if(response.status === 'error') return;

      this._router.navigate(['/login']);
    })

  }

  public isPasswordOk():boolean{
    if(this.confirmPasswordTemp === this.customer.password){
      this.onSubmitMessage = 'success';
      return true;
    }

    this.onSubmitMessage = 'error';
    return false;
  }

  public isLogged():void{
    if(this.token) this._router.navigate(['']);
  }

}

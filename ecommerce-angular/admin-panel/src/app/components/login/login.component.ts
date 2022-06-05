import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from 'src/app/services/admin.service';
import { IdentityService } from 'src/app/services/identity.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ AdminService, IdentityService]
})
export class LoginComponent implements OnInit {
  
  public user: any = {}
  public responseMessage: string;

  constructor(
    private _adminService: AdminService,
    private _router: Router,
    private _identityService: IdentityService
  ) { 
    this.responseMessage = '';
  }

  ngOnInit(): void {
    this.checkIdentity();
  }

  login(form:any){
    if(form.valid){
      this._adminService.login(this.user).subscribe((response) => {
        this.responseMessage = response.message;

        // check token
        if(response.token){
          localStorage.setItem('token', response.token);
          localStorage.setItem('_id', response.user._id);

          // go home page
          this._router.navigate(['/']);
        }
      })
    }
  }

  checkIdentity(){
    if(this._identityService.getToken() != null){
      this._router.navigate(['/']);
    }
  }

}

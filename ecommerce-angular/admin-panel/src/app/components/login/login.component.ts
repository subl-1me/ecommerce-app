import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { AdminService } from 'src/app/services/admin.service';
import { IdentityService } from 'src/app/services/identity.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AdminService, IdentityService],
})
export class LoginComponent implements OnInit {
  public user: any = {};
  public responseMessage: string;

  constructor(
    private _adminService: AdminService,
    private _router: Router,
    private _identityService: IdentityService,
  ) {
    this.responseMessage = '';
  }

  ngOnInit(): void {
    this.checkIdentity();
  }

  public async login(_form: any): Promise<void> {
    const response = await lastValueFrom(this._adminService.login(this.user));

    if (!response.success) {
      alert(response.message);
      return;
    }

    const auth = {
      jwt: response.jwt,
      admin: response.admin,
    };

    localStorage.setItem('auth', JSON.stringify(auth));
    // go home page
    this._router.navigate(['/']);
    //TOOD: send socket msg
  }

  checkIdentity() {
    if ('' != null) {
      this._router.navigate(['/']);
    }
  }
}

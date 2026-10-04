import { Component, OnInit } from '@angular/core';

import { Customer } from '../../models/customer';
import { Auth } from 'src/app/models/auth';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from 'src/app/services/auth.service';

// Icons
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [CustomerService],
})
export class ProfileComponent implements OnInit {
  // Icon
  faSave = faSave;
  faUser = faUser;
  faFileLines = faFileLines;
  faHeart = faHeart;
  faEye = faEye;
  faStar = faStar;
  faGear = faGear;
  faXmark = faXmark;
  faCheck = faCheck;

  public customer: Customer;
  public auth: Auth;

  public editMessage: string;

  constructor(
    private _customerService: CustomerService,
    private _authService: AuthService,
  ) {
    this.customer = {
      username: '',
      names: '',
      surnames: '',
      email: '',
      password: '',
      wishlist: [],
    };
    this.auth = {
      user: null,
      jwt: '',
    };
    this.editMessage = '';
  }

  ngOnInit(): void {
    this.getAuth();
    this.getCustomerInfo();
  }

  private getAuth(): void {
    this.auth = this._authService.getUser();
  }

  onSubmit() {
    this._customerService
      .editProfile(this.auth.user._id, this.customer)
      .subscribe((response) => {
        if (response.status === 'error') {
          this.editMessage = 'Error Trying to Update User. Try Again Later.';

          setTimeout(() => {
            this.editMessage = '';
          }, 3000);
          return;
        }

        this.editMessage = 'Saved!';
        this.getCustomerInfo();
        setTimeout(() => {
          this.editMessage = '';
        }, 1000);
      });
  }

  getCustomerInfo(): void {
    this._customerService
      .getCustomerById(this.auth.user._id)
      .subscribe((response) => {
        if (!response.success) {
          alert('Please, log in...');
          return;
        }

        this.customer = response.customer;
      });
  }
}

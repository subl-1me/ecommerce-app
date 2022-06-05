import { Component, OnInit } from '@angular/core';

import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faMap } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { Customer } from '../../models/customer';

import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-profile-list-group',
  templateUrl: './profile-list-group.component.html',
  styleUrls: ['./profile-list-group.component.css'],
  providers: [ CustomerService ]
})
export class ProfileListGroupComponent implements OnInit {

  public customer: Customer;
  public _idStorage: any;

  // Icons
  faUser = faUser;
  faMap = faMap;
  faHeart = faHeart;
  faEye = faEye;
  faStar = faStar;
  faGear = faGear;
  faXmark = faXmark;

  constructor(
    private _customerService: CustomerService
  ) {
    this.customer = {};
    this._idStorage = localStorage.getItem('_id');
   }

  ngOnInit(): void {
    this.getCustomerInfo();
  }

  getCustomerInfo():void{
    this._customerService.getCustomerById(this._idStorage).subscribe((response) => {
      if(response.status === 'error') {
        console.log('Error Trying to Find Customer.');
        return;
      }

      this.customer = response.customer;
    })
  }

}

import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';

// Models
import { Customer } from '../../models/customer';

// icons
import {
  faPlus,
  faRotateRight,
  faEye,
  faPenToSquare,
  faTrashAlt,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

// Services
import { CustomersService } from 'src/app/services/customers.service';
import { IdentityService } from 'src/app/services/identity.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  providers: [CustomersService, IdentityService],
})
export class CustomersComponent implements OnInit {
  // icons
  faPlus = faPlus;
  faEye = faEye;
  faRotateRight = faRotateRight;
  faPenToSquare = faPenToSquare;
  faTrashAlt = faTrashAlt;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  public customers = Array<Customer>();
  public selectedCustomer: Customer;
  public filter: string;
  public searchMessage: string;
  public token: any;

  public edit = '/panel/customers/edit/';

  constructor(
    private _customersService: CustomersService,
    private _identityService: IdentityService,
  ) {
    this.selectedCustomer = {
      names: '',
      surnames: '',
      sub: 0,
      email: '',
    };
    this.customers = [];
    this.filter = '';
    this.searchMessage = '';
    this.token = this._identityService.getToken();
  }

  ngOnInit(): void {
    this.list();
  }

  public list(): void {
    this._customersService.list(this.token).subscribe((res) => {
      if (res.status == 'success') {
        this.searchMessage = res.status;
        this.customers = res.customers;
        console.log(res);
      }
    });
  }

  public filterBy(type: string) {
    this._customersService
      .filterBy(type, this.filter, this.token)
      .subscribe((res) => {
        if (res.status === 'error') this.searchMessage = res.status;
        this.customers = res.customers;
      });
  }
  public openDetailsModal(customer: Customer): void {
    this.selectedCustomer = customer;
    const modalEl = document.getElementById('customerDetailModal');
    if (!modalEl) {
      return;
    }
    setTimeout(() => {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }, 0);
  }

  public showRemoveCustomerModal(customer: Customer): void {
    this.selectedCustomer = customer;
    const modalEl = document.getElementById('deleteCustomerModal');
    if (!modalEl) {
      return;
    }

    setTimeout(() => {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }, 0);
  }

  public resetSelectedCustomer(): void {
    this.selectedCustomer = {
      names: '',
      surnames: '',
      sub: 0,
      email: '',
    };
  }

  public confirmDeleteSelectedCustomer(): void {}
}

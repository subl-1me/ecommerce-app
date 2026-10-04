import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';

// Models
import { Customer } from '../../models/customer';

interface Modal {
  modal: any;
  name: string;
}

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
import { ModalService } from 'src/app/services/modal.service';
import { lastValueFrom } from 'rxjs';

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
  public filterValue: string;
  public searchMessage: string;
  public token: any;

  public edit = '/panel/customers/edit/';

  constructor(
    private _customersService: CustomersService,
    private _identityService: IdentityService,
    private _modalsService: ModalService,
  ) {
    this.selectedCustomer = {
      username: '',
      names: '',
      surnames: '',
      _id: '',
      email: '',
      wishlist: [],
      notes: [],
      cart: {
        items: [],
      },
    };
    this.customers = [];
    this.filterValue = '';
    this.searchMessage = '';
    this.token = this._identityService.getToken();
  }

  ngOnInit(): void {
    this.list();
  }

  public async list(): Promise<void> {
    const response = await lastValueFrom(
      this._customersService.list(this.token),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    this.customers = [...response.list];
  }

  public async updateList(): Promise<void> {
    await this.list();
    //TODO: add wait timer
  }

  public async filterBy(type: string): Promise<void> {}

  public openDetailsModal(customer: Customer): void {
    this.selectedCustomer = customer;
    const modalEl = document.getElementById('customerDetailModal');
    if (!modalEl) {
      return;
    }
    setTimeout(() => {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      this._modalsService.addModal({
        elem: modal,
        name: 'customerDetailModal',
      });
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
      this._modalsService.addModal({
        elem: modal,
        name: 'deleteCustomerModal',
      });
    }, 0);
  }

  public closeDetailsCustomerModal(): void {
    this._modalsService.closeModal('customerDetailModal');
  }

  public closeRemoveCustomerModal(): void {
    this._modalsService.closeModal('deleteCustomerModal');
  }

  public resetSelectedCustomer(): void {
    this.selectedCustomer = {
      username: '',
      names: '',
      surnames: '',
      notes: [],
      _id: '',
      email: '',
      wishlist: [],
      cart: {
        items: [],
      },
    };
  }

  public confirmDeleteSelectedCustomer(): void {
    this._customersService
      .remove(this.token, this.selectedCustomer._id)
      .subscribe((res) => {
        console.log(res);
        this.closeRemoveCustomerModal();
      });
  }
}

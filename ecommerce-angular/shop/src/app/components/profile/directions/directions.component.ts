import { Component, OnInit } from '@angular/core';
import countriesDataEn from '../../../../assets/data/countries_en.json';
import countriesDataEs from '../../../../assets/data/countries_es.json';
import {
  getStatesOfCountry,
  getCitiesOfState,
} from '@anrivera/countries-states-cities-database';

import {
  ShippingInformation,
  ShippinInformationInput,
} from 'src/app/models/ShippingInformation';

import { AddressService } from 'src/app/services/address.service';
import { Auth } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';

// Icons
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import State from 'src/app/interfaces/State';
import City from 'src/app/interfaces/CIty';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.css'],
  providers: [AddressService],
})
export class DirectionsComponent implements OnInit {
  public selectedCountryState: State = {
    id: 0,
    countryId: 0,
    name: '',
    stateCode: '',
    latitude: '',
    longitude: '',
  };
  public selectedCityAux: any;
  public shippingInformation: ShippinInformationInput;
  public shippingList: ShippingInformation[] = [];
  public auth: Auth = {
    jwt: '',
    user: null,
  };

  // Icons
  faMap = faMap;
  faPlus = faPlus;
  faTrash = faTrash;

  constructor(
    private _addressService: AddressService,
    private _authService: AuthService,
  ) {
    this.shippingInformation = {
      email: '',
      default: false,
      customer: '',
      phone: '',
      state: '',
      zip: '',
      addressee: '',
      address: '',
      city: '',
      country: '',
    };
  }

  ngOnInit(): void {
    this.loadUserAuth();
    this.getAddresses();
  }

  public getCountries(): any {
    return countriesDataEn;
  }

  public getStatesByCountry(): State[] {
    const selectedCountry = countriesDataEn.find(
      (country) => country.name === this.shippingInformation.country,
    );
    if (!selectedCountry) {
      return [];
    }

    return getStatesOfCountry(selectedCountry.alpha2.toLocaleUpperCase());
  }

  public resetFields(): void {
    this.shippingInformation.city = '';
    this.shippingInformation.state = '';
  }

  public getCitiesByState(): City[] {
    const states = this.getStatesByCountry();
    const selectedState = states.find(
      (state) => state.name === this.shippingInformation.state,
    );

    if (!selectedState) return [];
    return getCitiesOfState(selectedState.id);
  }

  private loadUserAuth(): void {
    this.auth = this._authService.getUser();
    this.shippingInformation.email = this.auth.user.email || '';
  }

  public async onSubmit(form: any): Promise<void> {
    this.shippingInformation.customer = this.auth.user._id;
    const response = await lastValueFrom(
      this._addressService.addAddress(this.shippingInformation),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.shippingList.push(response.address);
  }

  public async getAddresses(): Promise<void> {
    const response = await lastValueFrom(
      this._addressService.getAddressListByCustomer(this.auth.user._id),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.shippingList = response.addresses;
  }

  public async deleteAddress(addressId: string): Promise<void> {
    const response = await lastValueFrom(
      this._addressService.deleteAddress(addressId),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    this.shippingList = this.shippingList.filter(
      (shipping) => shipping._id !== addressId,
    );
  }

  public async setAddressAsDefault(shippingId: string): Promise<void> {
    const response = await lastValueFrom(
      this._addressService.setAddressAsDefault(shippingId, this.auth.user._id),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    const current = this.shippingList.findIndex((ship) => ship.default);
    const newDefault = this.shippingList.findIndex(
      (ship) => ship._id === shippingId,
    );

    this.shippingList[current].default = false;
    this.shippingList[newDefault].default = true;
  }
}

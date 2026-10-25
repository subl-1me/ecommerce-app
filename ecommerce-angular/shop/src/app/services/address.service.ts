import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './CONST';
import { environment } from 'src/environments/environment';
import { ShippinInformationInput } from '../models/ShippingInformation';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private httpHeaders: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json',
  );
  constructor(private _http: HttpClient) {}

  public addAddress(address: ShippinInformationInput): Observable<any> {
    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'address',
      address,
      {
        headers: this.httpHeaders,
      },
    );
  }

  public getAddressListByCustomer(customerId: string): Observable<any> {
    return this._http.get(
      `${environment.API_URL || GLOBAL.localUrl}address/${customerId}`,
      { headers: this.httpHeaders },
    );
  }

  public deleteAddress(addressId: string): Observable<any> {
    return this._http.delete(
      (environment.API_URL || GLOBAL.localUrl) + 'address/' + addressId,
      {
        headers: this.httpHeaders,
      },
    );
  }

  public setAddressAsDefault(
    addressId: string,
    customerId: string,
  ): Observable<any> {
    return this._http.put(
      `${environment.API_URL || GLOBAL.localUrl}address/${addressId}/${customerId}`,
      { headers: this.httpHeaders },
    );
  }

  public getDefaultAddress(customerID: string): Observable<any> {
    return this._http.get(
      (environment.API_URL || GLOBAL.localUrl) +
        'defaultDirection/' +
        customerID,
      {
        headers: this.httpHeaders,
      },
    );
  }
}

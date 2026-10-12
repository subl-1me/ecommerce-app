import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { constans } from '../services/const';
import { environment } from 'src/environments/environment';

import ProductInventory from '../models/productInventory';

@Injectable({
  providedIn: 'root',
})
export class ProductInventoryService {
  private httpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json',
  );
  constructor(private _http: HttpClient) {}

  public inventories(productId: string, token: string): Observable<any> {
    this.httpHeaders = this.httpHeaders.set('Authorization', token);
    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'inventories/' + productId,
      {
        headers: this.httpHeaders,
      },
    );
  }

  public add(
    newProductInventory: ProductInventory,
    token: string,
  ): Observable<any> {
    this.httpHeaders = this.httpHeaders.set('Authorization', token);
    return this._http.post(
      (environment.API_URL || constans.defaultUrl) + 'inventory',
      newProductInventory,
      {
        headers: this.httpHeaders,
      },
    );
  }

  public remove(token: string, inventoryRegisterID: string): Observable<any> {
    this.httpHeaders = this.httpHeaders.set('Authorization', token);
    return this._http.delete(
      (environment.API_URL || constans.defaultUrl) +
        'inventory/' +
        inventoryRegisterID,
      { headers: this.httpHeaders },
    );
  }
}

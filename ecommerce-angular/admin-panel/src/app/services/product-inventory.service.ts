import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { constans } from '../services/const';
import { environment } from 'src/environments/environment';

import { ProductInventory } from '../models/productInventory';

@Injectable({
  providedIn: 'root',
})
export class ProductInventoryService {
  constructor(private _http: HttpClient) {}

  public inventories(token: string, productId: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'inventories/' + productId,
      {
        headers: headers,
      }
    );
  }

  public add(
    token: string,
    newProductInventory: ProductInventory
  ): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.post(
      (environment.API_URL || constans.defaultUrl) + 'inventory',
      newProductInventory,
      {
        headers: headers,
      }
    );
  }

  public remove(token: string, inventoryRegisterID: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.delete(
      (environment.API_URL || constans.defaultUrl) +
        'inventory/' +
        inventoryRegisterID,
      { headers: headers }
    );
  }
}

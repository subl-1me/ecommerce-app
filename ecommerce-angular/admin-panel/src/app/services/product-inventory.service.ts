import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { constans } from "../services/const";

import { ProductInventory } from "../models/productInventory";

@Injectable({
  providedIn: 'root'
})
export class ProductInventoryService {

  constructor(
    private _http: HttpClient
  ) { }

  public inventories(token:string, productId: string): Observable<any>{
    var headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.get(constans.url+'inventories/'+productId, {headers: headers});
  }

  public add(token:string, newProductInventory: ProductInventory): Observable<any>{
    var headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.post(constans.url+'inventory', newProductInventory, {headers: headers});
  }

  public remove(token:string, inventoryRegisterID:string): Observable<any>{
    var headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.delete(constans.url+'inventory/'+inventoryRegisterID, {headers: headers});
  }
}

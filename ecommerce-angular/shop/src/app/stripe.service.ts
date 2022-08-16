import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { GLOBAL } from './services/CONST';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(
    private _http: HttpClient
  ) { }

  public generateOrder(data: {name: string, customerID: string}): Promise<any>{
    return this._http.post(GLOBAL.url+'/orders', data).toPromise();
  }
}

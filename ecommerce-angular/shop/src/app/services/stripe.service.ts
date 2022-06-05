import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { GLOBAL } from './CONST';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(
    private _http: HttpClient
  ) { }

  public createPaymentIntent(amount:number):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    console.log(amount); 
    return this._http.post(GLOBAL.url+'payment_intent',{headers: headers} );
  }

  public generateOrder(orderData:any): Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(GLOBAL.url+'order', orderData, {headers: headers});
  }

  public sendPayment(orderID: string, token: string):Promise<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');


    return this._http.patch(GLOBAL.url+'order/'+orderID, {token:token}, {headers: headers}).toPromise();
  }

  public getOrder():Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url+'order');
  }
}

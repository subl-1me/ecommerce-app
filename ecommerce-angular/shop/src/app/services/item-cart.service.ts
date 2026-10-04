import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GLOBAL } from './CONST';

@Injectable({
  providedIn: 'root',
})
export class ItemCartService {
  private headers: HttpHeaders;
  private params: HttpParams;
  constructor(private _http: HttpClient) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.params = new HttpParams();
  }

  public getItemDetails(itemId: string): Observable<any> {
    this.params.set('itemId', itemId);
    return this._http.post(
      (environment.API_URL || GLOBAL.localUrl) + 'cart-item',
      {
        headers: this.headers,
        parms: this.params,
      },
    );
  }
}

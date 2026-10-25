import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GLOBAL } from './CONST';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private httpHeaders: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json',
  );
  constructor(private _http: HttpClient) {}

  public getCuponByCode(code: string): Observable<any> {
    return this._http.get(
      `${environment.API_URL || GLOBAL.localUrl}coupon/${code}`,
      { headers: this.httpHeaders },
    );
  }
}

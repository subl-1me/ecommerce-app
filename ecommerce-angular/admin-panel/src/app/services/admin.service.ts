import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { constans } from './const';
import Admin from '../models/admin';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  public httpHeaders: HttpHeaders;
  constructor(private _http: HttpClient) {
    this.httpHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json',
    );
  }

  private setTokenHeader(token: string): void {
    this.httpHeaders = this.httpHeaders.set('Authorization', token);
  }

  login(admin: Admin): Observable<any> {
    const endpoint = `${environment.API_URL || constans.defaultUrl}${constans.endpointsAux.admLogin.login}`;
    return this._http.post(endpoint, admin, {
      headers: this.httpHeaders,
    });
  }
}

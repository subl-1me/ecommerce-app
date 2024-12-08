import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { constans } from './const';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private _http: HttpClient) {}

  login(user: any): Observable<any> {
    // send user data
    return this._http.post(
      (environment.API_URL || constans.defaultUrl) + 'login_admin',
      user,
      {
        headers: constans.headers,
      }
    );
  }
}

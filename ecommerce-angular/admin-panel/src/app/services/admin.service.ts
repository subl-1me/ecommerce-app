import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { constans } from './const';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private _http: HttpClient
  ) { }

  login(user:any): Observable<any>{
    
    // send user data
    return this._http.post(constans.url+'login_admin', user, {headers: constans.headers})
  }
}

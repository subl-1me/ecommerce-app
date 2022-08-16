import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './CONST';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  constructor(
    private _http: HttpClient
  ) { }

  public getShopConfigs(): Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(GLOBAL.url+'config', {headers: headers});
  }
}

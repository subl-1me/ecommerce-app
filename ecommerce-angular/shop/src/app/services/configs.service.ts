import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './CONST';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigsService {
  constructor(private _http: HttpClient) {}

  public getShopConfigs(): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get((environment.API_URL || GLOBAL.localUrl) + 'config', {
      headers: headers,
    });
  }
}

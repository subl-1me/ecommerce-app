import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { shareReplay } from 'rxjs';

import { GLOBAL } from './CONST';
import { environment } from 'src/environments/environment';
import { Config } from '../models/config';

@Injectable({
  providedIn: 'root',
})
export class ConfigsService {
  private configCache$?: Observable<any>;

  constructor(private _http: HttpClient) {}

  public getShopConfigs(): Observable<any> {
    if (!this.configCache$) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.configCache$ = this._http
        .get((environment.API_URL || GLOBAL.localUrl) + 'config', { headers })
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.configCache$;
  }

  public refreshShopConfigs(): void {
    this.configCache$ = undefined;
  }
}

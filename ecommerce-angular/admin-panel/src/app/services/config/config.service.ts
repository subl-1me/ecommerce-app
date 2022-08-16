import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { constans } from '../const';
import { Config } from 'src/app/models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private _http: HttpClient
  ) { }

  getConfig(token:string):Observable<any>{
    var headersAuth = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.get(constans.url+'config', {headers: headersAuth});
  }

  addCategory(token:string, category:any, configID:string):Observable<any>{
    var headersAuth = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.post(constans.url+'config/category/'+configID, category, {headers: headersAuth} );
  }

  deleteCategory(token:string, configID:string, categoryName:string):Observable<any>{
    var headersAuth = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.delete(constans.url+'config/category/'+configID+'/'+categoryName, {headers: headersAuth});
  }

  uploadLogo(token:string, configID:string, logo:any):Observable<any>{
    var headersAuth = new HttpHeaders({'Authorization': token});

    return this._http.put(constans.url+'config/logo/'+configID, logo, {headers: headersAuth});
  }

  update(token: string, configID:string, newConfig:Config):Observable<any>{
    var headersAuth = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.put(constans.url+'configs/'+configID, newConfig, {headers: headersAuth});
  }
}

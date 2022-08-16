import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { constans } from './const';

// Models
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {


  constructor(
    private _http: HttpClient
  ) {}

  list(token:any):Observable<any>{     // get customers list
    var headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.get(constans.url+'customers', {headers: headers});
  }

  listById(token:any, id:any):Observable<any>{
    var headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.get(constans.url+'listById/'+id,{headers: headers});
  } 

  filterBy(type:string, content:string, token:any):Observable<any>{
    let params = 'filterBy='+type+'&'+'content='+content;
    var headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.get(constans.url+'list/?'+ params,{headers: headers});
  }

  create(customer: Customer, token:any):Observable<any>{
    var headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.post(constans.url+'create', customer, {headers: headers});
  }

  edit(customer: Customer, token:any, _id:string):Observable<any>{
    var headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.put(constans.url+'edit/'+_id, customer, {headers: headers});
  }

  remove(token: any, _id:string):Observable<any>{
    var headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});

    return this._http.delete(constans.url+'remove/'+_id, {headers: headers});
  }
}

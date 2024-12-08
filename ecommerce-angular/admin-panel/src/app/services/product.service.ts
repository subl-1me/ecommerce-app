import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { constans } from './const';
import { environment } from 'src/environments/environment';

// Models
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _http: HttpClient) {}

  create(token: string, product: Product): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.post(
      (environment.API_URL || constans.defaultUrl) + 'product',
      product,
      {
        headers: headers,
      }
    );
  }

  edit(token: string, product: Product, id: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.put(
      (environment.API_URL || constans.defaultUrl) + 'product/' + id,
      product,
      {
        headers: headers,
      }
    );
  }

  list(token: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'products',
      { headers: headers }
    );
  }

  listByFilter(title: string, token: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'products/' + title,
      {
        headers: headers,
      }
    );
  }

  remove(token: string, id: string) {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.delete(
      (environment.API_URL || constans.defaultUrl) + 'removeProduct/' + id,
      {
        headers: headers,
      }
    );
  }

  getById(id: string, token: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.get(
      (environment.API_URL || constans.defaultUrl) + 'product/' + id,
      { headers: headers }
    );
  }

  uploadCoverImage(token: string, coverImage: any): Observable<any> {
    var headers = new HttpHeaders({ Authorization: token });

    return this._http.post(
      (environment.API_URL || constans.defaultUrl) + 'product/coverImage',
      coverImage,
      {
        headers: headers,
      }
    );
  }

  uploadGalleryImage(
    token: string,
    galleryImage: any,
    productID: string
  ): Observable<any> {
    var headers = new HttpHeaders({ Authorization: token });

    return this._http.post(
      (environment.API_URL || constans.defaultUrl) +
        'product/gallery/' +
        productID,
      galleryImage,
      { headers: headers }
    );
  }

  setGalleryImages(
    token: string,
    pathArray: any[],
    productID: string
  ): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token,
    });

    return this._http.put(
      (environment.API_URL || constans.defaultUrl) +
        'product/gallery/' +
        productID,
      pathArray,
      { headers: headers }
    );
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from './CONST';
import { environment } from 'src/environments/environment';

import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private _http: HttpClient) {}

  public postReview(review: Review, productID: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(
      environment.API_URL || GLOBAL.localUrl + 'review/' + productID,
      review,
      {
        headers: headers,
      }
    );
  }

  public getReviews(productID: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.get(
      environment.API_URL || GLOBAL.localUrl + 'reviews/' + productID,
      {
        headers: headers,
      }
    );
  }
}

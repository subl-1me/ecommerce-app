import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { constans } from './const';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryUploadsService {
  constructor(private _http: HttpClient) {}

  public removeImageByPublicID(
    public_id: string,
    token: string,
  ): Observable<any> {
    var headersAuth = new HttpHeaders({ Authorization: token });

    return this._http.post(
      (environment.API_URL || constans.defaultUrl) +
        constans.endpointsAux.removeByPublicId,
      { public_id },
      {
        headers: headersAuth,
      },
    );
  }
}

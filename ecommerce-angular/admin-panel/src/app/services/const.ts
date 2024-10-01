import { HttpHeaders } from '@angular/common/http';

export var constans = {
  url: 'http://localhost:4201/api/',
  productLinkHref: 'http://localhost:4200/',
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

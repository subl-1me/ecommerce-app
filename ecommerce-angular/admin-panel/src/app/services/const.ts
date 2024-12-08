import { HttpHeaders } from '@angular/common/http';

export var constans = {
  url: process.env || 'http://localhost:4201/api/',
  productLinkHref: process.env || 'http://localhost:4200/',
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

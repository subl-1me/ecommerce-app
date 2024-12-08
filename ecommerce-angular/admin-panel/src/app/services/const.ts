import { HttpHeaders } from '@angular/common/http';

export var constans = {
  url: process.env['API_URL'] || 'http://localhost:4201/api/',
  productLinkHref: process.env['productLinkHRef'] || 'http://localhost:4200/',
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

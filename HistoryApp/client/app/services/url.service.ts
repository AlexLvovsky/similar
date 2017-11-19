import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class UrlService {

  constructor (private http: Http) {}

  getUrls() {
    return this.http.get('/api/urls').map(res => res.json());
  }
}

import { Injectable } from '@angular/core';
import { IDash } from '../interfaces/idash';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashService {
  private Dash: Observable<IDash>;

  constructor(private http: HttpClient) { }
  private GetData: string = '/api/Dashboard/';
  getData(): Observable<IDash> {
    if (!this.Dash) {
      this.Dash = this.http
        .get<IDash>(this.GetData)
        .pipe(shareReplay());
    }

    // if Customer cache exists return it
    return this.Dash;
  }

}

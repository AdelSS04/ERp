import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IContactUs } from '../interfaces/icontact-us';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private http: HttpClient) { }
  private AddMessageUrl: string = '/api/ContactUs/AddContactUs';
  private ContactM$: Observable<IContactUs[]>;
  insertMessage(newMessage: IContactUs): Observable<IContactUs> {
    return this.http.post<IContactUs>(this.AddMessageUrl, newMessage);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, flatMap, shareReplay } from 'rxjs/operators';
import { ICustomer } from '../interfaces/icustomer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}
  private CustomerBaseUrl: string = '/api/Customer/';

  private AddCustomerUrl: string = '/api/Customer/AddCustomer';

  private deleteUrl: string = '/api/Customer/DeleteCustomer/';

  private updateUrl: string = '/api/Customer/UpdateCustomer/';
  private Customer$: Observable<ICustomer[]>;

  getCustomer(): Observable<ICustomer[]> {
    if (!this.Customer$) {
      this.Customer$ = this.http
        .get<ICustomer[]>(this.CustomerBaseUrl)
        .pipe(shareReplay());
    }

    // if Customer cache exists return it
    return this.Customer$;
  }

  insertCustomer(newCustomer: ICustomer): Observable<ICustomer> {
    return this.http.post<ICustomer>(this.AddCustomerUrl, newCustomer);
  }
  getCustomerById(id: number): Observable<ICustomer> {
    return this.getCustomer().pipe(
      flatMap((result) => result),
      first((Customer) => Customer.customerId == id)
    );
  }
  // Update the Customer

  updateCustomer(editCustomer: ICustomer): Observable<ICustomer> {
    return this.http.put<ICustomer>(this.updateUrl, editCustomer);
  }

  // Delete Customer

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(this.deleteUrl + id);
  }
  // Clear Cache
  clearCache() {
    this.Customer$ = null;
  }
}

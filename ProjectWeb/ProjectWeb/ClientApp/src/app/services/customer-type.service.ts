import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ICustomerType } from '../interfaces/icustomer-type';

@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {
 
  constructor(private http:HttpClient) { }
  private CustomerTypeBaseUrl: string = "/api/CustomerType/";


  private AddCustomerTypeUrl : string = "/api/CustomerType/AddCustomerType";

  private deleteUrl: string = "/api/CustomerType/DeleteCustomerType/";

  private updateUrl: string = "/api/CustomerType/UpdateCustomerType/";
  private CustomerType$: Observable<ICustomerType[]>;

  getCustomerType() : Observable<ICustomerType[]> 
  {
      if (!this.CustomerType$) 
      {
          this.CustomerType$ = this.http.get<ICustomerType[]>(this.CustomerTypeBaseUrl).pipe(shareReplay());
      }

       // if CustomerTypes cache exists return it
      return this.CustomerType$;

  }

  insertCustomerType(newCustomerType : ICustomerType) :  Observable<ICustomerType> 
  {
      return this.http.post<ICustomerType>(this.AddCustomerTypeUrl, newCustomerType);
  }
  
// Update the CustomerType

updateCustomerType(editCustomerType : ICustomerType) : Observable<ICustomerType>
{
    return this.http.put<ICustomerType>(this.updateUrl, editCustomerType);
}

    // Delete CustomerType

deleteCustomerType(id: number) : Observable<any>
{
     return this.http.delete(this.deleteUrl + id);
}
// Clear Cache
clearCache() 
{
    this.CustomerType$ = null;
}    
}

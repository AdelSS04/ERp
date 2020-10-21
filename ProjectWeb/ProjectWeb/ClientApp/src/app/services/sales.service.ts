import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sales } from '../interfaces/sales';
import { flatMap, first, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }
  private Sales: string = "/api/Sales/";
  private AddUrl : string = "/api/Sales/AddSales";
  private updateUrl: string = "/api/Sales/UpdateSalesId/";
  private deleteUrl: string = "/api/Sales/DeleteSales/";
  private Sales$: Observable<Sales[]>;
  getSales() : Observable<Sales[]> 
  {
      if (!this.Sales$) 
      {
          this.Sales$ = this.http.get<Sales[]>(this.Sales).pipe(shareReplay());
      }

       // if products cache exists return it
      return this.Sales$;

  }
  deleteSales(id: number) : Observable<any>
  {
       return this.http.delete(this.deleteUrl + id);
  }
  insertSales(insertsales : Sales): Observable<Sales>{
    return this.http.post<Sales>(this.AddUrl,insertsales);
  }
  updateSales(editSales: Sales): Observable<Sales> {
    return this.http.put<Sales>(this.updateUrl, editSales);
  }
  getSalesById(id: number) : Observable<Sales> {
    return this.getSales().pipe(flatMap(result => result), first(Sales => Sales.salesId == id));

  }

  
  clearCache() 
  {
      this.Sales$ = null;
  }    
}
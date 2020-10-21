import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesOrderLine } from '../interfaces/sales-order-line';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { Sales } from '../interfaces/sales';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderLineService {

  constructor(private http: HttpClient) { }
  private Sales: string = "/api/SalesOrderLine";
  private AddSales: string = "/api/SalesOrderLine/AddSales";
  private deleteUrl: string = "/api/SalesOrderLine/DeleteSalesLine/";

  private SalesOrderLine$: Observable<SalesOrderLine[]>;
   
  insertSales(insertsales : Sales): Observable<Sales>{
    return this.http.post<Sales>(this.AddSales,insertsales);
  }
  deleteSalesLine(id: number): Observable<any> {
    return this.http.delete(this.deleteUrl + id);
  }
  getSalesOrderLine(id: number) : Observable<SalesOrderLine[]> 
  {
      if (!this.SalesOrderLine$) 
      {
          this.SalesOrderLine$ = this.http.get<SalesOrderLine[]>(this.Sales +"/"+ id).pipe(shareReplay());
      }

       // if products cache exists return it
      return this.SalesOrderLine$;

  }


  clearCache() 
  {
      this.SalesOrderLine$ = null;
  }    


}  

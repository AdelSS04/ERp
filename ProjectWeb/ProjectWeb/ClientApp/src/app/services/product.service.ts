import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iproduct } from '../interfaces/Iproduct';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { ICustomerType } from '../interfaces/icustomer-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = '/api/Product/';
  private baseUrlCustomer: string = '/api/CustomerType/';

  private productUrl: string = '/api/Product/AddProduct';

  private deleteUrl: string = '/api/Product/DeleteProduct/';

  private updateUrl: string = '/api/Product/UpdateProduct/';

  private product$: Observable<Iproduct[]>;
  private CustomerType$: Observable<ICustomerType[]>;

  getProducts(): Observable<Iproduct[]> {
    if (!this.product$) {
      this.product$ = this.http
        .get<Iproduct[]>(this.baseUrl)
        .pipe(shareReplay());
    }

    // if products cache exists return it
    return this.product$;
  }

  // Get Product by its ID

  getProductById(id: number): Observable<Iproduct> {
    return this.getProducts().pipe(
      flatMap((result) => result),
      first((product) => product.productID == id)
    );
  }

  // Insert the Product
  insertProduct(newProduct: Iproduct): Observable<Iproduct> {
    return this.http.post<Iproduct>(this.productUrl, newProduct);
  }

  // Update the Product

  updateProduct(editProduct: Iproduct): Observable<Iproduct> {
    return this.http.put<Iproduct>(this.updateUrl, editProduct);
  }

  // Delete Product

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.deleteUrl + id);
  }
  // Clear Cache
  clearCache() {
    this.product$ = null;
  }
}

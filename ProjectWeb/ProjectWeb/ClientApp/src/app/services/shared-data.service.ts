import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Sales } from '../interfaces/sales';

@Injectable({
  providedIn: 'root'
}) 
export class SharedDataService {


  constructor() { }
  public SalesData: Sales=null;
  public subject = new Subject<Sales>();
  private SalesSource = new  BehaviorSubject(this.SalesData);
  currentSales = this.SalesSource.asObservable();

  changeMessage(message: Sales) {
    this.SalesSource.next(message);
    }
}

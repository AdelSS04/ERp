import { SalesService } from './../../services/sales.service';
import { async } from '@angular/core/testing';
import { ProductService } from './../../services/product.service';
import { Iproduct } from './../../interfaces/iproduct';
import { SalesOrderLineService } from './../../services/sales-order-line.service';
import { SalesOrderLine } from './../../interfaces/sales-order-line';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Sales } from 'src/app/interfaces/sales';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomerService } from 'src/app/services/customer.service';
import { ICustomer } from 'src/app/interfaces/icustomer';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  a3: {
    productID?: number;
    productName: string;
    productDesc: string;
    outOfStock: boolean;
    productPrice: number;
    imageUrl: string;
    salesOrderLineId?: number;
    productModelId: number;
    salesId: number;
    quantity: number;
    total: number;
    price: number;
  }[];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('AddProduct') addmodal: TemplateRef<any>;
  productName: FormControl;
  adel: number;
  hi: string;
  ObjectManager: object;
  productIDD: FormControl;
  salesId: FormControl;
  quantity: FormControl;
  total: FormControl;
  price: FormControl;
  TotalValue: number;
  SommeSales: number;

  DeletedSales: SalesOrderLine;
  modalMessage: string;
  errorList: any[];
  SalesCustomer: ICustomer;
  constructor(
    private route: ActivatedRoute,
    private SalesData: SharedDataService,
    private router: Router,
    private SalesService: SalesService,
    private chRef: ChangeDetectorRef,
    private ProductService: ProductService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private CustomerService: CustomerService,
    private InvoiceService: SalesOrderLineService
  ) { }

  SalesO$: Observable<SalesOrderLine[]>;
  @ViewChild('DeleteTemplate') DeleteTemplate: TemplateRef<any>;
  @ViewChild('SucTemplate') Success: TemplateRef<any>;
  @ViewChild('FailTemplate') MsgBoxFail: TemplateRef<any>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  Product: Iproduct[] = [];
  ProductMod: Iproduct;
  Product$: Observable<Iproduct[]>;
  Sales$: Observable<Sales[]>;
  ProdName: string;
  ProdId: number;
  insertForm: FormGroup;
  productID: FormControl;
  modalRef: BsModalRef;
  productIDSelector: Iproduct;
  @Input() SalesO: SalesOrderLine[] = [];
  @Input() Sales: Sales;
  onDelete(Sales: SalesOrderLine): void {
    this.modalMessage = 'ALL FIELDS ARE MANDATORY';

    this.modalRef = this.modalService.show(this.DeleteTemplate);
    this.DeletedSales = Sales;
  }
  printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  }
  ConfirmDelet(sales: SalesOrderLine): void {
    this.InvoiceService.deleteSalesLine(sales.salesOrderLineId).subscribe(
      (result) => {
        this.InvoiceService.clearCache();
        this.SalesO$ = this.InvoiceService.getSalesOrderLine(
          this.Sales.salesId
        );
        this.SalesO$.subscribe(async (newlist) => {
          this.SalesO = newlist;

          await this.rerender().then((results) => {
            this.UpdateSalesSomme().then((results) => {
              this.UpdateSales();
            });
          });
        });
        this.modalMessage = 'Delete With Success';
        this.modalRef.hide();

        this.modalRef = this.modalService.show(this.Success);
      },
      (error) => {
        this.modalRef.hide();
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
        }
        this.modalMessage = 'Your Delete Was Unsuccessful';
        this.modalRef = this.modalService.show(this.MsgBoxFail);
      }
    );
  }
  async onSubmit() {
    let valuetest = this.insertForm.value.productModelId.productID;
    this.insertForm.value.productModelId = valuetest;
    this.insertForm.value.price = this.adel;
    this.insertForm.value.total = this.TotalValue;
    let newSales = this.insertForm.value;

    this.InvoiceService.insertSales(newSales).subscribe(
      (result) => {
        this.InvoiceService.clearCache();
        this.SalesO$ = this.InvoiceService.getSalesOrderLine(newSales.salesId);
        this.SalesO$.subscribe(async (newlist) => {
          this.SalesO = newlist;
          this.modalRef.hide();
          this.insertForm.reset();
          this.modalMessage = 'New SalesLine added';
          this.modalRef = this.modalService.show(this.Success);

          await this.rerender().then((results) => {
            this.UpdateSalesSomme().then((results) => {
              this.UpdateSales();
            });
          });
          this.RestAddForm();
        });
      },
      (error) => {
        this.modalRef.hide();
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);

        }
        this.modalMessage = "Could not add SalesLine";
        this.modalRef = this.modalService.show(this.MsgBoxFail)
      }
    );
  }
  async UpdateSalesSomme() {
    this.SommeSales = 0;
    for (let index = 0; index < this.a3.length; index++) {
      this.SommeSales += this.a3[index].total;
    }
    this.Sales.total = this.SommeSales;
  }
  UpdateSales() {
    this.SalesService.updateSales(this.Sales).subscribe(
      async (result) => {
        this.SalesService.getSalesById(this.ProdId).subscribe(
          (result) => (this.Sales = result)
        );
      },
      (error) => {
        this.modalRef.hide();
        this.errorList = [];
        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
        }
        this.modalMessage = "Refrech";
        this.modalRef = this.modalService.show(this.MsgBoxFail)
      }
    );
  }
  Addprod() {
    this.modalRef = this.modalService.show(this.addmodal);
    this.modalMessage = 'ALL FIELDS ARE MANDATORY';
  }
  modelChangeFn(e) {
    this.productIDSelector = e;
    this.adel = this.productIDSelector.productPrice;
    this.TotalValue = null;
  }
  modelChangeFnT(e) {
    this.TotalValue = this.adel * e;
  }
  RestAddForm() {
    this.productID = new FormControl();
    this.salesId = new FormControl();
    this.quantity = new FormControl();
    this.total = new FormControl();
    this.price = new FormControl();

    this.insertForm = this.fb.group({
      productModelId: this.productID,
      salesId: this.ProdId,
      quantity: this.quantity,
      total: this.total,
      price: this.adel,
    });
  }
  async ngOnInit(): Promise<void> {
    this.hi = 'zzz';
    this.ProductService.clearCache();
    this.InvoiceService.clearCache();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      paging: false,
      info: false,
      searching: false,
      autoWidth: true,
      order: [[0, 'desc']],
    };
    let id = +this.route.snapshot.params['id'];
    this.ProdId = id;
    this.Product$ = this.ProductService.getProducts();
    this.SalesO$ = this.InvoiceService.getSalesOrderLine(id);
    this.SalesService.getSalesById(id).subscribe(
      (result) => (this.Sales = result)
    );
    await this.Product$.subscribe((result) => {
      this.Product = result;
    });
    await this.SalesO$.subscribe(async (result) => {
      this.SalesO = result;
      this.chRef.detectChanges();
      this.dtTrigger.next();
      await this.onSelect();
    });

    this.CustomerService.getCustomerById(this.Sales.customerId).subscribe(result => this.SalesCustomer = result);
    this.RestAddForm();
  }

  async rerender() {
    this.ProductService.clearCache();
    this.InvoiceService.clearCache();
    this.SalesService.getSalesById(this.ProdId).subscribe(
      (result) => (this.Sales = result)
    );
    this.Product$ = this.ProductService.getProducts();
    this.SalesO$ = this.InvoiceService.getSalesOrderLine(this.ProdId);
    this.SalesService.getSalesById(this.ProdId).subscribe(
      (result) => (this.Sales = result)
    );
    await this.Product$.subscribe((result) => {
      this.Product = result;
    });
    await this.SalesO$.subscribe(async (result) => {
      this.SalesO = result;
    });
    await this.onSelect();
    await this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  ngOnDestroy() {
    // Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }
  async onSelect() {
    this.a3 = [];
    this.a3 = this.SalesO.map((t1) => ({
      ...t1,
      ...this.Product.find((t2) => t2.productID === t1.productModelId),
    }));
  }
}

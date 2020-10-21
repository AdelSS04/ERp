import { Sales } from './../../interfaces/sales';
import { SalesService } from './../../services/sales.service';
import { SharedDataService } from './../../services/shared-data.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from './../../services/customer.service';
import { ICustomer } from 'src/app/interfaces/icustomer';
import { DatePipe } from '@angular/common'



@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  Sales$: Observable<Sales[]>;
  Sales: Sales[] = [];
  selectedInvoice: Sales;
  // Modal properties
  @ViewChild('editTemplate') editmodal: TemplateRef<any>;
  @ViewChild('template') addmodal: TemplateRef<any>
  @ViewChild('SucTemplate') Success: TemplateRef<any>
  @ViewChild('FailTemplate') MsgBoxFail: TemplateRef<any>;
  @ViewChild('DeleteTemplate') DeleteTemplate: TemplateRef<any>;

  modalMessage: string;
  modalRef: BsModalRef;
  updateForm: FormGroup;
  insertForm: FormGroup;
  orderDate: FormControl;
  deliveryDate: FormControl;
  total: FormControl;
  customerId: FormControl;
  salesId: FormControl;
  Customer$: Observable<ICustomer[]>;
  Customer: ICustomer[] = [];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  errorList: any[];
  _orderDate: FormControl;
  _deliveryDate: FormControl;
  _total: FormControl;
  _customerId: FormControl;
  DeletedSales: Sales;
  constructor(private SalesService: SalesService, private SalesData: SharedDataService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private Customerservice: CustomerService, public datepipe: DatePipe,
  ) { }

  anio: Date = new Date();
  onAddSales() {
    this.restAddForm();
    this.modalMessage = "ALL FIELDS ARE MANDATORY";
    this.modalRef = this.modalService.show(this.addmodal);
  }

  onSubmit() {

    let newSales = this.insertForm.value;
    this.SalesService.insertSales(newSales).subscribe(
      result => {
        this.SalesService.clearCache();
        this.Sales$ = this.SalesService.getSales();

        this.Sales$.subscribe(newlist => {
          this.Sales = newlist;
          this.modalRef.hide();
          this.insertForm.reset();
          this.modalMessage = "New Sales added";
          this.modalRef = this.modalService.show(this.Success);
          this.rerender();

        });


      }, error => {
        this.modalRef.hide();
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);

        }
        this.modalMessage = "Could not add Sales";
        this.modalRef = this.modalService.show(this.MsgBoxFail)

      } 

    )

  }
  CustomerIDModel: number;
  onUpdateModal(SalesUpdate: Sales): void {
    this.restUpForm();
    this.modalMessage = "ALL FIELDS ARE MANDATORY";
    this.salesId.setValue(SalesUpdate.salesId);
    this.CustomerIDModel = SalesUpdate.customerId;
    this.total.setValue(SalesUpdate.total);
    this.deliveryDate.setValue(this.datepipe.transform(SalesUpdate.deliveryDate, 'yyyy-MM-dd'));
    this.orderDate.setValue(this.datepipe.transform(SalesUpdate.orderDate, 'yyyy-MM-dd'));
    this.updateForm.setValue({
      'customerId': 0,
      'salesId': this.salesId.value,
      'total': this.total.value,
      'deliveryDate': this.deliveryDate.value,
      'orderDate': this.orderDate.value,
    });
    this.modalRef = this.modalService.show(this.editmodal);

  }

  ConfirmDelet(sales: Sales): void {
    this.SalesService.deleteSales(sales.salesId).subscribe(result => {
      this.SalesService.clearCache();
      this.Sales$ = this.SalesService.getSales();
      this.Sales$.subscribe(newlist => {
        this.Sales = newlist;
        this.modalMessage = "Delete With Success";
        this.modalRef.hide();

        this.modalRef = this.modalService.show(this.Success);
        this.rerender();
      })
    }, error => {
      this.modalRef.hide();
      this.errorList = [];

      for (var i = 0; i < error.error.value.length; i++) {
        this.errorList.push(error.error.value[i]);

      }
      this.modalMessage = "Your Delete Was Unsuccessful";
      this.modalRef = this.modalService.show(this.MsgBoxFail)

    })
  }
  onSelect(Invoice: Sales): void {
    this.SalesData.changeMessage(Invoice);

    this.router.navigateByUrl("/Sales/" + Invoice.salesId);
  }
  onUpdate() {
    let editProduct = this.updateForm.value;
    this.SalesService.updateSales(editProduct).subscribe(
      result => {

        this.SalesService.clearCache();
        this.Sales$ = this.SalesService.getSales();
        this.Sales$.subscribe(updatedlist => {
          this.Sales = updatedlist;

          this.modalRef.hide();
          this.modalMessage = "Update With Success";
          this.modalRef = this.modalService.show(this.Success);
          this.rerender();

        });
      }, error => {

        this.modalRef.hide();
        this.errorList = [];
        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
        }
        this.modalMessage = "Your Update Was Unsuccessful";
        this.modalRef = this.modalService.show(this.MsgBoxFail)

      }
    )

  }
  onDelete(Sales: Sales): void {
    this.modalRef = this.modalService.show(this.DeleteTemplate);
    this.DeletedSales = Sales;

  }
  restAddForm() {
    // Initializing Update Product properties
    this._customerId = new FormControl();
    this._deliveryDate = new FormControl();
    this._orderDate = new FormControl();
    this.insertForm = this.fb.group(
      {
        'customerId': this._customerId,
        'total': 0,
        'deliveryDate': this._deliveryDate,
        'orderDate': this._orderDate,
      }
    );
  }
  restUpForm() {
    this.salesId = new FormControl();
    this.customerId = new FormControl();
    this.deliveryDate = new FormControl();
    this.orderDate = new FormControl();
    this.total = new FormControl();

    this.updateForm = this.fb.group(
      {
        'salesId': this.salesId,
        'customerId': this.customerId,
        'total': this.total,
        'deliveryDate': this.deliveryDate,
        'orderDate': this.orderDate,

      });
  }
  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.Sales$ = this.SalesService.getSales();
    this.Sales$.subscribe(result => {
      this.Sales = result;
      this.chRef.detectChanges();
      this.dtTrigger.next();

    });

    this.restAddForm(); this.restUpForm();


    this.Customer$ = this.Customerservice.getCustomer();
    this.Customer$.subscribe(result => {
      this.Customer = result;
    });

  }
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
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
}
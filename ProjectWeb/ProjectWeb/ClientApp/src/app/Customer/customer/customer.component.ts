import { ICustomerType } from './../../interfaces/icustomer-type';
import { CustomerTypeService } from './../../services/customer-type.service';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { ICustomer } from './../../interfaces/icustomer';
import { CustomerService } from './../../services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  errorList: string[];
  userRoleStatus: string;
  // For the FormControl - Adding Customer
  insertForm: FormGroup;
  customerId?: FormControl;
  customerTypeId: FormControl;
  customerName: FormControl;
  address: FormControl;
  state: FormControl;
  zipCode: FormControl;
  phone: FormControl;
  email: FormControl;
  // For the FormControl - Adding Customer
  updateForm: FormGroup;
  _customerId?: FormControl;
  _customerTypeId: FormControl;
  _customerName: FormControl;
  _address: FormControl;
  _state: FormControl;
  _zipCode: FormControl;
  _phone: FormControl;
  _email: FormControl;
  _id: FormControl;
  custtype: number;
  modalMessage: string;
  modalRef: BsModalRef;
  contactPerson: FormControl;
  Customer$: Observable<ICustomer[]>;
  Customer: ICustomer[] = [];
  CustomerType: ICustomerType[] = [];
  CustomerType$: Observable<ICustomerType[]>;
  DeletedCustomer: ICustomer;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild('template') modal: TemplateRef<any>;
  @ViewChild('SucTemplate') MsgBox: TemplateRef<any>;
  @ViewChild('FailTemplate') MsgBoxFail: TemplateRef<any>;
  @ViewChild('editTemplate') editmodal: TemplateRef<any>;
  @ViewChild('DeleteTemplate') DeleteTemplate: TemplateRef<any>;

  constructor(private Customerservice: CustomerService,
    private CustomerTypeService: CustomerTypeService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    // Add Modal

    private acct: AccountService) { }
  onAddCustomer() {
    this.modalRef = this.modalService.show(this.modal);

  }
  onUpdate() {
    let editProduct = this.updateForm.value;
    console.log(editProduct);
    this.Customerservice.updateCustomer(editProduct).subscribe(
      result => {

        this.Customerservice.clearCache();
        this.Customer$ = this.Customerservice.getCustomer();
        this.Customer$.subscribe(updatedlist => {
          this.Customer = updatedlist;

          this.modalRef.hide();
          this.modalMessage = "Update With Success";
          this.modalRef = this.modalService.show(this.MsgBox);
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
  onSubmit() {
    let newCustomer = this.insertForm.value;
    console.log(newCustomer);
    this.Customerservice.insertCustomer(newCustomer).subscribe(
      result => {
        this.Customerservice.clearCache();
        this.Customer$ = this.Customerservice.getCustomer();

        this.Customer$.subscribe(newlist => {
          this.Customer = newlist;
          this.modalRef.hide();
          this.insertForm.reset();
          this.modalMessage = "New Customer added";
          this.modalRef = this.modalService.show(this.MsgBox);
          this.rerender();

        });


      }
      , error => {
        this.modalRef.hide();
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);

        }
        this.modalMessage = "Could not add Customer";
        this.modalRef = this.modalService.show(this.MsgBoxFail)

      }

    )

  }
  onUpdateModal(CustomerEdit: ICustomer): void {
    this._customerTypeId.setValue(this.CustomerType);
    this.custtype = CustomerEdit.customerTypeId;
    this._id.setValue(CustomerEdit.customerId);
    this._customerName.setValue(CustomerEdit.customerName);
    this._address.setValue(CustomerEdit.address);
    this._state.setValue(CustomerEdit.state);
    this._zipCode.setValue(CustomerEdit.zipCode);
    this._phone.setValue(CustomerEdit.phone);
    this._email.setValue(CustomerEdit.email);
    this.updateForm = this.fb.group({
      'customerTypeId': this.CustomerType[1],
      'customerName': this._customerName,
      'address': this._address,
      'state': this._state,
      'zipCode': this._zipCode,
      'phone': this._phone,
      'email': this._email,
      'CustomerId': this._id,



    });
    this.modalRef = this.modalService.show(this.editmodal);



  }
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }
  ConfirmDelet(customer: ICustomer): void {
    console.log(customer);
    this.Customerservice.deleteCustomer(customer.customerId).subscribe(result => {
      this.Customerservice.clearCache();
      this.Customer$ = this.Customerservice.getCustomer();
      this.Customer$.subscribe(newlist => {
        this.Customer = newlist;
        this.modalMessage = "Delete With Success";
        this.modalRef.hide();

        this.modalRef = this.modalService.show(this.MsgBox);
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

  // Method to Delete the product
  onDelete(Customer: ICustomer): void {
    this.modalRef = this.modalService.show(this.DeleteTemplate);
    this.DeletedCustomer = Customer;

  }
  ngOnInit(): void {

    this.acct.currentUserRole.subscribe(result => { this.userRoleStatus = result });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.Customer$ = this.Customerservice.getCustomer();
    this.CustomerType$ = this.CustomerTypeService.getCustomerType();
    this.Customer$.subscribe(result => {
      this.Customer = result;
      this.chRef.detectChanges();

      this.dtTrigger.next();

    });
    this.CustomerType$.subscribe(result => {
      this.CustomerType = result;
    });

    // Modal Message
    this.modalMessage = "All Fields Are Mandatory";
    let validateImageUrl: string = '^(https?:\/\/.*\.(?:png|jpg))$';

    this.customerTypeId = new FormControl();
    this.customerName = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.address = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.state = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.zipCode = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.phone = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.email = new FormControl('', [Validators.required, Validators.maxLength(50)]);


    this.insertForm = this.fb.group({ 
      'customerTypeId': this.customerTypeId,
      'customerName': this.customerName,
      'address': this.address,
      'state': this.state,
      'zipCode': this.zipCode,
      'phone': this.phone,
      'email': this.email,
    });

    this._customerTypeId = new FormControl();
    this._id = new FormControl();

    this._customerName = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._address = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._state = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._zipCode = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._phone = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._email = new FormControl('', [Validators.required, Validators.maxLength(50)]);


    this.updateForm = this.fb.group({
      'customerTypeId': this._customerTypeId,
      'customerName': this._customerName,
      'address': this._address,
      'state': this._state,
      'zipCode': this._zipCode,
      'phone': this._phone,
      'email': this._email,
      'CustomerId': this._id,



    });
  }



}

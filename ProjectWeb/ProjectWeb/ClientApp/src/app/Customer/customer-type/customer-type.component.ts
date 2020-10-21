import { CustomerTypeService } from './../../services/customer-type.service';
import { ICustomerType } from './../../interfaces/icustomer-type';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-customer-type',
  templateUrl: './customer-type.component.html',
  styleUrls: ['./customer-type.component.css']
})
export class CustomerTypeComponent implements OnInit,OnDestroy {
  errorList: string[];
  userRoleStatus: string;

  // For the FormControl - Adding CustomerTypes
  insertForm: FormGroup;
  CustomerTypeName: FormControl;

  // Updating the CustomerType
  updateForm: FormGroup;
  _CustomerTypeName: FormControl;
  modalMessage: string;
  modalRef: BsModalRef;
  selectedCustomerType: ICustomerType;
  DeletedCustomerType: ICustomerType;
  _CustomerTypeId: FormControl;
  CustomerType$: Observable<ICustomerType[]>;
  CustomerType: ICustomerType[] = [];
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    // Add Modal
    @ViewChild('template') modal: TemplateRef<any>;

    // Update Modal
    @ViewChild('editTemplate') editmodal : TemplateRef<any>;
    //MsgBox Modal
    @ViewChild('SucTemplate') MsgBox : TemplateRef<any>;
    @ViewChild('FailTemplate') MsgBoxFail : TemplateRef<any>;
    @ViewChild('DeleteTemplate') DeleteTemplate : TemplateRef<any>;
    
  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private CustomerTypeservice : CustomerTypeService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef : ChangeDetectorRef,
    private router: Router,
    private acct: AccountService) { } 
    onAddCustomerType() {
      this.modalRef = this.modalService.show(this.modal);
  
    }

    onSubmit() {
      let newCustomerType = this.insertForm.value;
      this.CustomerTypeservice.insertCustomerType(newCustomerType).subscribe(
        result => {
          this.CustomerTypeservice.clearCache();
          this.CustomerType$ = this.CustomerTypeservice.getCustomerType();
  
          this.CustomerType$.subscribe(newlist => {
            this.CustomerType = newlist;
            this.modalRef.hide();
            this.insertForm.reset();
            this.modalMessage = "New CustomerType added";
            this.modalRef =  this.modalService.show(this.MsgBox);
            this.rerender();
  
          });
          
  
        }
        , error => 
           {
            this.modalRef.hide();
               this.errorList = [];
     
               for(var i = 0; i < error.error.value.length; i++) 
               {
                 this.errorList.push(error.error.value[i]);
                
               } 
               this.modalMessage = "Could not add CustomerType";
               this.modalRef =  this.modalService.show(this.MsgBoxFail)
     
           }
  
      )
  
    }
    rerender() 
    {
        this.dtElement.dtInstance.then((dtInstance : DataTables.Api) => 
        {
            // Destroy the table first in the current context
            dtInstance.destroy();

            // Call the dtTrigger to rerender again
           this.dtTrigger.next();

        });
    }
    ConfirmDelet(CustomerTypeEdit : ICustomerType): void
{
  this.CustomerTypeservice.deleteCustomerType(CustomerTypeEdit.customerTypeId).subscribe(result => 
    {
        this.CustomerTypeservice.clearCache();
        this.CustomerType$ = this.CustomerTypeservice.getCustomerType();
        this.CustomerType$.subscribe(newlist => 
        {
            this.CustomerType = newlist;
         this.modalMessage = "Delete With Success";
         this.modalRef.hide();

         this.modalRef =  this.modalService.show(this.MsgBox);
         this.rerender();
        })
    }, error => 
    {
     this.modalRef.hide();
        this.errorList = [];

        for(var i = 0; i < error.error.value.length; i++) 
        {
          this.errorList.push(error.error.value[i]);
         
        } 
        this.modalMessage = "Your Delete Was Unsuccessful";
        this.modalRef =  this.modalService.show(this.MsgBoxFail)

    })
}
    onUpdateModal(CustomerTypeEdit: ICustomerType): void
  {
    this._CustomerTypeId.setValue(CustomerTypeEdit.customerTypeId);
    this._CustomerTypeName.setValue(CustomerTypeEdit.customerTypeName);
   

    this.updateForm.setValue({
      'customerTypeId': this._CustomerTypeId.value,
      'customerTypeName': this._CustomerTypeName.value,
     
    });

        this.modalRef = this.modalService.show(this.editmodal);
     
    }
    onDelete(CustomerType : ICustomerType) : void
    {             this.modalRef =  this.modalService.show(this.DeleteTemplate);
this.DeletedCustomerType=CustomerType ;
   
    }
    onUpdate()
    {
      let editCustomerType = this.updateForm.value;
      this.CustomerTypeservice.updateCustomerType(editCustomerType).subscribe(
        result => {
          
          this.CustomerTypeservice.clearCache();
          this.CustomerType$ = this.CustomerTypeservice.getCustomerType();
          this.CustomerType$.subscribe(updatedlist => {
            this.CustomerType = updatedlist;

            this.modalRef.hide();
            this.modalMessage = "Update With Success";
            this.modalRef =  this.modalService.show(this.MsgBox);
            this.rerender();

          });
        }, error => 
        {
         this.modalRef.hide();
            this.errorList = [];
  
            for(var i = 0; i < error.error.value.length; i++) 
            {
              this.errorList.push(error.error.value[i]);
             
            } 
            this.modalMessage = "Your Update Was Unsuccessful";
            this.modalRef =  this.modalService.show(this.MsgBoxFail)
  
        } 
      )

    }
  ngOnInit(): void {
    this.acct.currentUserRole.subscribe(result => {this.userRoleStatus = result});
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      autoWidth: true,
      order: [[0, 'desc']]
      };

  this.CustomerType$ = this.CustomerTypeservice.getCustomerType();

  this.CustomerType$.subscribe(result => { 
      this.CustomerType = result; 
      this.chRef.detectChanges();

      this.dtTrigger.next();
      
  });

    // Modal Message
    this.modalMessage = "All Fields Are Mandatory";
    let validateImageUrl: string = '^(https?:\/\/.*\.(?:png|jpg))$';

    this.CustomerTypeName = new FormControl('', [Validators.required, Validators.maxLength(50)]);

  
    this.insertForm = this.fb.group({
      'customerTypeName': this.CustomerTypeName,

    });

    this._CustomerTypeName = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._CustomerTypeId = new FormControl();
    this.updateForm = this.fb.group(
      {
        'customerTypeId': this._CustomerTypeId,
        'customerTypeName': this._CustomerTypeName,
        
      });

  }
  ngOnDestroy() 
    {
        // Do not forget to unsubscribe
        this.dtTrigger.unsubscribe();
    }

}

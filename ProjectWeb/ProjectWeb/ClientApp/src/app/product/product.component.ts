import { ProductService } from './../services/product.service';
import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective,DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Iproduct } from '../interfaces/Iproduct';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'] 
})
export class ProductComponent implements OnInit, OnDestroy  {

  errorList: string[]; 
 
  // For the FormControl - Adding products
  insertForm: FormGroup;
  name: FormControl;
  price: FormControl;
  ProdDesc: FormControl;
  imageUrl: FormControl;
  outOfStock : FormControl;
  // Updating the Product
  updateForm: FormGroup;
  _name: FormControl;
  _price: FormControl;
  _description: FormControl;
  _imageUrl: FormControl;
  _id: FormControl;
  _outOfStock : FormControl;


    // Add Modal
  @ViewChild('template') modal: TemplateRef<any>;

    // Update Modal
    @ViewChild('editTemplate') editmodal : TemplateRef<any>;
    //MsgBox Modal
    @ViewChild('SucTemplate') MsgBox : TemplateRef<any>;
    @ViewChild('FailTemplate') MsgBoxFail : TemplateRef<any>;
    @ViewChild('DeleteTemplate') DeleteTemplate : TemplateRef<any>;
    // Modal properties
  // Modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selectedProduct: Iproduct;
  DeletedProduct: Iproduct;
  products$: Observable<Iproduct[]>;
  products: Iproduct[] = [];
  userRoleStatus: string;


  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(private productservice : ProductService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef : ChangeDetectorRef,
    private router: Router,
    private acct: AccountService) { }
 
    
      // Method to Add new Product
  onSubmit() {
    let newProduct = this.insertForm.value;
    this.productservice.insertProduct(newProduct).subscribe(
      result => {
        this.productservice.clearCache();
        this.products$ = this.productservice.getProducts();

        this.products$.subscribe(newlist => {
          this.products = newlist;
          this.modalRef.hide();
          this.insertForm.reset();
          this.modalMessage = "New Product added";
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
             this.modalMessage = "Could not add Product";
             this.modalRef =  this.modalService.show(this.MsgBoxFail)
   
         }

    )

  }

      
    // We will use this method to destroy old table and re-render new table

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
     // Update an Existing Product
     onUpdate() 
     {
       let editProduct = this.updateForm.value;
       console.log(editProduct.outOfStock);
       this.productservice.updateProduct(editProduct).subscribe(
         result => {
           
           this.productservice.clearCache();
           this.products$ = this.productservice.getProducts();
           this.products$.subscribe(updatedlist => {
             this.products = updatedlist;

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

         // Load the update Modal
  onAddProduct() {
    this.modalRef = this.modalService.show(this.modal);

  }
  onUpdateModal(productEdit: Iproduct): void
  {
    this._id.setValue(productEdit.productID);
    this._name.setValue(productEdit.productName);
    this._price.setValue(productEdit.productPrice);
    this._description.setValue(productEdit.productDesc);
    this._imageUrl.setValue(productEdit.imageUrl);
    this._outOfStock.setValue(productEdit.outOfStock);

    this.updateForm.setValue({
      'productID': this._id.value,
      'productName': this._name.value,
      'productPrice': this._price.value,
      'productDesc': this._description.value,
      'imageUrl': this._imageUrl.value,
      'outOfStock':this._outOfStock.value
    });

        this.modalRef = this.modalService.show(this.editmodal);
     
    }
    ConfirmDelet(product : Iproduct): void
    {
      this.productservice.deleteProduct(product.productID).subscribe(result => 
        {
            this.productservice.clearCache();
            this.products$ = this.productservice.getProducts();
            this.products$.subscribe(newlist => 
            {
                this.products = newlist;
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
    // Method to Delete the product
    onDelete(product : Iproduct) : void
    {             this.modalRef =  this.modalService.show(this.DeleteTemplate);
this.DeletedProduct=product ;

    }

    onSelect(product: Iproduct) : void 
    {
        this.selectedProduct = product;

       this.router.navigateByUrl("/Product/" + product.productID);
    }

  ngOnInit(): void {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      autoWidth: true,
      order: [[0, 'desc']]
      };

  this.products$ = this.productservice.getProducts();

  this.products$.subscribe(result => { 
      this.products = result; 
      this.chRef.detectChanges();

      this.dtTrigger.next();
  });

 this.acct.currentUserRole.subscribe(result => {this.userRoleStatus = result});


  // Modal Message
  this.modalMessage = "All Fields Are Mandatory";
    let validateImageUrl: string = '^(https?:\/\/.*\.(?:png|jpg))$';

    this.name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this.imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);
    this.ProdDesc = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.outOfStock = new FormControl();
    this.insertForm = this.fb.group({
      'productName': this.name,
      'productPrice': this.price,
      'productDesc': this.ProdDesc,
      'imageUrl': this.imageUrl,
      'outOfStock': false,
    });

    // Initializing Update Product properties
    this._name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this._description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this._imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);
    this._id = new FormControl();
    this._outOfStock = new FormControl();

    this.updateForm = this.fb.group(
      {
        'productID': this._id,
        'productName': this._name,
        'productPrice': this._price,
        'productDesc': this._description,
        'imageUrl': this._imageUrl,
        'outOfStock': this._outOfStock

      });


  }
    ngOnDestroy() 
    {
        // Do not forget to unsubscribe
        this.dtTrigger.unsubscribe();
    }
}
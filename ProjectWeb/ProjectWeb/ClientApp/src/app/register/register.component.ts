import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  insertForm: FormGroup;
  username: FormControl;
  password: FormControl;
  cpassword: FormControl;
  email: FormControl;
  modalRef : BsModalRef;
  errorList: string[];
  modalMessage : string;
  @ViewChild('template') modal : TemplateRef<any>;
  @ViewChild('SucTemplate') modal1 : TemplateRef<any>;
  onClick() {
    this.modalRef.hide();
}
  constructor(  private fb: FormBuilder,
                private acct: AccountService,
                private route: ActivatedRoute,
                private router: Router,
                private modalService : BsModalService
                ) { }

                    // Properties


  ngOnInit(): void {
    this.username = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.cpassword = new FormControl('',[Validators.required, this.MustMatch(this.password)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);

   this.insertForm = this.fb.group(
   {
           'username': this.username,
           'password': this.password,
           'cpassword': this.cpassword,
           'email': this.email,
   });
    
  }
  MustMatch(passwordControl : AbstractControl) : ValidatorFn
  {
      return (cpasswordControl : AbstractControl) : {[key: string] : boolean } | null   => 
      {
          // return null if controls haven't initialised yet
          if(!passwordControl && !cpasswordControl) 
          {
              return null;
        }

          // return null if another validator has already found an error on the matchingControl
          if (cpasswordControl.hasError && !passwordControl.hasError) 
          {
              return null;
          } 
          // set error on matchingControl if validation fails
          if(passwordControl.value !== cpasswordControl.value) 
          {
              return { 'mustMatch': true };
          }
          else {
              return null;
          }

      }
      
   
  }

  onSubmit(){

    let userReig = this.insertForm.value;
    this.acct.Register(userReig.email,userReig.username, userReig.password).subscribe(result => 
      {this.router.navigate(['/Login']);
      
      this.modalMessage = "Your Registration Was successful";
      this.modalRef =  this.modalService.show(this.modal1)
      }, error => 
      {
         
          this.errorList = [];

          for(var i = 0; i < error.error.value.length; i++) 
          {
            this.errorList.push(error.error.value[i]);
           
          } 
          this.modalMessage = "Your Registration Was Unsuccessful";
          this.modalRef =  this.modalService.show(this.modal)

      });

  }


}

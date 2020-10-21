import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ContactUsService } from './../services/contact-us.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

	constructor(private fb: FormBuilder, private ContactUsService: ContactUsService, private modalService: BsModalService,
) { }
  SendMail: FormGroup;
  sender: FormControl;
  senderMail: FormControl;
	message: FormControl;
	modalMessage: string;
	modalRef: BsModalRef;

	@ViewChild('SucTemplate') MsgBox: TemplateRef<any>;
	@ViewChild('FailTemplate') MsgBoxFail: TemplateRef<any>;
	OnSend() {
		let ContactUs = this.SendMail.value;
		console.log(ContactUs);
		this.ContactUsService.insertMessage(ContactUs).subscribe(res => {
			this.modalMessage = "We have received your message and we will answer you as soon as possible. \n Thank you for trusting us  ";
			this.modalRef = this.modalService.show(this.MsgBox);
		}
			, err => {
				this.modalMessage = "Could not add CustomerType";
				this.modalRef = this.modalService.show(this.MsgBoxFail)
			})

  }
  ngOnInit(): void {
	  this.sender = new FormControl('', [Validators.required, Validators.maxLength(50)]);
	  this.message = new FormControl('', [Validators.required]);
	  this.senderMail = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.SendMail = this.fb.group({
       'message': this.message,
       'senderMail': this.senderMail,
		   'sender': this.sender,

    });

  }

}

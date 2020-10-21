import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css']
})
export class UserProfilComponent implements OnInit {
  imageSrc: string;





  constructor(private Acct: AccountService, private http: HttpClient) { }
  ProfilePicture: string;
  username: string;
  userrole: string;
  fileToUpload: File = null;
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    var data = { user: 'adelss04', email: formData };
    this.imageSrc = "adelss04";

    this.Acct.update(this.imageSrc, formData).subscribe(result => { console.log(result)

      localStorage.setItem('ProfilePicture', result['profilpic']);
      window.location.reload()

    }, err => console.log(err))

  }

  ngOnInit(): void {
    this.Acct.currentProfilePicture.subscribe(result => this.ProfilePicture = result);
    this.Acct.currentUserName.subscribe(result => this.username = result);
    this.Acct.currentUserRole.subscribe(result => this.userrole = result);

  }

}

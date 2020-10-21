import { AccountService } from './../services/account.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent implements OnInit {
  title = 'Management Web Application';
  loginStatus$: Observable<boolean>;
  UserName$: Observable<string>;
  ProfilePicture: string;
  UserRole$: Observable<string>;
  constructor(private Acct: AccountService) {}

  ngOnInit(): void {
    this.loginStatus$ = this.Acct.isLoggesIn;
    this.UserName$ = this.Acct.currentUserName;
    this.Acct.currentProfilePicture.subscribe(result => this.ProfilePicture = result);

  }
  OnLogOut() {
    this.Acct.logout();
  }
}

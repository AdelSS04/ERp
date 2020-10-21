import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { decode } from 'punycode';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient, private router: Router) {}
  // Url to access our Web API’s
  private baseUrlLogin: string = '/api/account/login';
  private baseUrlRegister: string = '/api/account/Register';
  private baseUrlUpdate: string = '/api/account/UpdateUser';
  // User related properties
  private loginStatus = new BehaviorSubject<boolean>(
    this.CheckingLoginStatus()
  );
  private UserName = new BehaviorSubject<string>(
    localStorage.getItem('UserName')
  );
  private UserRole = new BehaviorSubject<string>(
    localStorage.getItem('userRole')
  );
  private ProfilePicture = new BehaviorSubject<string>(
    localStorage.getItem('ProfilePicture')
  );
  //Register
  Register(UserEmail: string, UserName: string, PassWord: string) {
    return this.http
      .post<any>(this.baseUrlRegister, { UserName, PassWord, UserEmail })
      .pipe(
        map(
          (result) => {
            //registration was successful
            return result;
          },
          (error) => {
            return error;
          }
        )
      );
  }

  update(id: string, formData: FormData) {
    return this.http.post <FormData>(this.baseUrlUpdate + "/" + id, formData )};
  
  //Login Method
  login(UserName: string, PassWord: string) {
    return this.http
      .post<any>(this.baseUrlLogin, { UserName, PassWord })
      .pipe(
        map((result) => {
          if (result && result.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.loginStatus.next(true);
            localStorage.setItem('loginStatus', '1');
            localStorage.setItem('jwt', result.token);
            localStorage.setItem('UserName', result.nameUser);
            localStorage.setItem('expiration', result.expiration);
            localStorage.setItem('userRole', result.userRole);
            localStorage.setItem('ProfilePicture', result.profilePicture);
            this.UserName.next(localStorage.getItem('UserName'));
            this.UserRole.next(localStorage.getItem('userRole'));
            this.ProfilePicture.next(localStorage.getItem('ProfilePicture'));

          }

          return result;
        })
      );
  }

  logout() {
    // Set Loginstatus to false and delete saved jwt cookie
    this.loginStatus.next(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('UserName');
    localStorage.removeItem('expiration');
    localStorage.setItem('loginStatus', '0');
    this.router.navigate(['/Login']);
    console.log('Logged Out Successfully');
  }

  get isLoggesIn() {
    return this.loginStatus.asObservable();
  }
  get currentUserName() {
    return this.UserName.asObservable();
  }
  get currentProfilePicture() {
    return this.ProfilePicture.asObservable();
  }
  get currentUserRole() {
    return this.UserRole.asObservable();
  }
  CheckingLoginStatus(): boolean {
    var loginCookie = localStorage.getItem('loginStatus');
    if (loginCookie == '1') {
      if (
        localStorage.getItem('jwt') === null ||
        localStorage.getItem('jwt') === undefined
      ) {
        return false;
      }

      // Get and Decode the Token
      const token = localStorage.getItem('jwt');
      const decoded = jwt_decode(token);
      // Check if the cookie is valid

      if (decoded.exp === undefined) {
        return false;
      }

      // Get Current Date Time
      const date = new Date(0);

      // Convert EXp Time to UTC
      let tokenExpDate = date.setUTCSeconds(decoded.exp);

      // If Value of Token time greter than

      if (tokenExpDate.valueOf() > new Date().valueOf()) {
        return true;
      }

      console.log('NEW DATE ' + new Date().valueOf());
      console.log('Token DATE ' + tokenExpDate.valueOf());

      return false;
    }
    return false;
  }
}

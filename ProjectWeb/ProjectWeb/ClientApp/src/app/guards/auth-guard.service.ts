import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private acct : AccountService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable<boolean> 
  {
    return this.acct.isLoggesIn.pipe(take(1), map((loginStatus : boolean) => 
        {
              const destination: string  = state.url;
              const productId = route.params.id; 


            // To check if user is not logged in
            if(!loginStatus) 
            {
                this.router.navigate(['/Login'], {queryParams: {returnUrl : state.url}});

                return false;
            }

            // if the user is already logged in
            switch(destination) 
            {
              
                case '/Product' :
                {
                        if(localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "Moderator") 
                        {
                            return true;
                        }
                        else
                        {
                          this.router.navigate(['/Forbidden']);
                          return false;
                        }

                }

                case '/CustomerType' :
                  {
                          if(localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "Moderator") 
                          {
                              return true;
                          }
                          else
                          {
                            this.router.navigate(['/Forbidden']);
                            return false;
                          }
  
                  }
                  case '/Customer' :
                    {
                            if(localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "Moderator") 
                            {
                                return true;
                            }
                            else
                            {
                              this.router.navigate(['/Forbidden']);
                              return false;
                            }
    
                    }

               

               case '/Product/' + productId : 
                {
                        if( localStorage.getItem("userRole") === "Moderator") 
                        {
                            this.router.navigate(['/Forbidden'])

                            return false;
                         }

                        if(localStorage.getItem("userRole") === "Customer" ||localStorage.getItem("userRole") === "Admin") 
                        {

                            return true;
                        }

                }

               default:
                this.router.navigate(['/Forbidden']);
                    return false;
            }           
          
        }));
  }
}

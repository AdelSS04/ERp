import { Injectable } from '@angular/core';
import { AccountService } from '../services/account.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take,map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  constructor(private acct : AccountService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state : RouterStateSnapshot) : Observable<boolean> {
    
    return this.acct.isLoggesIn.pipe(take(1), map((loginStatus : boolean) => 
    {
          const destination: string  = state.url;
          const productId = route.params.id; 


        // To check if user is not logged in
        if(loginStatus) 
        {
            this.router.navigate(['/Home']);

            return false;
        }
        else
        return true ;
         
      
    }));
}

    }




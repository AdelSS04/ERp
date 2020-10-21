import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gallery } from '../interfaces/gallery';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private http: HttpClient) { }
  private baseUrlFeaturedHome = "/api/Gallery/GetFeaturedGallery/FeaturedHome";

  private baseUrlCreateGallery = "/api/Gallery/CreateNewGallery";

  private baseUrlUpdateGallery = "/api/Gallery/UpdateGallery/";

  private baseUrlDeleteGallery = "/api/Gallery/DeleteGallery/";
  // Using Dollar sign in naming convention to identify Observable types
  private gallery$: Observable<Gallery[]>;

  getFeaturedHomeGallery() : Observable<Gallery[]> 
  {
  
      // first we will check if theree is already values inside gallery$
      // If No, then we will make API call to get galleries
      if(!this.gallery$) 
      {
          this.gallery$ = this.http.get<Gallery[]>(this.baseUrlFeaturedHome).pipe(shareReplay());
      }
      // If Yes, then return the galleries from cache
      return this.gallery$; 
  }
  
}

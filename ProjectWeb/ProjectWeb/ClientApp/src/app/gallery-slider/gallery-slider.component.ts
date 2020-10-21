import { Component, OnInit } from '@angular/core';
import { GalleryService } from '../services/gallery.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-gallery-slider',
  templateUrl: './gallery-slider.component.html',
  styleUrls: ['./gallery-slider.component.css']
})
export class GallerySliderComponent implements OnInit {

  constructor(private galleryservice : GalleryService) { }
  WebSite = '/uploads/Gallery/1020/203415879.png';
  ngOnInit(): void {
    this.loadFeaturedHomeGallery(this.WebSite);
    
  }
  loadFeaturedHomeGallery(WebSite: string) 
  {
    this.galleryservice.getFeaturedHomeGallery().subscribe(result => {
       $.each(result, function(key, value) {
      
       $(".carousel-indicators").append("<li data-target='#carouselFeatured' data-slide-to='"+key+"' class='"+(key == 0 ? "active" : "")+"'></li>");
       $("#carouselFeatured .carousel-inner").append("<div  style='background-image:linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("+value.image_Path.replace(/\\/g,"/")+");height:490px;background-position:center;' class='"+ (key == 0 ? "carousel-item active slider-image" : "carousel-item slider-image") +"'>" +
       "<div class='intro-text' style='padding-top: 150px;padding-bottom: 100px;'>" +
       "<div class='intro-lead-in' style='font-size: 75px;line-height: 75px;margin-bottom: 25px;font-family: Poppins-Black;'>"+value.image_Caption+"</div>" +
       "<div class='intro-heading text-uppercase' style='font-size: 50px;font-weight: 700;line-height: 50px;margin-bottom: 5px;font-family: Poppins-Thin;'>"+value.image_Description+"</div>" +
       "</div>" +
       "<a class='btn btn-warning btn-xl text-uppercase js-scroll-trigger' href='#'>View More</a>" +
       "</div>"); 
       });
      
    });
  }
}

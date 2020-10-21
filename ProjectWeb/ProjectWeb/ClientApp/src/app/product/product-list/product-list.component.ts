import { Component, OnInit, Input } from '@angular/core';
import { Iproduct } from 'src/app/interfaces/Iproduct';
import { ProductService } from 'src/app/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @Input() product : Iproduct;
  constructor( private route: ActivatedRoute,  
    private router : Router,  
    private productservice: ProductService ) { }
 
  ngOnInit(): void {
    let id = + this.route.snapshot.params['id'];

    this.productservice.getProductById(id).subscribe(result => this.product = result);
  }

}

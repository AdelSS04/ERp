import { Component, OnInit } from '@angular/core';
import { DashService } from './../services/dash.service';
import { IDash } from './../interfaces/idash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dashservice: DashService) { }
  dash: IDash;
  ngOnInit(): void {
    this.dashservice.getData().subscribe(result => this.dash=result)
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
        return false;
    }
    return true;
};
}

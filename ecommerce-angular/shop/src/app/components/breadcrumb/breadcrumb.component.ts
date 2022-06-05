import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, DoCheck {

  public urlSections: string[] = [];

  constructor(
    private _router: Router
  ) { 
  }

  ngOnInit(): void {
    this.getUrlSection();
  }

  ngDoCheck(): void {
    this.getUrlSection();
  }


  getUrlSection():void{
    var actualHref = this._router.url;
    if(actualHref === '/'){
      this.urlSections.push('Home');
    }
  }

}

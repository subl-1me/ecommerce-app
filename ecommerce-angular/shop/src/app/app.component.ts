import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck, OnInit {
  title = 'shop';

  public showCartModal: boolean;
  public showNavBar: boolean;

  constructor(
    private _router: Router
  ){
    this.showCartModal = false;
    this.showNavBar = true;
  }

  ngDoCheck(): void {
    this.getUrl();
  }

  ngOnInit(): void {

  }

  getUrl():void{
    let url = window.location.href;
    let data = url.split('/');
    if(data[3] === 'checkout'){
      this.showNavBar = false;
      return;
    }

    this.showNavBar = true;
  }

  openModal(event:any):void{
    this.showCartModal = event;
  }

  closeModal(event:any):void{
    this.showCartModal = event;
  }
}

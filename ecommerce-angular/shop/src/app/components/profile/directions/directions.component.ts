import { Component, OnInit } from '@angular/core';

import { Direction } from 'src/app/models/direction';

import { DirectionService } from 'src/app/services/direction.service';

// Icons
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.css'],
  providers: [ DirectionService ]
})
export class DirectionsComponent implements OnInit {

  public direction: Direction;
  public directions: Array<Direction>;
  public customerID: any;

  // Icons
  faMap = faMap;
  faPlus = faPlus;
  faTrash = faTrash;

  constructor(
    private _directionService: DirectionService,
  ) { 
    this.directions = [];
    this.customerID = localStorage.getItem('_id');
    this.direction = { principal: false, customer: this.customerID, country: 'Mexico', region: 'Chihuahua', city: 'Juarez' };
    this.direction = { principal: false, customer: this.customerID };
  }

  ngOnInit(): void {
    this.getDirections();
  }

  onSubmit(form:any):void{

    this._directionService.addDirection(this.direction).subscribe((response) => {
      if(!response.direction) return;

      this.getDirections();
      form.reset();
    })
  }

  getDirections():void{
    this._directionService.getDirectionList().subscribe((response) => {

      if(response.message){
        this.directions = [];
        return;
      }

      this.directions = response.directions;
      console.log(this.directions);
    })
  }

  deleteDirection(directionID:any):void{

    this._directionService.deleteDirection(directionID).subscribe((response) => {

      this.getDirections();
    })
  }
  
  setDirectionAsDefault(directionID:any):void{
    this._directionService.setDirectionAsDefault(directionID, this.customerID).subscribe((response) => {
      console.log(response);
      this.getDirections();
    })
  }

  setAsDefault(directionId:any):void{
    this._directionService.setDirectionAsDefault(directionId, this.customerID).subscribe((response) => {
      console.log(response);
    })
  }

  removeDirection(directionId:any):void{
    this._directionService.deleteDirection(directionId).subscribe((response) =>{
      console.log(response);
      this.getDirections();
    })
  }
}

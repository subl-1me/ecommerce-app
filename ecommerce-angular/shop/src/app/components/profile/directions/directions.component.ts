import { Component, OnInit } from '@angular/core';

import { Direction, DirectionInput } from 'src/app/models/direction';

import { DirectionService } from 'src/app/services/direction.service';
import { Auth } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';

// Icons
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.css'],
  providers: [DirectionService],
})
export class DirectionsComponent implements OnInit {
  public direction: DirectionInput;
  public directions: Direction[] = [];
  public customerID: any;
  public auth: Auth = {
    jwt: '',
    user: null,
  };

  // Icons
  faMap = faMap;
  faPlus = faPlus;
  faTrash = faTrash;

  constructor(
    private _directionService: DirectionService,
    private _authService: AuthService,
  ) {
    this.direction = {
      principal: false,
      customer: '',
      phone: '',
      dni: '',
      zip: '',
      addressee: '',
      address: '',
      region: 'Chihuahua',
      province: 'Juarez',
      country: 'Mexico',
      district: 'Mexico',
    };
  }

  ngOnInit(): void {
    this.loadUserAuth();
    this.getDirections();
  }

  private loadUserAuth(): void {
    this.auth = this._authService.getUser();
  }

  onSubmit(form: any): void {
    this.direction.customer = this.auth.user._id;
    this._directionService
      .addDirection(this.direction)
      .subscribe((response) => {
        if (!response.direction) return;

        this.getDirections();
      });
  }

  public async getDirections(): Promise<void> {
    const response = await lastValueFrom(
      this._directionService.getDirectionList(),
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    console.log(response);
    this.directions = response.addresses;
  }

  deleteDirection(directionID: any): void {
    this._directionService
      .deleteDirection(directionID)
      .subscribe((response) => {
        this.getDirections();
      });
  }

  setDirectionAsDefault(directionID: any): void {
    this._directionService
      .setDirectionAsDefault(directionID, this.customerID)
      .subscribe((response) => {
        console.log(response);
        this.getDirections();
      });
  }
}

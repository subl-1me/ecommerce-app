import { Component, OnInit, Input } from '@angular/core';

import { Review } from '../../models/review';
import { ReviewService } from 'src/app/services/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  providers: [ ReviewService ]
})
export class ReviewComponent implements OnInit {

  @Input() productID: string;

  public form: FormGroup;
  public rating: number;

  public review: Review;
  public customerID: any;

  constructor(
    private _reviewService: ReviewService,
    private fb: FormBuilder
  ) { 
    this.review = {};
    this.customerID = localStorage.getItem('_id');
    this.rating = 0;

    this.productID = '';
    this.form = this.fb.group({
      rating: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  submitReview(form:any):void{
    this.review.customer = this.customerID;
    this.review.product = this.productID;
    this.review.rating = this.form.value.rating;

    this._reviewService.postReview(this.review, this.productID).subscribe((response) => {
      console.log(response);
    })
  }

}

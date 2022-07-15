import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/models/review';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  providers: [ ReviewService ]
})
export class ReviewsComponent implements OnInit {

  public reviews: Array<Review>;
  public productID: any;

  constructor(
    private _reviewService: ReviewService,
    private _route: ActivatedRoute
  ) { 
    this.reviews = [];
    this.productID = this._route.snapshot.paramMap.get('id');
  }

  getProductsReview():void{
    this._reviewService.getReviews(this.productID).subscribe((response) =>{
      console.log(response);
      this.reviews = response.reviews;
    })
  }

  ngOnInit(): void {
    this.getProductsReview();
  }

}

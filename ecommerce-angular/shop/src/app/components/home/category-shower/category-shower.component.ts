import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from 'src/app/models/config';
import { Input } from '@angular/core';

@Component({
  selector: 'app-category-shower',
  templateUrl: './category-shower.component.html',
  styleUrls: ['./category-shower.component.css'],
})
export class CategoryShowerComponent implements OnInit {
  @Input() config: Config;
  constructor(private _router: Router) {
    this.config = {
      _id: '',
      shopName: '',
      categories: [],
      logo: { path: '', public_id: '' },
    };
  }

  public navigateByCategory(category: string): void {
    this._router.navigate([`products/${category}`]);
  }

  ngOnInit(): void {}
}

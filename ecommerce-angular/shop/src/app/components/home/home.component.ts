import { Component, OnInit } from '@angular/core';

import { ProductsService } from 'src/app/services/products.service';
import { ConfigsService } from 'src/app/services/configs.service';
import { Config } from 'src/app/models/config';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ProductsService],
})
export class HomeComponent implements OnInit {
  public latestProducts: any;
  public topSellers: any;

  public config: Config;

  constructor(private _configService: ConfigsService) {
    this.config = {
      _id: '',
      shopName: '',
      categories: [],
      logo: { path: '', public_id: '' },
    };
  }

  ngOnInit(): void {
    this.getConfig();
  }

  async getConfig(): Promise<void> {
    const response = await lastValueFrom(this._configService.getShopConfigs());
    if (!response.success) {
      alert(response.message);
      return;
    }

    this.config = response.config;
  }
}

import { Component, OnInit, DoCheck } from '@angular/core';

import { ProductService } from 'src/app/services/product.service';
import { IdentityService } from 'src/app/services/identity.service';

// Icons
import { faAdd, faLink } from '@fortawesome/free-solid-svg-icons';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

import { Product } from 'src/app/models/product';

import { constans } from 'src/app/services/const';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ProductService, IdentityService],
})
export class ListComponent implements OnInit, DoCheck {
  // Icons
  faAdd = faAdd;
  faFileExcel = faFileExcel;
  faLink = faLink;

  public token: any;
  public products = Array<Product>();
  public titleFilter: string;
  public responseMessage: string;
  public productLinkHref = constans.productLinkHref;

  public edit = '/panel/product/edit/';

  public file = {
    name: '',
    url: '',
    mime: '',
  };

  constructor(
    private _productService: ProductService,
    private _identityService: IdentityService
  ) {
    this.token = this._identityService.getToken();
    this.products = [];
    this.titleFilter = '';
    this.responseMessage = '';
  }

  ngOnInit(): void {
    this.list();
  }

  ngDoCheck(): void {}

  list(): void {
    this._productService.list(this.token).subscribe((res) => {
      if (res.status == 'success') {
        this.products = res.products;
        console.log(this.products);
      }
    });
  }

  filter(): void {
    this._productService
      .listByFilter(this.titleFilter, this.token)
      .subscribe((res) => {
        if (res.status == 'success') {
          this.products = res.products;
          this.responseMessage = '';
        } else {
          this.products = [];
          this.responseMessage = res.message;
        }
      });
  }

  public exportAsExcel() {
    if (this.products.length == 0) {
      console.log('Cannot export an empty excel.');
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Products Report');

    var arrayToExport: any[] = [];
    this.products.forEach((product) => {
      arrayToExport.push({
        title: product.title,
        category: product.category,
        price: product.price,
        rating: product.rating,
        sales: product.sales,
        stock: product.stock,
      });
    });

    worksheet.addRow(undefined);
    for (let items of arrayToExport) {
      let keys = Object.keys(items);

      let tempKeys = [];
      for (let key of keys) {
        tempKeys.push(items[key]);
      }
      worksheet.addRow(tempKeys);
    }

    let fileName = 'REPORT-';
    worksheet.columns = [
      { header: 'Product', key: 'col1', width: 30 },
      { header: 'Category', key: 'col2', width: 20 },
      { header: 'Price', key: 'col3', width: 15 },
      { header: 'rating', key: 'col4', width: 15 },
      { header: 'sales', key: 'col5', width: 10 },
      { header: 'stock', key: 'col6', width: 10 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fileName + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}

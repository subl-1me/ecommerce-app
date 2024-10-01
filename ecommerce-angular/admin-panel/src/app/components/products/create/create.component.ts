import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { Product } from 'src/app/models/product';
import { Config } from '../../../models/config';
import { ConfigService } from 'src/app/services/config/config.service';

// Icons
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

// Services
import { ProductService } from 'src/app/services/product.service';
import { IdentityService } from 'src/app/services/identity.service';

@Component({
  selector: 'app-creatse',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [ProductService, IdentityService, ConfigService],
})
export class CreateComponent implements OnInit, DoCheck {
  // Icons
  faAngleLeft = faAngleLeft;
  faSave = faSave;

  public product: Product;
  public actualConfig: Config;

  public tempCoverImage: any;
  public coverImagePath: string;
  public fileChoosenError: string;
  public fileUploadError: string;

  public editorContent: string;
  public token: any;

  public isEdit: boolean;

  public file = {
    name: '',
    url: '',
    mime: '',
  };

  constructor(
    private _productService: ProductService,
    private _identityService: IdentityService,
    private _configService: ConfigService,
    private _router: Router
  ) {
    this.product = {};
    this.editorContent = '';
    this.token = this._identityService.getToken();
    this.actualConfig = {
      shopName: '',
      serie: '',
      correlation: '',
      logo: '',
      categories: [{ name: 'Shirt' }, { name: 'Hats' }],
    };
    this.fileChoosenError = '';
    this.fileUploadError = '';
    this.coverImagePath = '';
    this.isEdit = false;
  }

  ngOnInit(): void {
    this.getCategories();
  }

  ngDoCheck(): void {}

  public getCategories(): void {
    this._configService.getConfig(this.token).subscribe((response) => {
      this.actualConfig = response.actualConfig[0];
      console.log(this.actualConfig);
    });
  }

  create() {
    if (this.fileChoosenError || !this.tempCoverImage) {
      this.fileUploadError = 'Your product requires a cover image.';
      return;
    }

    console.log(this.product);
    this.product.content = this.editorContent;
    this._productService.create(this.token, this.product).subscribe((res) => {
      this._router.navigate(['/panel/products']);
    });
  }

  public fileChoosen(event: any): void {
    let fileMime = event.target.files[0].type;
    if (!this.isImage(fileMime)) {
      this.fileChoosenError = 'Please, upload a image.';
      return;
    }

    this.tempCoverImage = event.target.files[0];
    var imgElement = document.getElementById('tempImage') as HTMLImageElement;
    var fileReader = new FileReader();

    fileReader.readAsDataURL(this.tempCoverImage);
    fileReader.onload = function () {
      imgElement.src = <string>this.result;
    };
  }

  public uploadCoverImage(): void {
    let formData = new FormData();
    formData.append('image', this.tempCoverImage);

    this._productService
      .uploadCoverImage(this.token, formData)
      .subscribe((response) => {
        if (!response.path) {
          console.log('Error uploading image.');
          return;
        }

        // Create product if image is uploaded
        this.product.coverImage = response.path;
        this.create();
      });
  }

  public isImage(fileMime: string): boolean {
    var mimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/avif',
    ];

    for (let i = 0; i < mimeTypes.length; i++) {
      if (mimeTypes[i] === fileMime) return true;
    }

    return false;
  }
}

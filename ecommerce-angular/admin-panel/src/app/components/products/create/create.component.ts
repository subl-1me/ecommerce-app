import { Component, DoCheck, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { constans } from 'src/app/services/const';

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
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-creatse',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [ProductService, IdentityService, ConfigService],
})
export class CreateComponent implements DoCheck, OnInit {
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

  public previews: SafeUrl[];
  public selectedFiles: File[];

  public isPreviewActive: boolean;
  public isEdit: boolean;
  public tempImageUrl: string;
  public selectedStatus: string;
  public productStatusAxus: string;

  // CONST
  public productStatusList: string[];

  public file = {
    name: '',
    url: '',
    mime: '',
  };

  constructor(
    private _productService: ProductService,
    private _identityService: IdentityService,
    private _configService: ConfigService,
  ) {
    this.productStatusList = constans.productStatusList;
    this.tempImageUrl = '';
    this.previews = [];
    this.productStatusAxus = 'Draft'; // default;
    this.selectedFiles = [];
    this.product = {
      title: '',
      category: '',
      content: '',
      gallery: [],
      status: 'Draft',
      description: '',
      stock: 0,
      price: 0,
    };
    this.selectedStatus = '';
    this.editorContent = '';
    this.token = this._identityService.getToken();
    this.actualConfig = {
      shopName: '',
      serie: '',
      correlation: '',
      logo: '',
      categories: [],
    };
    this.fileChoosenError = '';
    this.fileUploadError = '';
    this.coverImagePath = '';

    this.isEdit = false;
    this.isPreviewActive = false;
  }

  ngDoCheck(): void {}

  ngOnInit(): void {
    this.getCategories();
  }

  public getCategories(): void {
    this._configService.getConfig(this.token).subscribe((response) => {
      this.actualConfig = response.actualConfig[0];
    });
  }

  public async startCreation() {
    if (!this.tempCoverImage) {
      this.fileUploadError = 'Your product requires a cover image.';
      return;
    }

    this.product.status = this.selectedStatus || this.productStatusAxus;
    const formData = new FormData();
    formData.append('image', this.tempCoverImage);
    const uploader = await firstValueFrom(
      this._productService.uploadSingleImage(formData, this.token),
    );

    if (!uploader.success) {
      alert(`There was an error trying to upload cover image.`);
      return;
    }

    this.product.gallery.push({
      tempId: uploader.image.tempId,
      public_id: uploader.image.public_id,
      path: uploader.image.path,
    });
    this._productService.create(this.token, this.product).subscribe((res) => {
      if (res.status !== 'success') {
        alert(res);
        return;
      }
      alert('Product added successfully.');
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

  public discardSelectedPhoto(): void {
    this.tempCoverImage = null;
    this.restoreDefaultCover();
  }

  private restoreDefaultCover(): void {
    var imgElement = document.getElementById('tempImage') as HTMLImageElement;
    if (!imgElement) return;

    imgElement.src = constans.defaultProductCoverImage.path;
  }

  public toggleStatus(status: string): void {
    this.productStatusAxus = status;
    this.selectedStatus = status;
  }

  // private clearPreviews(): void {
  //   this.previews.forEach((prev) => URL.revokeObjectURL(prev));
  //   this.previews = [];
  // }

  // public removeImage(index: number): void {
  //   URL.revokeObjectURL(this.previews[index]);
  //   this.selectedFiles.splice(index, 1);
  //   this.previews.splice(index, 1);
  // }

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

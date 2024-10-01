import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { ProductService } from '../../../services/product.service';
import { IdentityService } from '../../../services/identity.service';

// Models
import { Product } from 'src/app/models/product';

// icons
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [ProductService, IdentityService],
})
export class GalleryComponent implements OnInit {
  // Icons
  faPlus = faPlus;
  faUpload = faUpload;
  faAngleLeft = faAngleLeft;
  faXmark = faXmark;
  faTrash = faTrash;

  public isFileChoosen: boolean;
  public uploadErrorMessage: string;
  public reuploadErrorMessage: string;

  public productID: string;
  public product: Product;
  public token: any;

  public fileData: any[];
  public uploadedImage: string;
  public tempGalleryImages: any[];

  constructor(
    private _productService: ProductService,
    private _identityService: IdentityService,
    private _router: ActivatedRoute
  ) {
    this.isFileChoosen = false;
    this.uploadErrorMessage = '';
    this.token = this._identityService.getToken();
    this.productID = <string>this._router.snapshot.paramMap.get('id');
    this.uploadedImage = '';
    this.tempGalleryImages = [];
    this.reuploadErrorMessage = '';
    this.fileData = [];
    this.product = {};
  }

  ngOnInit(): void {
    this.getProduct();
  }

  public getProduct(): void {
    this._productService
      .getById(this.productID, this.token)
      .subscribe((response) => {
        if (!response.product) return;

        this.product = response.product;
        console.log(this.product);
      });
  }

  public fileChoosen(event: any) {
    if (!event.target.files[0]) {
      console.log('Please add an image');
      return;
    }

    this.isFileChoosen = true;
    let tempData = event.target.files[0];
    for (const data of this.fileData) {
      if (data.size === tempData.size) {
        console.log('Image already choosen.');
        return;
      }
    }

    this.fileData.push(event.target.files[0]);

    var lastIndex = this.fileData.length - 1;
    var fileReader = new FileReader();
    fileReader.readAsDataURL(this.fileData[lastIndex]);
    fileReader.onload = (_event) => {
      this.tempGalleryImages.push(<string>fileReader.result);
    };
  }

  public upload(): void {
    if (!this.isFileChoosen) {
      this.uploadErrorMessage = 'Please, select an image.';
      return;
    }
    this.uploadErrorMessage = '';

    // Upload
    var newGalleryImage = new FormData();
    for (const single_file of this.fileData) {
      newGalleryImage.append('images', single_file);
    }
    this._productService
      .uploadGalleryImage(this.token, newGalleryImage, this.productID)
      .subscribe((response) => {
        if (!response.multipleImages) {
          console.log(response);
          console.log('aqui');
          return;
        }

        this.fileData = [];
        this.onSubmit(response.multipleImages);
      });
  }

  public onSubmit(pathArray: []): void {
    this._productService
      .setGalleryImages(this.token, pathArray, this.productID)
      .subscribe((response) => {
        if (!response.product) return;

        this.product = response.product;
        console.log(this.product);
      });
  }

  public removeTempImage(imagePath: string, index: number): void {
    let image = <string>(
      this.tempGalleryImages.find((element) => element == imagePath)
    );
    let newTempArray: string[] = [];
    let newFilesDataArray = [];

    if (this.fileData.length == 1) {
      this.fileData.pop();
      this.tempGalleryImages.pop();
      return;
    }

    this.tempGalleryImages.forEach((element) => {
      if (element !== image) newTempArray.push(<string>element);
    });

    for (let i = 0; i < this.fileData.length; i++) {
      if (i != index) newFilesDataArray.push(this.fileData[i]);
    }

    this.fileData = newFilesDataArray;
    this.tempGalleryImages = newTempArray;
  }
}

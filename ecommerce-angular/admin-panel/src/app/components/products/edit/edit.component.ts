import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as uniqid from 'uniqid';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Photo {
  tempId: string;
  file?: File;
  url: SafeUrl;
  isCover: boolean;
  toRemove: boolean;
}

// Icons
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

// Services
import { ProductService } from 'src/app/services/product.service';
import { IdentityService } from 'src/app/services/identity.service';
import { ConfigService } from 'src/app/services/config/config.service';

import { Product } from 'src/app/models/product';
import { Config } from 'src/app/models/config';

import { constans } from 'src/app/services/const';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: '../edit/edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ProductService, IdentityService, ConfigService],
})
export class EditProductComponent implements OnInit {
  faSave = faSave;
  faAngleLeft = faAngleLeft;

  public product: Product;
  public actualConfig: Config;

  public coverImage: any;
  public tempCoverImage: any;
  public fileChoosenError: string;
  public fileUploadError: string;
  public isEdit: boolean;
  public editorContent: string;
  public productID: any;
  public token: any;

  public previews: Photo[];
  public previewsAux: Photo[];
  public selectedFiles: File[];
  public lastSelectedCoverImage: string;
  public productStatusList: string[];
  public productStatusAxus: string;
  public selectedNewStatus: string;

  public file = {
    name: '',
    url: '',
    mime: '',
  };

  constructor(
    private _productService: ProductService,
    private _router: ActivatedRoute,
    private _identityServie: IdentityService,
    private _configService: ConfigService,
    private sanitizer: DomSanitizer,
  ) {
    this.previews = [];
    this.lastSelectedCoverImage = '';
    this.previewsAux = [];
    this.selectedFiles = [];
    this.isEdit = true;
    this.product = {
      title: '',
      category: '',
      content: '',
      status: 'Draft',
      gallery: [],
      description: '',
      stock: 0,
      price: 0,
    };
    this.selectedNewStatus = '';
    this.productStatusAxus = this.product.status || 'Draft';
    this.productStatusList = constans.productStatusList;
    this.editorContent = '';
    this.productID = this._router.snapshot.paramMap.get('id');
    this.token = this._identityServie.getToken();
    this.actualConfig = {
      shopName: '',
      serie: '',
      correlation: '',
      logo: '',
      categories: [],
    };
    this.fileChoosenError = '';
    this.fileUploadError = '';
    this.tempCoverImage = '';
  }

  ngOnInit(): void {
    this.getProduct();
    this.getCategories();
  }

  // private handleFilesUploading(): Promise<any> {
  //   const files = this.previewsAux.filter((prev) => prev.file);
  //   if (files.length === 0) {
  //     return [];
  //   }

  // }

  public moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    if (fromIndex === toIndex) return array;
    if (fromIndex < 0 || fromIndex >= array.length) return array;
    if (toIndex < 0 || toIndex >= array.length) return array;

    const [item] = array.splice(fromIndex, 1);
    array.splice(toIndex, 0, item);
    return array;
  }

  private filterRemovedFiles(): void {
    this.product.gallery = this.product.gallery.filter((image) => {
      const item = this.previewsAux.find(
        (prev) => prev.tempId === image.tempId,
      );
      if (!item) return false;
      if (item.toRemove) {
        return false;
      }
      return true;
    });
  }

  private async removeMultipleImages(images: any): Promise<any> {
    const remover = await firstValueFrom(
      this._productService.removeMultipleImages(images, this.token),
    );

    console.log(remover);
  }

  private setCoverToZeroIndex(): void {
    const coverImageInd = this.previewsAux.findIndex((prev) => prev.isCover);
    const sorted = this.moveItem(this.product.gallery, coverImageInd, 0);
    this.product.gallery = [...sorted];
  }

  public async processProductEditing(): Promise<any> {
    const newFiles = this.previewsAux.filter((prev) => prev.file);
    const toRemove = this.product.gallery.filter((image) => {
      const item = this.previewsAux.find(
        (prev) => prev.tempId === image.tempId,
      );
      if (!item) return false;
      if (item.toRemove) {
        return true;
      }
      return false;
    });
    this.filterRemovedFiles();
    // const coverImage = this.previewsAux.find((prev) => prev.isCover);
    // const coverImageAux = this.previewsAux.findIndex(
    //   (prev) => coverImage?.url === prev.url,
    // );

    if (newFiles.length > 0) {
      const formData = new FormData();
      const sorted = [...this.previewsAux]
        .sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0))
        .filter((prev) => !prev.toRemove);
      const PrevWithfiles = sorted.filter((prev) => prev.file);
      PrevWithfiles.forEach((prev) => {
        if (prev.file) {
          formData.append('image', prev.file);
        }
      });
      // upload images if there are
      const uploader = await lastValueFrom(
        this._productService.uploadMultipleImage(formData, this.token),
      );
      if (!uploader.success) {
        alert(uploader.error);
        return;
      }
      const uploads = uploader.uploads;
      this.setCoverToZeroIndex();

      this.product.gallery = [...this.product.gallery, ...uploads];
    }

    // remove images
    if (toRemove.length > 0) {
      await this.removeMultipleImages(toRemove);
    }

    this.setCoverToZeroIndex();
    this.product.status = this.selectedNewStatus || this.productStatusAxus;
    this.sendEdit();
  }

  public sendEdit(): void {
    console.log(this.product);
    this._productService
      .edit(this.token, this.product, this.productID)
      .subscribe((res) => {
        console.log(res);
      });
  }

  public getCategories(): void {
    this._configService.getConfig(this.token).subscribe((response) => {
      this.actualConfig = response.actualConfig[0];
    });
  }

  public hasSelectedCover(): boolean {
    return this.previewsAux.some((prev) => prev.isCover);
  }

  getImage(files: any): void {
    try {
      this.file = {
        name: files[0].originalFile.file.name,
        url: files[0].fileUrl,
        mime: files[0].originalFile.mime,
      };
    } catch (err) {
      console.log('File is not uploaded yet!');
    }
  }

  getProduct(): void {
    this._productService
      .getById(this.productID, this.token)
      .subscribe((res) => {
        if (res.product) {
          this.product = res.product;
          this.loadImagePreviews(res.product);
        } else {
          console.log(res);
        }
      });
  }

  private loadImagePreviews(product: Product): void {
    product.gallery.forEach((image, index) => {
      this.previews.push({
        tempId: image.tempId,
        isCover: index === 0 ? true : false,
        url: image.path,
        toRemove: false,
      });
    });

    this.previewsAux = [...this.previews];
    console.log(this.previewsAux);
  }

  public toggleStatus(status: string): void {
    this.selectedNewStatus = status;
    this.productStatusAxus = status;
  }

  public fileChoosen(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      this.selectedFiles = [...filesArray];
      const newPreviews = filesArray.map((file) => {
        const url = URL.createObjectURL(file);
        return {
          tempId: uniqid.process(),
          file,
          url: this.sanitizer.bypassSecurityTrustUrl(url),
          isCover: false,
          toRemove: false,
        };
      });

      // this.previews.push(...newPreviews); // original
      this.previewsAux.push(...newPreviews);
      console.log(this.previewsAux);
    }
  }
  public trackByFn(index: number, item: any) {
    return index;
  }

  public removePreview(preview: Photo): void {
    console.log(this.previewsAux);
    const prev = this.previewsAux.findIndex(
      (prev) => prev.tempId === preview.tempId,
    );
    if (prev === -1) return;

    if (!preview.file) {
      //  if image is already uploaded to cloud
      this.previewsAux[prev].toRemove = true;
      this.previewsAux[prev].isCover = false;
      return;
    }

    this.previewsAux = this.previewsAux.filter(
      (prev) => prev.tempId !== preview.tempId,
    );
  }

  public toggleCoverImage(preview: Photo): void {
    const setCover = () => {
      // set new
      const indexNewCover = this.previewsAux.findIndex(
        (prev) => prev.tempId === preview.tempId,
      );
      if (indexNewCover === -1) {
        return;
      }

      this.previewsAux[indexNewCover].isCover = true;
    };

    // clear current
    const indexCurrrent = this.previewsAux.findIndex((prev) => prev.isCover);
    if (indexCurrrent === -1) {
      setCover();

      return;
    }

    this.previewsAux[indexCurrrent].isCover = false;
    setCover();
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

  public renderImage(file: any): void {}

  public isImage(fileMime: string): boolean {
    var mimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < mimeTypes.length; i++) {
      if (mimeTypes[i] === fileMime) return true;
    }

    return false;
  }
}

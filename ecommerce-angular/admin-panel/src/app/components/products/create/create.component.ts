import { Component, OnInit } from '@angular/core';
import { constans } from 'src/app/services/const';
import * as uniqid from 'uniqid';
import { DomSanitizer } from '@angular/platform-browser';

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
import { firstValueFrom, lastValueFrom } from 'rxjs';
import Photo from 'src/app/types/Photo';

@Component({
  selector: 'app-creatse',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [ProductService, IdentityService, ConfigService],
})
export class CreateComponent implements OnInit {
  // Icons
  faAngleLeft = faAngleLeft;
  faSave = faSave;

  public product: Product;
  public config: Config = this.getDefaultConfig();

  public newColorName: string = '';
  public newColorHex: string = '#000';
  public colorsMapAux = new Map<string, String>();
  public sizePresets: string[] = ['S', 'M', 'L', 'XL'];
  public sizesSetAux = new Set<string>();
  public selectedSize: string = '';
  public showColorPickerPrompt: boolean = false;
  public showSizeSelectorPrompt: boolean = false;
  public showValuePrompt: boolean = false;

  public variantTypes: Array<{
    name: string;
    values: string[] | Map<string, string>;
  }> = [];

  public newVariantType: string = '';
  public newVariantValue: string = '';
  public variantPresets: string[] = [
    'Size',
    'Color',
    'Material',
    'Capacity',
    'Style',
  ];

  public tempCoverImage: any;
  public coverImagePath: string;
  public fileChoosenError: string;
  public fileUploadError: string;

  public editorContent: string;
  public token: any;

  public previewsAux: Photo[] = [];
  public selectedFiles: File[] = [];

  public isPreviewActive: boolean;
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
    private sanitizer: DomSanitizer,
  ) {
    this.productStatusList = constans.productStatusList;
    this.tempImageUrl = '';
    this.productStatusAxus = 'Draft'; // default;
    this.selectedFiles = [];
    this.product = {
      slug: '',
      category: '',
      fullDesc: '',
      gallery: [],
      status: 'Draft',
      variants: [],
      shortDesc: '',
      stock: [],
      price: 0,
    };
    this.selectedStatus = '';
    this.editorContent = '';
    this.token = '';
    this.fileChoosenError = '';
    this.fileUploadError = '';
    this.coverImagePath = '';

    this.isPreviewActive = false;
  }

  ngOnInit(): void {
    this.getConfig();
  }

  public isArray(values: any): boolean {
    return Array.isArray(values);
  }

  public variantValueType(values: string[] | Map<string, any>): string {
    if (Array.isArray(values)) return 'array';

    if (values instanceof Map) return 'map';

    return 'undefined';
  }

  public toStringArray(values: any): string[] {
    return Array.from(values);
  }

  public isMap(val: any): val is Map<string, string> {
    return val instanceof Map;
  }

  private async getConfig(): Promise<void> {
    const response = await lastValueFrom(
      this._configService.getConfig(this._identityService.getAuth().jwt),
    );

    if (!response.success) {
      alert(response.message);
      return;
    }

    this.config = response.config;
  }

  public addNewVariant(variantPreset?: string): void {
    // search for variant
    const formated = variantPreset
      ? variantPreset.toLocaleLowerCase()
      : this.newVariantType.toLocaleLowerCase();
    const variant = this.variantTypes.find(
      (v) => v.name.toLocaleLowerCase() === formated,
    );
    if (variant) {
      return;
    }

    const presets = ['size', 'color'];
    const isPreset = presets.includes(formated);
    if (isPreset) {
      switch (formated) {
        case 'size':
          // string array
          this.variantTypes.push({
            name: variantPreset || this.newVariantType,
            values: [],
          });
          break;
        case 'color':
          // complex obj
          this.variantTypes.push({
            name: variantPreset || this.newVariantType,
            values: new Map<string, string>(),
          });
          break;
        default:
          break;
      }
    } else {
      // custom complex obj
      // this.variantTypes.push({
      //   name: this.newVariantType,
      //   values: new Map<string, { name: string; hex: string }>(),
      // });
    }

    console.log(this.variantTypes);
    this.newVariantType = '';
  }

  public removeValueFromVariant(index: number, value: string): void {
    const variant = this.variantTypes[index];
    if (!variant) {
      return;
    }

    if (this.isArray(variant.values)) {
      let values = this.toStringArray(variant.values);
      values = values.filter((val) => val !== value);
      this.variantTypes[index].values = [...values];
    }
  }

  public removeVariantType(index: Number): void {}

  public addPresetVariant(preset: string): void {
    this.showColorPickerPrompt = false;
    this.showSizeSelectorPrompt = false;
    this.showValuePrompt = false;
    // load pre-defined data  if exists
    this.addNewVariant(preset);
    if (preset === 'Size') {
      this.showSizeSelectorPrompt = true;
      return;
    }

    if (preset === 'Color') {
      this.showColorPickerPrompt = true;
      return;
    }

    this.showValuePrompt = true;
  }

  public addValueToVariant(variantName: string): void {
    const variant = this.variantTypes.findIndex(
      (v) => v.name.toLocaleLowerCase() === variantName.toLocaleLowerCase(),
    );

    if (variant === -1) {
      alert('Variant not found.');
      return;
    }

    const vValues = this.variantTypes[variant].values;
    // means it controlls size
    if (Array.isArray(vValues)) {
      // check if already exists
      const vValuesString = this.toStringArray(
        this.variantTypes[variant].values,
      );
      const value = vValuesString.includes(this.newVariantValue);
      if (value) return;

      vValuesString.push(this.newVariantValue);
      this.variantTypes[variant].values = [...vValuesString];
      this.newVariantValue = '';
    }

    // custom or preset
    if (vValues instanceof Map) {
      vValues.set(this.newColorHex, this.newColorName);
      this.variantTypes[variant].values = vValues;
      this.newColorHex = '';
      this.newColorName = '';
    }
  }

  public getMapValuesArray(map: Map<string, string>): string[] {
    return Array.from(map.values());
  }

  public getMapKeysArray(map: Map<string, string>): string[] {
    return Array.from(map.keys());
  }

  public getColorNameByHex(
    colorName: string,
    variant: Map<string, string>,
  ): string {
    return variant.get(colorName) || '';
  }

  public isSizeIncludedOnVariant(size: string): boolean {
    const sizes = this.variantTypes.find((variant) => variant.name === 'Size');
    if (!sizes) return false;

    const values = this.toStringArray(sizes.values);
    if (values.includes(size)) return true;
    return false;
  }

  public trackByFn(index: number, item: any) {
    return index;
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

  public getDefaultConfig(): Config {
    return {
      categories: [],
      shopName: 'My Ecommerce Demo', // default
      logo: {
        path: constans.defaultEcommerceLogo.path,
        public_id: constans.defaultEcommerceLogo.public_id,
      },
    };
  }

  public addToColorList(): void {
    // dont reapet names
    if (this.colorsMapAux.has(this.newColorName)) return;

    // dont repeat hex
    const mapArray = Array.from(this.colorsMapAux.values());
    const values = Array.from(this.colorsMapAux.values());
    const entryHex =
      // this.colorsMapAux.set({
      //   name: this.newColorName,
      //   hex: this.newColorHex,
      // });

      (this.newColorHex = '#000');
    this.newColorName = '';
  }

  public removeFromColorList(name: string): void {
    this.colorsMapAux.delete(name);
  }

  public async startCreation() {
    if (this.previewsAux.length === 0) {
      alert('Product need at least 1 image.');
      return;
    }

    const sortedFiles = [...this.previewsAux]
      .sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0))
      .filter((prev) => !prev.toRemove);

    const formData = new FormData();
    sortedFiles.forEach((f) => {
      if (f.file) {
        formData.append('image', f.file);
      }
    });
    const uploader = await firstValueFrom(
      this._productService.uploadMultipleImage(formData, this.token),
    );

    if (!uploader.success) {
      alert(uploader.error);
      return;
    }
    const { uploads } = uploader;
    this.setCoverToZeroIndex(); // re-order
    this.product.gallery = [...this.product.gallery, ...uploads];
    this.product.status = this.selectedStatus || this.productStatusAxus;
    this.product.variants = this.variantTypes;
    const response = await lastValueFrom(
      this._productService.create(
        this._identityService.getAuth().jwt,
        this.product,
      ),
    );

    if (!response.success) {
      alert('Error creating product:' + response.message);
      return;
    }

    alert('Added!');
    console.log(response.product);
  }

  private setCoverToZeroIndex(): void {
    const coverImageInd = this.previewsAux.findIndex((prev) => prev.isCover);
    const sorted = this.moveItem(this.product.gallery, coverImageInd, 0);
    this.product.gallery = [...sorted];
  }

  public moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    if (fromIndex === toIndex) return array;
    if (fromIndex < 0 || fromIndex >= array.length) return array;
    if (toIndex < 0 || toIndex >= array.length) return array;

    const [item] = array.splice(fromIndex, 1);
    array.splice(toIndex, 0, item);
    return array;
  }

  public hasSelectedCover(): boolean {
    return this.previewsAux.some((prev) => prev.isCover);
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

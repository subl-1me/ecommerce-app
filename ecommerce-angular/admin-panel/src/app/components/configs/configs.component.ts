import { Component, OnInit } from '@angular/core';

import { Config } from 'src/app/models/config';
import { constans } from 'src/app/services/const';

import { ConfigService } from 'src/app/services/config/config.service';
import { IdentityService } from 'src/app/services/identity.service';
import { CloudinaryUploadsService } from 'src/app/services/cloudinary-uploads.service';

import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.css'],
  providers: [ConfigService, IdentityService],
})
export class ConfigsComponent implements OnInit {
  public config: Config;
  public token: any;

  public tempLogo: any;

  public logoUploadMessage: string;
  public addCategoryMessage: string;

  public category = { name: '' };

  // Icons
  faAdd = faAdd;
  faSave = faSave;
  faTrash = faTrash;

  constructor(
    private _configService: ConfigService,
    private _identityService: IdentityService,
    private _cloudinaryUploadsService: CloudinaryUploadsService,
  ) {
    this.config = {
      shopName: '',
      serie: '',
      correlation: '',
      logo: {
        public_id: '',
        path: '',
      },
      categories: [],
    };
    this.token = this._identityService.getToken();
    this.logoUploadMessage = '';
    this.addCategoryMessage = '';
  }

  ngOnInit(): void {
    this.getConfig();
  }

  public updateConfig(): void {
    this._configService
      .update(this.token, this.config._id, this.config)
      .subscribe((response) => {
        this.getConfig();
        console.log(response);
      });
  }

  public getConfig(): void {
    this._configService.getConfig(this.token).subscribe((response) => {
      this.config = response.actualConfig[0];
    });
  }

  public isInmutableCategory(category: string | any): boolean {
    return constans.inmutableConfigTestingConfiguration.categories.includes(
      category,
    );
  }

  public addCategory(): void {
    if (this.category.name === '') {
      this.addCategoryMessage = 'Category name cannot be empty.';
      return;
    }

    this._configService
      .addCategory(this.token, this.category, this.config._id)
      .subscribe((response) => {
        this.getConfig();
        this.addCategoryMessage = '';
        this.category.name = '';
      });
  }

  public deleteCategory(category: any): void {
    this._configService
      .deleteCategory(this.token, this.config._id, category)
      .subscribe((response) => {
        this.getConfig();
      });
  }

  public fileChoosen(event: any): void {
    let fileMime = event.target.files[0].type;
    if (!this.isImage(fileMime)) {
      console.log('Please select an image.');
      return;
    }

    this.tempLogo = event.target.files[0];
    var imgElement = document.getElementById('tempImage') as HTMLImageElement;
    var fileReader = new FileReader();

    fileReader.readAsDataURL(this.tempLogo);
    fileReader.onload = function () {
      imgElement.src = <string>this.result;
    };
  }

  public async onSubmit(): Promise<any> {
    let formData = new FormData();

    if (!this.tempLogo) {
      this.updateConfig();
      return;
    }

    formData.append('image', this.tempLogo);
    formData.append(
      'tags',
      [constans.customCloudinaryTags.ecommerce_logo].toString(),
    );

    const uploaderRes = await lastValueFrom(
      this._configService.uploadLogo(this.token, formData),
    );

    if (uploaderRes.success) {
      const isCustomCover = this.config.logo.path !== uploaderRes.image.path;
      if (isCustomCover) {
        const removerRes = await lastValueFrom(
          // remove previous logo
          this._cloudinaryUploadsService.removeImageByPublicID(
            this.config.logo.public_id,
            this.token,
          ),
        );
      }

      // update cover
      this.config.logo.path = uploaderRes.image.path;
      this.config.logo.public_id = uploaderRes.image.public_id;
      this.updateConfig();
    }
  }

  public setDefaultLogo(): void {
    this.config.logo.path = constans.defaultEcommerceLogo.path;
    this.config.logo.public_id = constans.defaultEcommerceLogo.public_id;
  }

  public isImage(fileMime: string): boolean {
    var mimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < mimeTypes.length; i++) {
      if (mimeTypes[i] === fileMime) return true;
    }

    return false;
  }
}

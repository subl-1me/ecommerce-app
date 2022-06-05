import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Icons
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

// Services
import { ProductService } from 'src/app/services/product.service';
import { IdentityService } from 'src/app/services/identity.service';
import { ConfigService } from 'src/app/services/config/config.service';

import { Product } from 'src/app/models/product';
import { Config } from 'src/app/models/config';

@Component({
  selector: 'app-edit',
  templateUrl: '../create/create.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ ProductService, IdentityService, ConfigService ]
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

  public file = {
    name: '',
    url: '',
    mime: ''
  }

  constructor(
    private _productService: ProductService,
    private _router: ActivatedRoute,
    private _identityServie: IdentityService,
    private _configService: ConfigService
  ) {
    this.isEdit = true;
    this.product = {};
    this.editorContent = '';
    this.productID = this._router.snapshot.paramMap.get('id');
    this.token = this._identityServie.getToken();
    this.actualConfig = { shopName: '', serie: '', correlation: '', logo: '', categories: [] };
    this.fileChoosenError = '';
    this.fileUploadError = '';
    this.tempCoverImage = '';
   }

  ngOnInit(): void {
    this.getProduct();
    this.getCategories();
  }

  create():void{
    this.product.content = this.editorContent;
    this._productService.edit(this.token, this.product, this.productID).subscribe((res) => {
      if(!res.product) console.log(res);
      console.log(res);
    })
  }

  public getCategories():void{
    this._configService.getConfig(this.token).subscribe((response) => {
      this.actualConfig = response.actualConfig[0];
      console.log(this.actualConfig);
    })
  }

  getImage(files: any):void{
    try{
      this.file = {
        name: files[0].originalFile.file.name,
        url: files[0].fileUrl,
        mime: files[0].originalFile.mime
      }
    }catch(err){
      console.log('File is not uploaded yet!');
    }
  }

  getProduct():void{
    this._productService.getById(this.productID,  this.token).subscribe((res) => {
      if(res.product){
        this.product = res.product;
        this.editorContent = res.product.content;
      }else{
        console.log(res);
      }
    })
  }

  public uploadCoverImage():void{
    let formData = new FormData();
    formData.append('image', this.tempCoverImage);

    if(!this.tempCoverImage){ // If cover image is not updated
      this.create();
      return;
    }

    this._productService.uploadCoverImage(this.token, formData).subscribe((response) => {
      if(!response.path){
        console.log('Error uploading image.');
        return;
      }
      
      // Create product if image is uploaded
      this.product.coverImage = response.path;
      this.create();
    })
  }

  public fileChoosen(event:any):void{
    let fileMime = event.target.files[0].type;
    if(!this.isImage(fileMime)){
      this.fileChoosenError = 'Please, upload a image.';
      return;
    }

    this.tempCoverImage = event.target.files[0];
    var imgElement = document.getElementById('tempImage') as HTMLImageElement;
    var fileReader = new FileReader();

    fileReader.readAsDataURL(this.tempCoverImage);
    fileReader.onload = function(){
      imgElement.src = <string>this.result;
    }
  }

  public isImage(fileMime:string):boolean{
    var mimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for(let i = 0; i < mimeTypes.length; i++){
      if(mimeTypes[i] === fileMime) return true;
    }

    return false;
  }

}

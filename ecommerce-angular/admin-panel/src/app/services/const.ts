import { HttpHeaders } from '@angular/common/http';

export var constans = {
  defaultUrl: 'http://localhost:4201/api/',
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
  defaultProductCoverImage: {
    _id: 'fcjksqzlvp0d7sfgesb6',
    path: 'https://res.cloudinary.com/dp2ybql9n/image/upload/v1789247598/ecommerce-testing/fcjksqzlvp0d7sfgesb6.jpg',
  },
  endpointsAux: {
    uploadSingleImage: 'upload-single',
    uploadMultipleImage: 'upload-multiple',
    removeMultipleImages: 'remove-multiple-img',
  },
  productStatusList: ['Published', 'Draft', 'Archived'],
  productCoverImageDefault: {
    _id: null,
    path: 'assets/cover-default.svg',
  },
};

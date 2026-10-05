export var constans = {
  defaultUrl: 'http://localhost:4201/api/',
  defaultProductCoverImage: {
    _id: 'fcjksqzlvp0d7sfgesb6',
    path: 'https://res.cloudinary.com/dp2ybql9n/image/upload/v1789247598/ecommerce-testing/fcjksqzlvp0d7sfgesb6.jpg',
  },
  defaultEcommerceLogo: {
    public_id: 'ecommerce-testing/8f373d5e-3b1c-4012-b6a2-add2f816ddce', // public use
    path: 'https://res.cloudinary.com/dp2ybql9n/image/upload/v1790719954/ecommerce-testing/enxsqb7gxvfyls0f1bng.jpg',
  },
  customCloudinaryTags: {
    ecommerce_logo: 'ecommerce_logo_custom',
  },
  endpointsAux: {
    uploadSingleImage: 'upload-single',
    uploadMultipleImage: 'upload-multiple',
    removeByPublicId: 'remove-single-upload',
    removeMultipleImages: 'remove-multiple-img',
    customer: {
      list: 'customer/filter/${filter}/${value}',
      getById: 'customer/${id}',
      editById: 'customer/${id}',
      removeById: 'customer/${id}',
    },
    admLogin: {
      login: 'adm/auth',
      register: 'adm/register',
    },
  },
  allowRoles: ['Admin', 'Moderator'],
  productStatusList: ['Published', 'Draft', 'Archived'],
  productCoverImageDefault: {
    _id: null,
    path: 'assets/cover-default.svg',
  },
  inmutableConfigTestingConfiguration: {
    categories: ['Shirts', 'Hats', 'Shoes', 'Hoddies', 'Gloves'],
  },
};

// export const GLOBAL = {
//   url: 'https://ecommerce-app-1-l8py.onrender.com/api/',
// };

export const GLOBAL = {
  url: process.env['API_URL'] || 'http://localhost:4201/api/',
  productHrefUrl: process.env['productHrefUrl'] || 'http://localhost:4201/api/',
};

export const environment = {
  production: false,
  stripe_pk: process.env['NG_APP_STRIPE_PK'],
  API_URL: process.env['NG_APP_API_URL'] || 'http://localhost:3000/api/',
  URL_LOCAL_SOCKETS:
    process.env['NG_APP_URL_LOCAL_SOCKETS'] || 'http://localhost:3000/api/',
  API_URL_LOCAL: process.env['NG_APP_API_URL_LOCAL'] || 'http://localhost:3000',
};

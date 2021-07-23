// eslint-disable-next-line import/no-mutable-exports
let baseUrl = '';

switch (process.env.NODE_ENV) {
  case 'development':
    baseUrl = '';
    break;
  case 'alpha':
    baseUrl = window.location.origin;
    break;
  case 'production':
    baseUrl = window.location.origin;
    break;
  default:
    baseUrl = '';
    break;
}
console.log(`baseUrl: ${baseUrl}`);
export default baseUrl;

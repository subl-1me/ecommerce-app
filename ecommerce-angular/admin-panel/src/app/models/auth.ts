import Admin from './admin';

export default interface Auth {
  jwt: string;
  admin: Admin;
}

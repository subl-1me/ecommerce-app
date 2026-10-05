export default interface Admin {
  _id?: string;
  username: string;
  email: string;
  role: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

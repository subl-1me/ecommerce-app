export interface Customer {
  sub: number;
  names?: string;
  surnames?: string;
  email?: string;
  dni?: number;
  phone?: string;
  gender?: string;
  notes?: string[];
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

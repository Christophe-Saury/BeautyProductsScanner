import { ProductEntity } from "./product.entity";
import { UserEntity } from "./user.entity";

export interface ProductRequestEntity {
  id: number;
  product?: ProductEntity;
  code: string;
  brand: string;
  name: string;
  categories: string;
  user: UserEntity;
  date: Date;
  state: number;
}

export interface CreateProductRequestEntity {
  code?: string;
  brand?: string;
  name?: string;
  categories?: string;
}
import { UserEntity } from "./user.entity";

export interface ProductEntity {
  id?: number;
  code: string;
  brand: string;
  model: string;
  name: string;
  country: string;
  categories: string;
  url: string;
  grade?: number;
  countGrade?: number;
}

export interface FullCategorie {
  mainCategory: string;
  subCategories: SubCategorie[]
}
  
export interface SubCategorie {
  fullName: string;
  name: string;
  selected: boolean
}

export interface ProductCommentEntity {
  id: number;
  title: string;
  comment: string;
  user: UserEntity;
  date: Date
}
import { IsNotEmpty } from "class-validator";
import { ProductEntity } from "src/entities/product.entity";

export class UpdateProductDto {
    @IsNotEmpty() name: string;
    @IsNotEmpty() brand: string;
}

export class ProductRequestDto {
    name: string;
    brand: string;
    code: string;
    categories: string;
}

export class CreateProductComment {
    @IsNotEmpty() comment: string;
}
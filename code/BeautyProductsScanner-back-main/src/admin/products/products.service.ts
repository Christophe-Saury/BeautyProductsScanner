import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomProductEntity } from 'src/entities/custom_product.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductRequestEntity } from 'src/entities/product_request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminProductsService {

    constructor(
        @InjectRepository(ProductRequestEntity) private readonly productRequestRepo: Repository<ProductRequestEntity>,
        @InjectRepository(CustomProductEntity) private readonly customProductRepo: Repository<CustomProductEntity>,
        @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
        ) {}
        
    async getAll(pageIndex: number): Promise<{products: ProductRequestEntity[]; totalCount: number; totalPages: number}> {

        const pageSize = 20;
        const skip = (pageIndex - 1) * pageSize;
    
        const [products, totalCount] = await this.productRequestRepo.findAndCount({
            skip,
            take: pageSize,
            order: {
                id: 'desc'
            },
            relations: ['user', 'product']
        });
    
        const totalPages = Math.ceil(totalCount / pageSize);
    
        return { products, totalCount, totalPages };
    }

    async get(id: number): Promise<ProductRequestEntity> {
    
        const product = await this.productRequestRepo.findOne({
            where: { id: id},
            relations: ['user', 'product']
        });
    
        return product
    }

    async validateRequest(id: number, state: number): Promise<any> {

        let productId = 0;

        if(state==2){

            const productRequest = await this.productRequestRepo.findOne({where: {id: id}, relations: ['product']})
            
            if(!productRequest){
                return {
                    success: false,
                    message: 'request not found'
                }
            }

            const dataProduct = {
                ...productRequest.name ? {name: productRequest.name} : null,
                ...productRequest.brand ? {brand: productRequest.brand} : null,
                ...productRequest.categories ? {categories: productRequest.categories} : null,
                ...productRequest.code ? {code: productRequest.code} : null,
            }

            //UPDATE PRODUCT
            if(productRequest.product){

                if(!await this.customProductRepo.findOne({where: {product: {id: productRequest.product.id}}})){
                    await this.customProductRepo.save({product: {id: productRequest.product.id}})
                } 

                productId = productRequest.product.id

                await this.customProductRepo.update({product: {id: productRequest.product.id}}, dataProduct)

            }

            //CREATE PRODUCT
            else {
                const product = await this.productRepo.save(dataProduct)
                productId = product.id
            }


        }
    
        await this.productRequestRepo.update({id: id}, {state: state})
    
        return {
            success: true,
            message: 'request updated',
            productId: productId
        }
    }

}

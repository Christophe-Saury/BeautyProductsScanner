import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductComment, ProductRequestDto, UpdateProductDto } from 'src/dto/product.dto';
import { UserDto } from 'src/dto/user.dto';
import { CustomProductEntity } from 'src/entities/custom_product.entity';
import { FullCategorie, ProductEntity } from 'src/entities/product.entity';
import { ProductCommentEntity } from 'src/entities/product_comment.entity';
import { ProductGradeEntity } from 'src/entities/product_grade.entity';
import { ProductRequestEntity } from 'src/entities/product_request.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ConcreteProductView } from 'src/views/concrete_product.view';
import { Repository, Like, In, Not, Raw, DeleteResult } from 'typeorm';

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(ProductEntity) private readonly productsRepo: Repository<ProductEntity>,
        @InjectRepository(CustomProductEntity) private readonly customProductRepo: Repository<CustomProductEntity>,
        @InjectRepository(ConcreteProductView) private readonly productsViewRepo: Repository<ConcreteProductView>,
        @InjectRepository(ProductGradeEntity) private readonly productGradeRepo: Repository<ProductGradeEntity>,
        @InjectRepository(ProductRequestEntity) private readonly productRequestRepo: Repository<ProductRequestEntity>,
        @InjectRepository(ProductCommentEntity) private readonly productCommentRepo: Repository<ProductCommentEntity>,
        ) {}

    async search(filter: any, pageIndex: number): Promise<{products: ConcreteProductView[]; totalCount: number; totalPages: number}> {

        const pageSize = 100;
        const skip = (pageIndex - 1) * pageSize;

        let queryBuilder = this.productsViewRepo
            .createQueryBuilder()
            .select('id, name')
            .skip(skip)
            .take(pageSize);

        if(filter.text)
            queryBuilder = queryBuilder.where("name like :name", { name:`%${filter.text}%` });

        if(filter.categories){
            queryBuilder = queryBuilder.andWhere(
                "categories IN (:cat)", { cat: filter.categories.split(";") }
            )
        }
      
        const [products, totalCount] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(totalCount / pageSize);

        return { products: await queryBuilder.execute(), totalCount: totalCount, totalPages: totalPages };
    }

    async getHomeData(): Promise<{mostLiked: ConcreteProductView[]; mostCommented: ConcreteProductView[]}> {

        const limit = 20; // Nombre de résultats souhaite

        const mostLiked = await this.productsViewRepo.find({
            where: {
                grade: Not(0)
            },
            order: {
                grade: 'desc'
            },
            take: limit
        })

        const query = `
        SELECT cpv.id, cpv.name
        FROM concrete_product_view cpv
        RIGHT JOIN product_comment pc ON cpv.id = pc.productId
        GROUP BY cpv.id
        ORDER BY COUNT(pc.productId) DESC
        LIMIT ${limit}
            `;

        const mostCommented = await this.productsViewRepo.query(query);
      
        return { mostLiked: mostLiked, mostCommented: mostCommented };
    }

    async getCategories(): Promise<FullCategorie[]> {

        const products = await this.productsViewRepo.find({});

        let categories: FullCategorie[] = []
        products.forEach(p => {
            p.categories.split(";").forEach(c => {
  
              const catName = c.split(">")[0]
              const subCar = c.split(">")[1]
  
              if(categories.find(f => f.mainCategory == catName)){
                if(!categories.find(f => f.mainCategory == catName)?.subCategories.find(f => f.name == subCar))
                categories.find(f => f.mainCategory == catName)?.subCategories.push({name: subCar, fullName: c, selected: false})
              } else {
                categories.push({
                  mainCategory: catName,
                  subCategories: subCar ? [{name: subCar, fullName: c, selected: false}] : [],
                })
              }
            })
          })

        return categories;
    }

    async getProduct(filter: any): Promise<{product: any, comments: ProductCommentEntity[]}> {

        const product = await this.productsViewRepo.findOne({
            where: filter
        });

        if(product){
            const comments = await this.productCommentRepo.find({
                where: {
                    product: {id: product.id}
                },
                relations: ['user'],
                select: {
                    id: true, 
                    comment: true, 
                    date: true, 
                    user : {
                        name: true, 
                        lastname: true, 
                        id: true, 
                    }
                },
                order: {
                    id: 'desc'
                }
            })

            return {product: product, comments: comments}
        } else {
            return {product: null, comments: []}
        }
       
    }

    async updateProduct(productId: number, updateProductDto: UpdateProductDto): Promise<any> {

        if(!await this.customProductRepo.findOne({where: {id: productId}})){
            await this.customProductRepo.save({id: productId, ...updateProductDto})

            return {
                success: true,
                message: 'product updated'
            }
        } 

        if(await this.customProductRepo.update({id: productId}, updateProductDto)){
            return {
                success: true,
                message: 'product updated'
            }
        } else {
            return {
                success: false,
                message: 'product not updated'
            }
        }
    }

    async setGradeProduct(userId: UserDto, productId: number, grade: number): Promise<any> {

        if(!await this.customProductRepo.findOne({where: {product: {id: productId}}})){
            await this.customProductRepo.save({product: {id: productId}})
        } 

        if(await this.productGradeRepo.findOne({where : {
            product: {id: productId},
            user: userId
        }})){
            await this.productGradeRepo.update({ product: {id: productId}, user: userId }, {grade: grade})
        } else {
            await this.productGradeRepo.save({
                product: {id: productId},
                user: userId,
                grade: grade
            })
        }

        const finalEntity = (await this.productsViewRepo.findOne({where: {id: productId}}))

        return {
            success: true,
            message: "grade updated",
            grade: finalEntity.grade,
            countGrade: finalEntity.countGrade
        }
    }

    async requestProduct(user: UserDto, productId: number, productData: ProductRequestDto): Promise<any>{

        let product: ProductEntity | undefined;

        if(productId){
            product = await this.productsRepo.findOne({where: {id: productId}})

            if(!product){
                return {
                    success: false,
                    message: 'enable to find product'
                }
            }
        }
       
        this.productRequestRepo.save({
            user: user,
            date: new Date(),
            ...product ? {product: product} : null,
            ...productData
        })
 
        return {
            success: true,
            message: 'request submitted'
        }
    }

    async addComment(user: UserEntity, productId: number, comment: CreateProductComment): Promise<any>{

        const product = await this.productsRepo.findOne({
            where: {id: productId}
        })

        if(!product){
            return {
                success: false,
                message: "enable to find product"
            }
        }

        const commentEntity = await this.productCommentRepo.save({
            product: product,
            date: new Date(),
            user: user,
            ...comment
        })
 
        return {
            success: true,
            message: 'comment created',
            comment: commentEntity
        }
    }

    async deleteComment(user: UserEntity, productId: number, commentId: number): Promise<any>{

        let rep!:DeleteResult

        if(user.role == 'admin'){
            rep = await this.productCommentRepo.delete({
                id: commentId,
            })
        } else {
            rep = await this.productCommentRepo.delete({
                id: commentId,
                user: {id: user.id}
            })
        }

       if(rep.affected == 0){
        return {
            success: false,
            message: 'comment not deleted'
        }
       }
 
        return {
            success: true,
            message: 'comment deleted'
        }
    }
}
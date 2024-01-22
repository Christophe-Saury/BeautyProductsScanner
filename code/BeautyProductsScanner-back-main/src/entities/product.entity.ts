import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, Index } from "typeorm";
import { CustomProductEntity } from "./custom_product.entity";
import { ProductGradeEntity } from "./product_grade.entity";
import { ProductCommentEntity } from "./product_comment.entity";

@Entity('product')
export class ProductEntity {  

    @PrimaryGeneratedColumn() 
    id: number;    

    @Column({ 
        name: 'code',
        type: 'varchar', 
        nullable: true,
        // unique: true
    }) 
    code: string;

    @Column({ 
        name: 'brand',
        type: 'varchar', 
        nullable: true
    }) 
    brand: string;

    @Column({ 
        name: 'model',
        type: 'varchar', 
        nullable: true
    }) 
    model: string;

    @Column({ 
        name: 'name',
        type: 'varchar', 
        nullable: true
    }) 
    name: string;

    @Column({ 
        name: 'last_updated',
        type: 'varchar', 
        nullable: true
    }) 
    lastUpdated: string;

    @Column({ 
        name: 'gs1_country',
        type: 'varchar', 
        nullable: true
    }) 
    countryCode: string;

    @Column({ 
        name: 'gtinType',
        type: 'varchar', 
        nullable: true
    }) 
    gtinType: string;

    @Column({ 
        name: 'offers_count',
        type: 'varchar', 
        nullable: true
    }) 
    offersCount: string;

    @Column({ 
        name: 'min_price',
        type: 'varchar', 
        nullable: true
    }) 
    minPrice: string;

    @Column({ 
        name: 'min_price_compensation',
        type: 'varchar', 
        nullable: true
    }) 
    minPriceCompensation: string;

    @Column({ 
        name: 'currency',
        type: 'varchar', 
        nullable: true
    }) 
    currency: string;

    @Column({ 
        name: 'categories',
        type: 'tinytext', 
        nullable: true
    }) 
    categories: string;

    @Column({ 
        name: 'url',
        type: 'varchar', 
        nullable: true
    }) 
    url: string;

    @OneToOne(() => CustomProductEntity, (product) => product.product) 
    customProduct: CustomProductEntity

    @OneToMany(() => ProductGradeEntity, grade => grade.product, { nullable: true, onDelete: "CASCADE"})
    grades: ProductGradeEntity[]

    @OneToMany(() => ProductCommentEntity, comment => comment.product, { nullable: true, onDelete: "CASCADE"})
    comments: ProductCommentEntity[]
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
  
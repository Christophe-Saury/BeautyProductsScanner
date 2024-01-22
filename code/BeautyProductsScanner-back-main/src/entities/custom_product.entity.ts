import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Index } from "typeorm";
import { ProductEntity } from "./product.entity";
import { ProductGradeEntity } from "./product_grade.entity";

@Entity('custom_product')
export class CustomProductEntity {  

    @PrimaryGeneratedColumn() 
    id: number;    

    @OneToOne(() => ProductEntity)
    @JoinColumn() 
    product: ProductEntity;

    @Column({ 
        name: 'name',
        type: 'varchar', 
        nullable: true
    })
    name: string;

    @Column({ 
        name: 'brand',
        type: 'varchar', 
        nullable: true
    }) 
    brand: string;

    @Column({ 
        name: 'code',
        type: 'varchar', 
        nullable: true
    }) 
    code: string;

    @Column({ 
        name: 'categories',
        type: 'tinytext', 
        nullable: true,
    })
    categories: string;

    @Column({ 
        name: 'url',
        type: 'varchar', 
        nullable: true
    }) 
    url: string;
}

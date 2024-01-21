import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne } from "typeorm";
import { CustomProductEntity } from "./custom_product.entity";
import { UserEntity } from "./user.entity";
import { ProductEntity } from "./product.entity";

@Entity('product_grade')
export class ProductGradeEntity {  

    @PrimaryGeneratedColumn() 
    id: number;    

    @Column({ 
        name: 'grade',
        type: 'int', 
        nullable: false
    }) 
    grade: number;

    @ManyToOne(() => ProductEntity, product => product.id, {onDelete: "CASCADE"})
    product: ProductEntity;

    @ManyToOne(() => UserEntity, user => user.id, {onDelete: "CASCADE"}) 
    user: UserEntity;
}
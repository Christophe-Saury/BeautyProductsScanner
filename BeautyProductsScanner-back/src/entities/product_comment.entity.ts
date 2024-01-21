import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { ProductEntity } from "./product.entity";

@Entity('product_comment')
export class ProductCommentEntity {  

    @PrimaryGeneratedColumn() 
    id: number;    

    @Column({ 
        name: 'comment',
        type: 'text', 
        nullable: false
    }) 
    comment: string;

    @Column({ 
        type: 'datetime', 
        nullable: false
    })
    date: Date;

    @ManyToOne(() => ProductEntity, product => product.id, {onDelete: "CASCADE"})
    product: ProductEntity;

    @ManyToOne(() => UserEntity, user => user.id, {onDelete: "CASCADE"}) 
    user: UserEntity;
}
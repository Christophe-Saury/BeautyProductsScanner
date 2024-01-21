import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { ProductEntity } from "./product.entity";
import { ProductGradeEntity } from "./product_grade.entity";
import { UserEntity } from "./user.entity";

@Entity('product_request')
export class ProductRequestEntity {  

    @PrimaryGeneratedColumn() 
    id: number;    

    @ManyToOne(() => ProductEntity, product => product.id, {onDelete: "CASCADE"}) 
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
        name: 'date',
        type: 'date', 
        nullable: false,
    })
    date: Date;

    @Column({ 
        name: 'state',
        type: 'int', 
        nullable: false,
        default: 0
    }) 
    state: number;

    @ManyToOne(() => UserEntity, user => user.id, {onDelete: "CASCADE"}) 
    user: UserEntity;

}

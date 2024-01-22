import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Exclude } from "class-transformer";
import { ProductGradeEntity } from "./product_grade.entity";
import { ProductRequestEntity } from "./product_request.entity";
import { ProductCommentEntity } from "./product_comment.entity";

@Entity('user')
export class UserEntity {  

    @PrimaryGeneratedColumn() 
    id: number;  
 
    @Column({ 
        type: 'varchar', 
        nullable: false
    }) 
    name: string;

    @Column({ 
        type: 'varchar', 
        nullable: false 
    }) 
    lastname: string;

    @Exclude()
    @Column({ 
        type: 'varchar', 
        nullable: false ,
    }) 
    password: string;

    @Column({ 
        type: 'varchar', 
        nullable: false , 
        unique: true 
    })
    email: string;

    @Column({ 
        type: 'varchar', 
        nullable: false,
        default: 'user'
    })
    role: string;

    @Column({ 
        type: 'date', 
        nullable: false
    })
    dateSignIn: Date;

    @Exclude()
    @Column({
        nullable: true,
    })
    refreshToken: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);  
    }

    @OneToMany(() => ProductGradeEntity, grade => grade.user, { nullable: true, onDelete: "CASCADE"})
    grades: ProductGradeEntity[]

    @OneToMany(() => ProductCommentEntity, comment => comment.user, { nullable: true, onDelete: "CASCADE"})
    comments: ProductCommentEntity[]

    @OneToMany(() => ProductRequestEntity, request => request.user, { nullable: true, onDelete: "CASCADE"})
    productRequest: ProductRequestEntity[]
}

import { Module, UseGuards } from '@nestjs/common';
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';
import { UserEntity } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { CustomProductEntity } from 'src/entities/custom_product.entity';
import { ConcreteProductView } from 'src/views/concrete_product.view';
import { UsersService } from './users/users.service';
import { ProductGradeEntity } from 'src/entities/product_grade.entity';
import { ProductRequestEntity } from 'src/entities/product_request.entity';
import { UsersController } from './users/users.controller';
import { AdminModule } from 'src/admin/admin.module';
import { ProductCommentEntity } from 'src/entities/product_comment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
          UserEntity, 
          ProductEntity,
          CustomProductEntity,
          ConcreteProductView,
          ProductGradeEntity ,
          ProductRequestEntity,
          ProductCommentEntity
        ]),
        AdminModule
      ],
      controllers: [
        ProductsController,
        UsersController
      ],
      providers: [
        ProductsService,
        UsersService,    
      ],
})
export class DashboardModule {}


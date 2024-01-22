import { Module, UseGuards } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { AdminUsersController } from './users/users.controller';
import { AdminUsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { CustomProductEntity } from 'src/entities/custom_product.entity';
import { ConcreteProductView } from 'src/views/concrete_product.view';
import { ProductGradeEntity } from 'src/entities/product_grade.entity';
import { ProductRequestEntity } from 'src/entities/product_request.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AdminProductsController } from './products/products.controller';
import { AdminProductsService } from './products/products.service';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guards';
import { Roles } from 'src/shared/decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity, 
      ProductEntity,
      CustomProductEntity,
      ConcreteProductView,
      ProductGradeEntity ,
      ProductRequestEntity
    ]),
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    AdminUsersService,
    AdminProductsService,
  ],
  controllers: [
      AdminUsersController,
      AdminProductsController
  ],
  
    
  })
export class AdminModule {}
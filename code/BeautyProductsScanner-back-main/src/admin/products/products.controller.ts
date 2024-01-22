import { AdminProductsService } from './products.service';
import { Controller, Get, Req, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guards';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { UserDto } from 'src/dto/user.dto';
import { ProductRequestEntity } from 'src/entities/product_request.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Roles, User } from 'src/shared/decorator';

@Controller('admin/products')
@UseGuards(AccessTokenGuard)
export class AdminProductsController {

    constructor(private readonly adminProductsService: AdminProductsService) {}

    @Get('getAll/:page')  
    @UseGuards(RolesGuard)
    @Roles('admin')
    public async getAll(@User() user: UserEntity, @Param('page') page:number) : Promise<{products: ProductRequestEntity[]; totalCount: number; totalPages: number}> {    
        return this.adminProductsService.getAll(page);
    }

    @Get('get/:id')  
    @UseGuards(RolesGuard)
    @Roles('admin')
    public async get(@Param('id') id:number) : Promise<ProductRequestEntity> {    
        return this.adminProductsService.get(id);
    }

    @Put('request/:id/:state')  
    @UseGuards(RolesGuard)
    @Roles('admin')
    public async confirmRequest(@Param('id') id:number, @Param('state') state:number) : Promise<ProductRequestEntity> {    
        return this.adminProductsService.validateRequest(id, state);
    }

}

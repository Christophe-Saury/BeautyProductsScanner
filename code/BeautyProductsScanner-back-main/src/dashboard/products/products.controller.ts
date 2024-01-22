import { Controller, Get, Req, Query, Put, Body, Param, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductComment, ProductRequestDto, UpdateProductDto } from 'src/dto/product.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guards';
import { UserEntity } from 'src/entities/user.entity';
import { User } from 'src/shared/decorator';

@Controller('products')
@UseGuards(AccessTokenGuard)
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Get('home')  
    public async home() : Promise<any> {    
        return this.productsService.getHomeData();
    }

    @Get('search/:page')  
    public async search(@Query("filter") filter: any, @Param('page') page: number) : Promise<any> {    
        return this.productsService.search(JSON.parse(decodeURIComponent(filter)), page);
    }

    @Get('get-categories')  
    public async getCategories() : Promise<any> {    
        return this.productsService.getCategories();
    }

    @Get('get-product')  
    public async getProduct(@Query("code") barcode: string, @Query("id") id: number) : Promise<any> {   
        const filter = {
            ...id ? { id: id} : null,
            ...barcode ? { code: barcode} : null
        }
        return this.productsService.getProduct(filter);
    }

    @Put('grade/:id')
    public async gradeProduct(@Req() req: any, @Param("id") idProduct: number, @Body("grade") grade: number) : Promise<any> {    
        const user = req.user;
        return this.productsService.setGradeProduct(user, idProduct, grade);
    }

    @Post(':id/request')
    public async requestProduct(@User() user: UserEntity, @Param("id") idProduct: number, @Body() product: ProductRequestDto) : Promise<any> {    
        return this.productsService.requestProduct(user, idProduct, product);
    } 

    @Post('create-product')
    public async createProduct(@User() user: UserEntity, @Body() product: ProductRequestDto) : Promise<any> {    
        return this.productsService.requestProduct(user, undefined, product);
    } 

    @Post(':id/add-comment')
    public async addComment(@User() user: UserEntity, @Param("id") idProduct: number, @Body() comment: CreateProductComment) : Promise<any> {    
        return this.productsService.addComment(user, idProduct, comment);
    } 

    @Put(':id/comments/:comment/delete')
    public async deleteComment(@User() user: UserEntity, @Param("id") idProduct: number, @Param("comment") idComment: number) : Promise<any> {    
        return this.productsService.deleteComment(user, idProduct, idComment);
    } 

}

import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors, Get, Req, Put, Body, Param } from '@nestjs/common';
import { AdminUsersService } from './users.service';
import { UserEntity } from 'src/entities/user.entity';
import { Roles, User } from 'src/shared/decorator';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guards';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { UpdateAdminUserDto } from 'src/dto/user.dto';

@Controller('admin/users')
@UseGuards(AccessTokenGuard)
export class AdminUsersController {

    constructor(private readonly adminUsersService: AdminUsersService) {}

    @Get('getAll/:page') 
    @UseGuards(RolesGuard)
    @Roles('admin')
    public async getAll(@Param('page') page:number) : Promise<{users: UserEntity[]; totalCount: number; totalPages: number}> {    
        return this.adminUsersService.getAll(page);
    }

    @Get('get/:id')  
    @UseGuards(RolesGuard)
    @Roles('admin')
    public async get(@Param('id') id:number) : Promise<UserEntity> {    
        return this.adminUsersService.get(id);
    }

    @Put('update/:id')  
    @UseGuards(RolesGuard)
    @Roles('admin')
    public async update(@Param('id') id:number, @Body() user: UpdateAdminUserDto) : Promise<UserEntity> {    
        return this.adminUsersService.update(id, user);
    }

    @Put('resetPassword/:id')  
    @UseGuards(RolesGuard)
    @Roles('admin')
    public async resetPassword(@Param('id') id:number, @Body('password') password: string) : Promise<UserEntity> {  
        return this.adminUsersService.resetPassword(id, password);
    }
}

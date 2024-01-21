import { Controller, Get, Req, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/dto/user.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guards';
import { User } from 'src/shared/decorator';
import { UserEntity } from 'src/entities/user.entity';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get('get')  
    public async search(@User() user: UserEntity) : Promise<any> {    
        return this.usersService.getUser(user);
    }

    @Put('update')  
    public async update(@User() user: UserEntity, @Body() updateUser: UpdateUserDto) : Promise<any> {    
        return this.usersService.updateUser(user, updateUser);
    }

    @Put('updatePassword')  
    public async updatePassword(@User() user: UserEntity, @Body('password') password: string) : Promise<UserEntity> {  
        return this.usersService.updatePassword(user, password);
    }
}

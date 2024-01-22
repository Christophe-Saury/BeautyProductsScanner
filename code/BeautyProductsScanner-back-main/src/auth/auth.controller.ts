import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { LoginStatus, RegistrationStatus } from './auth.interface';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/accessToken.guards';
import { RefreshTokenGuard } from './guards/refreshToken.guards';
import { CreateUserDto, LoginUserDto } from 'src/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')  
    public async register(@Body() createUserDto: CreateUserDto): Promise<RegistrationStatus> {    
        const result: RegistrationStatus = await this.authService.register(createUserDto,);
        if (!result.success) {
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);    
        }
        return result;  
    }
      
    @Post('login')  
    public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
        return await this.authService.login(loginUserDto); 
    }

    @UseGuards(AccessTokenGuard)
    @Get('logout')
    logout(@Req() req: any) {
        return this.authService.logout(req.user['id']);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refreshToken')
    refreshTokens(@Req() req: any) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}

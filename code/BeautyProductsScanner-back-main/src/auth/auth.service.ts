import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto, UserDto } from 'src/dto/user.dto';
import { JwtPayload, LoginStatus, LogoutStatus, RegistrationStatus } from './auth.interface';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private readonly jwtService: JwtService,  ) {}

    async register(userDto: CreateUserDto): Promise<RegistrationStatus> {

        let status: RegistrationStatus = {
            success: true,   
            message: 'user registered',
        };

        try {
            const user = await this.usersService.create(userDto);

            const tokens = await this.getTokens(user.id, user.email);
            await this.updateRefreshToken(user.id, tokens.refreshToken);

            return {
                success: true,   
                message: 'user registered',
                token: tokens
            }
        } catch (err) {
            status = {
                success: false,        
                message: err,
            };    
        }
        
        return status;
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {    
        // find user in db    
        const user = await this.usersService.findByLogin(loginUserDto);

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        
        return {
            success: true,
            message: 'success',
            user: user, 
            ...tokens,    
        };  
    }

    async logout(userId: number): Promise<LogoutStatus> {
        this.usersService.update(userId, { refreshToken: null });
        return {
            success: true,
            message: "Logged out"
        }
    }

    async validateUser(payload: JwtPayload): Promise<UserDto> {
        const user = await this.usersService.findByPayload(payload);    
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);    
        }    
        return user;  
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.update(userId, { refreshToken: hashedRefreshToken, });
    }

    async getTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              email,
            },
            {
              secret: process.env.JWT_ACCESS_SECRET,
              expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
            },
          ),
          this.jwtService.signAsync(
            {
              sub: userId,
              email,
            },
            {
              secret: process.env.JWT_REFRESH_SECRET,
              expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
            },
          ),
        ]);
    
        return {
          accessToken,
          refreshToken,
        };
    }

    async refreshTokens(userId: string, refreshToken: string) {
      const user = await this.usersService.findOne({where: {id: userId}});

      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access Denied');
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return {...tokens, ...{user: user}};
    }
}

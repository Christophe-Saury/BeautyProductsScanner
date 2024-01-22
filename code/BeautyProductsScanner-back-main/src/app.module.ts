import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './auth/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AccessTokenGuard } from './auth/guards/accessToken.guards';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      type: 'mysql',
      database: process.env.MYSQL_DB,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      entities: [__dirname + '/**/*{.entity,.view}{.ts,.js}'],
      synchronize: process.env.SYNCHRONIZE_DB == 'true',
      logging: ['error'],
      cache: false
    }),
    TypeOrmModule.forFeature([
            
    ]),
    ConfigModule.forRoot(),
    AuthModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
  
}

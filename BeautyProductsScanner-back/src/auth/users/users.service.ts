import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, UpdateUserAuthDto, UserDto, toUserDto } from 'src/dto/user.dto';

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(UserEntity)    
        private readonly userRepo: Repository<UserEntity>, ) {}

    async findOne(options?: any): Promise<UserEntity> {
        const user =  await this.userRepo.findOne(options);    
        return user;  
    }

    async findByLogin({ email, password }: LoginUserDto): Promise<UserEntity> {   
        
        const user = await this.userRepo.findOne({ where: { email: email } });
        if (!user || user.email != email) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);    
        }
        
        // compare passwords    
        const areEqual = bcrypt.compareSync(password, user.password)
        
        if (!areEqual) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);    
        }
        
        return user;  
    }

    async findByPayload({ email }: any): Promise<UserDto> {
        return await this.findOne({ 
            where:  { email:email } });  
    }

    async create(userDto: CreateUserDto): Promise<UserDto> {    
        const { name, lastname, password, email } = userDto;
        
        // check if the user exists in the db    
        const userInDb = await this.userRepo.findOne({ 
            where: { email } 
        });
        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const user: UserEntity = this.userRepo.create({ name, lastname, password, email, dateSignIn: new Date()});
        await this.userRepo.save(user);
        return toUserDto(user);  
    }

    async update(id: number, updateUserDto: UpdateUserAuthDto, ): Promise<any> {
        return this.userRepo.update(id, updateUserDto)
      }
}



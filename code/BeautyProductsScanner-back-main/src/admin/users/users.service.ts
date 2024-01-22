import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAdminUserDto, UserDto } from 'src/dto/user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository, Like, In, Raw } from 'typeorm';

@Injectable()
export class AdminUsersService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
        ) {}
        
    async getAll(pageIndex: number): Promise<{users: UserEntity[]; totalCount: number; totalPages: number}> {

        const pageSize = 20;
        const skip = (pageIndex - 1) * pageSize;
    
        const [users, totalCount] = await this.userRepo.findAndCount({
            skip,
            take: pageSize,
            order: {
                role: 'asc'
            },
            select: ['name', 'lastname', 'email', 'dateSignIn', 'role', 'id']
        });
    
        const totalPages = Math.ceil(totalCount / pageSize);
    
        return { users, totalCount, totalPages };
    }

    async get(id: number): Promise<UserEntity> {
    
        const user = await this.userRepo.findOne({
            where: { id: id}
        });
    
        return user
    }

    async update(id: number, user: UpdateAdminUserDto): Promise<any> {
    
        await this.userRepo.update({id: id}, user)
    
        return {
            success: true,
            message: 'user updated'
        }
    }

    async resetPassword(id: number, password: string): Promise<any> {
    
        let newUser = { password: password };
        const userDto = this.userRepo.create(newUser)
        const userAccount = this.userRepo.update(
            {
                id: id,
            },
            userDto 
        );
    
        return {
            success: true,
            message: 'password updated'
        }
    }
}

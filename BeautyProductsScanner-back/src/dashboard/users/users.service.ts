import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto, UserDto } from 'src/dto/user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository, Like, In, Raw } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
        ) {}


        async getUser(userDto: UserDto): Promise<UserEntity> {

            const user = await this.userRepo.findOne({
                where: {
                  id: userDto.id
                }
            });

            return user
        }

        async updateUser(user: UserDto, updateUserDto: UpdateUserDto): Promise<any> {

            if(await this.userRepo.update({id: user.id}, updateUserDto)){
                return {
                    success: true,
                    message: 'user updated'
                }
            } else {
                return {
                    success: false,
                    message: 'user not updated'
                }
            }
        }

        async updatePassword(user: UserEntity, password: string): Promise<any> {
            let newUser = { password: password };
            const userDto = this.userRepo.create(newUser)
            const userAccount = this.userRepo.update(
                {
                    id: user.id,
                },
                userDto 
            );
        
            return {
                success: true,
                message: 'password updated'
            }
        }
}

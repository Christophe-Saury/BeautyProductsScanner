import { IsEmail, IsNotEmpty } from "class-validator";
import { UserEntity } from "src/entities/user.entity";

export class CreateUserDto {  
    @IsNotEmpty()  name: string;
    @IsNotEmpty()  lastname: string;
    @IsNotEmpty()  password: string;
    @IsNotEmpty()  @IsEmail()  email: string;    
}

export class LoginUserDto {  
    @IsNotEmpty()  readonly email: string;
    @IsNotEmpty()  readonly password: string;
}

export class UserDto {  
    @IsNotEmpty()  id: number;
    @IsNotEmpty()  name: string;
    @IsNotEmpty()  lastname: string;
    @IsNotEmpty()  @IsEmail()  email: string;
}

export class UpdateUserAuthDto {
    id?: number;
    refreshToken: string
}

export const toUserDto = (data: UserEntity): UserDto => {  
    const { id, name, lastname, email} = data;
    let userDto: UserDto = { id, name, lastname, email };
    return userDto;
};

export class UpdateUserDto {
    @IsNotEmpty()  name: string;
    @IsNotEmpty()  lastname: string;
}

export class UpdateAdminUserDto {
    name: string;
    lastname: string;
    email: string;
    role: string
}
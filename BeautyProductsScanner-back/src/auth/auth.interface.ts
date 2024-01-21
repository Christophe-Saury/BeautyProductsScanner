import { UserEntity } from "src/entities/user.entity";

export interface JwtPayload { email: string;}

export interface RegistrationStatus {  
    success: boolean;  
    message: string;
    token?: any
}

export interface LoginStatus {  
    success: boolean;  
    message: string;
    user?: UserEntity;
    tokens?: any
}

export interface LogoutStatus {
    success: boolean,
    message: "Logged out"
}
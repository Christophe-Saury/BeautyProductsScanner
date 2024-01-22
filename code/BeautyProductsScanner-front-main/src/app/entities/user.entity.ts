export interface UserEntity {
    id?: string;
    name: string;
    lastname: string;
    email: string;
    role: string;
    dateSignIn: Date
}

export interface UserUpdate {
    name: string;
    lastname: string;
}

export interface UserUpdateAdmin {
    name: string;
    lastname: string;
    email: string;
    role: string;
}
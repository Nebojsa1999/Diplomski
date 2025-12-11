import { User } from "../user/user.model";


export interface LoginDto {
    username: string;
    password: string;
}

export interface SignInResponse {
    user: User;
    token: string;
    refreshToken: string;
}

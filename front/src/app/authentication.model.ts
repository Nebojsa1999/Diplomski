export class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;

    constructor(user: UserDto) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
    }
}


export interface LoginDto {
    username: string;
    password: string;
}

export interface SignInResponse {
    user: UserDto;
    refreshToken: string;
}

export interface UserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    verified: boolean;
}

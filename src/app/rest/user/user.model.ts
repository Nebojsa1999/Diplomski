import { CenterAccount } from "../center-account/center.account.model";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    gender: Gender;
    personalId: string;
    occupation: string;
    occupationInfo: string;
    centerAccount: CenterAccount;
}

export interface UserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    city: string;
    country: string;
    phone: string;
}

export interface UpdateUserDto {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    gender: Gender;
    personalId: string;
    occupation: string;
    occupationInfo: string;
}

export enum Gender {
    MALE = 'MALE', FEMALE = 'FEMALE'
}

export enum Role {
    ADMIN_SYSTEM, PATIENT, DOCTOR
}

export interface ChangePasswordDto {
    password: string;
}
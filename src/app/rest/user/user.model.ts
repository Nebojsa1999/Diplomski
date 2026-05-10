import { Department, Hospital } from "../hospital/hospital.model";

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
    role: Role;
    personalId: string;
    occupation: string;
    occupationInfo: string;
    hospital: Hospital;
    department: Department;
    verified: boolean;
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
    gender: Gender;
    personalId: string;
    role: Role;
    hospitalId: number;
    departmentId?: number;
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
    departmentId?: number;
}

export enum Gender {
    MALE = 'MALE', FEMALE = 'FEMALE'
}

export enum Role {
    ADMIN_SYSTEM = 'ADMIN_SYSTEM', PATIENT = 'PATIENT', DOCTOR = 'DOCTOR'
}

export interface ChangePasswordDto {
    password: string;
}

export interface FavoriteDoctor {
    id: number;
    doctor: User;
}
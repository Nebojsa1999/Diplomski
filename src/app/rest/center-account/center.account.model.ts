import { User } from "../user/user.model";

export interface CenterAccount {
    id: number;
    name: string;
    description: string;
    averageRating: number;
    address: string;
    city: string;
    country: string;
    startTime: string;
    endTime: string;
    latitude: number;
    longitude: number;
}

export interface CenterAccountDto {
    name: string;
    address: string;
    city: string;
    description: string;
    startTime: string;
    endTime: string;
    latitude: number;
    longitude: number;
    country: string;
}

export enum BloodType {
    ZERO = 'ZERO', AB = 'AB', B = 'B', A = 'A'
}

export interface BloodSampleDto {
    amount: number;
    bloodType: BloodType;
}

export interface Appointment {
    dateAndTime: Date;
    duration: number;
    adminOfCenterId: number;
    patient: User;
    poll: Poll;
}

export interface AppointmentDto {
    dateAndTime: Date;
    duration: number;
    adminOfCenterId: number;
}

export interface DenyUserDto {
    id: number;
}

export interface SearchDto {
    centerName: string;
}

export interface AppointmentReport {
    bloodType: BloodType;
    bloodAmount: number;
    noteToDoctor: string;
}

export interface AppointmentReportDto {

}

export enum EquipmentType {
    NEEDLE = 'Needle',
    COTTON_WOOL = 'Cotton wool',
    SYRINGE = 'Syringe'
}

export interface Equipment {
    id: number;
    amount: number;
    equipmentType: EquipmentType;
}

export interface Poll {
    weight: number;
    sickness: number;
    infection: number;
    pressure: number;
    therapy: number;
    cycle: number;
    dentalIntervention: number;

}
import { User } from "../user/user.model";

export interface Hospital {
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

export interface HospitalDto {
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

export enum AppointmentStaus {
    OPEN = 'OPEN', SCHEDULED = 'SCHEDULED', CANCELLED = 'CANCELLED', FINISHED = 'FINISHED'
}

export enum BloodType {
    ZERO = 'ZERO', AB = 'AB', B = 'B', A = 'A'
}

export interface Appointment {
    id: number;
    dateAndTime: Date;
    duration: number;
    doctor: User;
    patient: User;
    appointmentStatus: AppointmentStaus;
}

export interface AppointmentDto {
    dateAndTime: string;
    duration: number;
    doctorId: number;
}

export interface DenyUserDto {
    id: number;
}

export interface AppointmentReport {
    bloodType: BloodType;
    pastMedicalHistory: string;
    allergies: string;
    familyHistory: string;
    bloodPressure: string;
    hearthRate: string;
    diagnosis: string;
}

export interface Equipment {
    amount: number;
    name: string;
    hospital: Hospital;
}

export enum RoomType {
    OPERATION = 'OPERATION',
    RECOVERY = 'RECOVERY'
}

export interface Room {
    roomNumber: string;
    capacity: number;
    hospital: Hospital;
    type: RoomType;
}

export enum OperationType {
    SURGERY = 'SURGERY',
    THERAPY = 'THERAPY'
}

export interface OperationRoomBooking {
    room: Room;
    doctor: User;
    patient: User;
    startTime: Date;
    endTime: Date;
    operationType: OperationType;
    notes: string;
}

export interface CreateOperationRoomBookingDto {
    room: Room;
    startTime: Date;
    endTime: Date;
    operationType: OperationType;
}

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    instructions: string;
    notes: string
}
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
    COMPLETED = 'COMPLETED', SCHEDULED = 'SCHEDULED', DENIED = 'DENIED'
}

export enum BloodType {
    ZERO = 'ZERO', AB = 'AB', B = 'B', A = 'A'
}

export interface Appointment {
    dateAndTime: Date;
    duration: number;
    doctorId: number;
    patient: User;
    poll: Poll;
    appointmentStatus: AppointmentStaus;
}

export interface AppointmentDto {
    dateAndTime: Date;
    duration: number;
    doctorId: number;
}

export interface DenyUserDto {
    id: number;
}

export interface AppointmentReport {
    bloodType: BloodType;
    bloodAmount: number;
    noteToDoctor: string;
}

export interface AppointmentReportDto {

}

export interface Equipment {
    amount: number;
    name: string;
    hospital: Hospital;
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

export interface Prescription {
    patient: User;
    doctor: User;
    notes: string
}

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    instructions: string;
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
    SURGERY
}

export interface OperationRoomBooking {
    room: Room;
    doctor: User;
    patient: User;
    starTime: string;
    endTime: string;
    operationType: OperationType;
    notes: string;
}

export interface PrescriptionDto {
    medication: Medication;
    prescription: Prescription;
}
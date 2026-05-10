import { User } from "../user/user.model";

export interface Department {
    id: number;
    name: string;
    description: string;
    phoneNumber: string;
    hospital: Hospital;
}

export interface DepartmentDto {
    name: string;
    description: string;
    phoneNumber: string;
}

export interface DepartmentProcedure {
    id: number;
    name: string;
    description: string;
    price: number;
    department: Department;
}

export interface DepartmentProcedureDto {
    name: string;
    description: string;
    price: number;
}

export interface DepartmentName {
    id: number;
    name: string;
}

export interface Diagnosis {
    id: number;
    code: string;
    name: string;
    description: string;
    departmentName: DepartmentName;
}

export interface DiagnosisDto {
    code: string;
    name: string;
    description: string;
    departmentName?: string;
}

export interface Medicament {
    id: number;
    name: string;
    instructions: string;
    dosage: string;
    departmentName: DepartmentName;
}

export interface MedicamentDto {
    name: string;
    instructions: string;
    dosage: string;
    departmentName?: string;
}

export enum RhFactor {
    POSITIVE = 'POSITIVE',
    NEGATIVE = 'NEGATIVE'
}

export interface PatientMedicalRecord {
    id: number;
    bloodType: BloodType;
    rhFactor: RhFactor;
    heightCm: number;
    weightKg: number;
    chronicDiseases: string;
    previousHospitalization: string;
    previousSurgeries: string;
    familyHistory: string;
    allergies: string;
    longTermTherapy: string;
    specificContradictions: string;
    patient: User;
}

export interface PatientMedicalRecordResponse {
    id: number;
    bloodType: BloodType;
    rhFactor: RhFactor;
    heightCm: number;
    weightKg: number;
    chronicDiseases: string;
    previousHospitalization: string;
    previousSurgeries: string;
    familyHistory: string;
    allergies: string;
    longTermTherapy: string;
    specificContradictions: string;
    patientId: number;
    firstName: string;
    lastName: string;
    email: string;
    personalId: string;
}

export interface PatientMedicalRecordDto {
    bloodType: BloodType;
    rhFactor: RhFactor;
    heightCm: number;
    weightKg: number;
    chronicDiseases: string;
    previousHospitalization: string;
    previousSurgeries: string;
    familyHistory: string;
    allergies: string;
    longTermTherapy: string;
    specificContradictions: string;
}

export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

export interface DoctorSchedule {
    id: number;
    dayOfWeek: DayOfWeek;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    durationOfAppointmentMin: number;
    breakStartTime: string;
    breakEndTime: string;
    doctor: User;
}

export interface DoctorScheduleDayDto {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    durationOfAppointmentMin: number;
    breakStartTime: string;
    breakEndTime: string;
}

export interface DoctorScheduleCreateDto {
    startDate: string;
    endDate: string;
    days: DoctorScheduleDayDto[];
}

export interface DoctorScheduleUpdateDto {
    dayOfWeek: DayOfWeek;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    durationOfAppointmentMin: number;
    breakStartTime: string;
    breakEndTime: string;
}

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

export interface LabDocument {
    originalFilename: string;
    contentType: string;
}

export interface Appointment {
    id: number;
    dateAndTime: Date;
    duration: number;
    doctor: User;
    patient: User;
    appointmentStatus: AppointmentStaus;
    hasAppointmentReport?: boolean;
    hasMedication?: boolean;
    hasLabDocument?: boolean;
    hasFeedback?: boolean;
}

export interface TimeSlotDTO {
    startTime: string;
    endTime: string;
}

export interface OpenSlotDTO {
    doctorId: number;
    doctorName: string;
    date: string;
    startTime: string;
    endTime: string;
}

export interface BookAppointmentDto {
    doctorId: number;
    date: string;
    startTime: string;
    procedureId?: number;
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
    rhFactor: string;
    heightCm: number;
    weightKg: number;
    chronicDiseases: string;
    previousHospitalization: string;
    previousSurgeries: string;
    allergies: string;
    familyHistory: string;
    longThermTherapy: string;
    specificContradictions: string;
    bloodPressure: string;
    hearthRate: string;
    diagnosis: string;
    doctorsComment: string;
}

export interface Equipment {
    id?: number;
    amount: number;
    name: string;
    room: Room;
}

export enum RoomType {
    OPERATION = 'OPERATION',
    RECOVERY = 'RECOVERY'
}

export interface Room {
    id?: number;
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
    notes: string;
    diagnosisId?: number;
    labResults?: string;
}

export interface FeedbackDto {
    grade: number;
    comment: string;
}

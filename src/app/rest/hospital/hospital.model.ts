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

export interface Diagnosis {
    id: number;
    code: string;
    name: string;
    description: string;
    department: Department;
}

export interface DiagnosisDto {
    code: string;
    name: string;
    description: string;
}

export interface Medicament {
    id: number;
    name: string;
    instructions: string;
    dosage: string;
    department: Department;
}

export interface MedicamentDto {
    name: string;
    instructions: string;
    dosage: string;
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
    id?: number;
    amount: number;
    name: string;
    hospital: Hospital;
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
    notes: string
}

export interface FeedbackDto {
    grade: number;
    comment: string;
}

export enum DoctorType {
    GENERAL_PRACTITIONER = 'GENERAL_PRACTITIONER',
    CARDIOLOGIST= 'CARDIOLOGIST',
    DERMATOLOGIST = 'DERMATOLOGIST',
    NEUROLOGIST = 'NEUROLOGIST',
    ORTHOPEDIC_SURGEON = 'ORTHOPEDIC_SURGEON',
    GASTROENTEROLOGIST = 'GASTROENTEROLOGIST',
    ENDOCRINOLOGIST = 'ENDOCRINOLOGIST',
    PULMONOLOGIST = 'PULMONOLOGIST',
    GYNECOLOGIST = 'GYNECOLOGIST',
    UROLOGIST = 'UROLOGIST',
    OPHTHALMOLOGIST = 'OPHTHALMOLOGIST',
    OTOLARYNGOLOGIST = 'OTOLARYNGOLOGIST'
}

export enum PatientScheduleType {
    GENERAL_MEDICINE = 'GENERAL_MEDICINE',
    CARDIOLOGY = 'CARDIOLOGY',
    OPHTHALMOLOGIST = 'OPHTHALMOLOGIST'
}

export interface PatientScheduleInfo {
    icon: string;
    label: string;
    color: string;
}

export const PatientScheduleMap: Record<PatientScheduleType, PatientScheduleInfo> = {
    [PatientScheduleType.GENERAL_MEDICINE]: { icon: 'general_medicine', label: 'Routine checkups and common illnesses', color: 'blue' },
    [PatientScheduleType.CARDIOLOGY]: { icon: 'cardiology', label: 'Heart and cardiovascular health', color: 'red' },
    [PatientScheduleType.OPHTHALMOLOGIST]: { icon: 'eye', label: 'Eye exams and vision care', color: 'purple' },
};

export const DoctorTypeMap: Record<PatientScheduleType, DoctorType> = {
    [PatientScheduleType.GENERAL_MEDICINE]: DoctorType.GENERAL_PRACTITIONER,
    [PatientScheduleType.CARDIOLOGY]: DoctorType.CARDIOLOGIST,
    [PatientScheduleType.OPHTHALMOLOGIST]: DoctorType.OPHTHALMOLOGIST
};
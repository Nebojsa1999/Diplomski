import { Api } from "../api";
import { ApiClient } from "../api-client";
import { ApiResponse, RequestConfig } from "../rest.model";
import {
    Department,
    DepartmentDto,
    DepartmentProcedure,
    DepartmentProcedureDto,
    Diagnosis,
    DiagnosisDto,
    Equipment,
    Hospital,
    HospitalDto,
    Medicament,
    MedicamentDto,
    PatientMedicalRecord,
    PatientMedicalRecordDto,
    PatientMedicalRecordResponse,
    Room,
    RoomType
} from "./hospital.model";
import { Observable } from "rxjs";
import { Role, User } from "../user/user.model";

export class HospitalApi extends Api {
    constructor(client: ApiClient) {
        super(client);
    }

    getHospital(id: number): Observable<ApiResponse<Hospital>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get<Hospital>(`/api/hospitals/${id}`, config);
    }

    createHospital(data: HospitalDto): Observable<ApiResponse<Hospital>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.post(`/api/hospitals`, data, config);
    }

    updateHospital(id: number, data: HospitalDto): Observable<ApiResponse<Hospital>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put(`/api/hospitals/${id}`, data, config);
    }

    list(name?: string): Observable<ApiResponse<Hospital[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {name: name as string},
            authenticated: true
        };
        return this.apiClient.get("/api/hospitals", config);
    }

    getUsersFromHospital(id: number, role?: Role | null, name?: string): Observable<ApiResponse<User[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            params: {role: role as Role, name: name as string},
            authenticated: true
        };
        return this.apiClient.get<User[]>("/api/hospitals/" + id + "/users", config);
    }

    createEquipment(equipment: Equipment): Observable<ApiResponse<Equipment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.post(`/api/hospitals/equipment`, equipment, config)
    }

    editEquipment(id: number, data: Equipment): Observable<ApiResponse<Equipment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.put(`/api/hospitals/equipment/${id}`, data, config);
    }

    getEquipment(id: number): Observable<ApiResponse<Equipment>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get(`/api/hospitals/equipment/${id}`, config);
    }

    getEquipments(name?: string): Observable<ApiResponse<Equipment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            params: {name: name as string},
            authenticated: true
        };
        return this.apiClient.get("/api/hospitals/equipments", config);
    }

    getEquipmentsByHospital(id: number, name?: string): Observable<ApiResponse<Equipment[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {name: name as string},
            authenticated: true,
        };

        return this.apiClient.get(`/api/hospitals/${id}/equipments`, config);
    }

    getRoom(id: number): Observable<ApiResponse<Room>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json'
            },
            authenticated: true
        };
        return this.apiClient.get(`/api/hospitals/room/${id}`, config);
    }

    createRoom(room: Room): Observable<ApiResponse<Room>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.post(`/api/hospitals/room`, room, config)
    }

    editRoom(id: number, data: Room): Observable<ApiResponse<Room>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            authenticated: true
        };

        return this.apiClient.put(`/api/hospitals/room/${id}`, data, config);
    }

    listRooms(name?: string): Observable<ApiResponse<Room[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {name: name as string},
            authenticated: true,
        };

        return this.apiClient.get(`/api/hospitals/rooms`, config);
    }

    availableRooms(id: number, name?: string, roomType?: RoomType): Observable<ApiResponse<Room[]>> {
        const config: RequestConfig = {
            headers: {
                accept: 'application/json',
                contentType: 'application/json'
            },
            params: {name: name as string, roomType: roomType as RoomType},
            authenticated: true,
        };

        return this.apiClient.get(`/api/hospitals/${id}/free-rooms`, config);
    }

    listDepartments(name?: string, hospitalId?: number): Observable<ApiResponse<Department[]>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            params: {name: name as string, hospitalId: hospitalId as unknown as string},
            authenticated: true
        };
        return this.apiClient.get('/api/hospitals/departments', config);
    }

    getDepartment(id: number): Observable<ApiResponse<Department>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.get(`/api/hospitals/departments/${id}`, config);
    }

    createDepartment(hospitalId: number, data: DepartmentDto): Observable<ApiResponse<Department>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.post(`/api/hospitals/${hospitalId}/departments`, data, config);
    }

    updateDepartment(id: number, data: DepartmentDto): Observable<ApiResponse<Department>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.put(`/api/hospitals/departments/${id}`, data, config);

    }

    listProcedures(name?: string, departmentId?: number): Observable<ApiResponse<DepartmentProcedure[]>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            params: {name: name as string, departmentId: departmentId as unknown as string},
            authenticated: true
        };
        return this.apiClient.get('/api/departments/procedures', config);
    }

    getProcedure(id: number): Observable<ApiResponse<DepartmentProcedure>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.get(`/api/departments/procedures/${id}`, config);
    }

    createProcedure(departmentId: number, data: DepartmentProcedureDto): Observable<ApiResponse<DepartmentProcedure>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.post(`/api/departments/${departmentId}/procedures`, data, config);
    }

    updateProcedure(id: number, data: DepartmentProcedureDto): Observable<ApiResponse<DepartmentProcedure>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.put(`/api/departments/procedures/${id}`, data, config);
    }

    listDiagnoses(name?: string, departmentId?: number): Observable<ApiResponse<Diagnosis[]>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            params: {name: name as string, departmentId: departmentId as unknown as string},
            authenticated: true
        };
        return this.apiClient.get('/api/diagnoses', config);
    }

    getDiagnosis(id: number): Observable<ApiResponse<Diagnosis>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.get(`/api/diagnoses/${id}`, config);
    }

    createDiagnosis(departmentId: number, data: DiagnosisDto): Observable<ApiResponse<Diagnosis>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.post(`/api/departments/${departmentId}/diagnoses`, data, config);
    }

    updateDiagnosis(id: number, data: DiagnosisDto): Observable<ApiResponse<Diagnosis>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.put(`/api/diagnoses/${id}`, data, config);
    }

    listMedicaments(name?: string, departmentId?: number): Observable<ApiResponse<Medicament[]>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            params: {name: name as string, departmentId: departmentId as unknown as string},
            authenticated: true
        };
        return this.apiClient.get('/api/departments/medicaments', config);
    }

    getMedicament(id: number): Observable<ApiResponse<Medicament>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.get(`/api/departments/medicaments/${id}`, config);
    }

    createMedicament(departmentId: number, data: MedicamentDto): Observable<ApiResponse<Medicament>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.post(`/api/departments/${departmentId}/medicaments`, data, config);
    }

    updateMedicament(id: number, data: MedicamentDto): Observable<ApiResponse<Medicament>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.put(`/api/departments/medicaments/${id}`, data, config);
    }

    deleteHospital(id: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.delete(`/api/hospitals/${id}`, config);
    }

    deleteEquipment(id: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.delete(`/api/hospitals/equipment/${id}`, config);
    }

    deleteRoom(id: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.delete(`/api/hospitals/room/${id}`, config);
    }

    deleteDepartment(id: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.delete(`/api/hospitals/departments/${id}`, config);
    }

    deleteProcedure(id: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.delete(`/api/departments/procedures/${id}`, config);
    }

    deleteDiagnosis(id: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.delete(`/api/diagnoses/${id}`, config);
    }

    deleteMedicament(id: number): Observable<ApiResponse<void>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.delete(`/api/departments/medicaments/${id}`, config);
    }

    getMedicalRecordByPatient(patientId: number): Observable<ApiResponse<PatientMedicalRecordResponse>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json'},
            authenticated: true
        };
        return this.apiClient.get(`/api/users/${patientId}/medical-record`, config);
    }

    createMedicalRecord(patientId: number, data: PatientMedicalRecordDto): Observable<ApiResponse<PatientMedicalRecord>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.post(`/api/users/${patientId}/medical-record`, data, config);
    }

    updateMedicalRecord(id: number, data: PatientMedicalRecordDto): Observable<ApiResponse<PatientMedicalRecord>> {
        const config: RequestConfig = {
            headers: {accept: 'application/json', contentType: 'application/json'},
            authenticated: true
        };
        return this.apiClient.put(`/api/users/medical-record/${id}`, data, config);
    }
}
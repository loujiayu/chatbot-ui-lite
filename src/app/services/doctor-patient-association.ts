import { get } from './api';
import API_CONFIG from '../config';
import useAuthStore from '../store/useAuthStore';

interface ApiDoctorPatientNote {
  doctor_id: number;
  patient_id: number;
  doctor_name: string;
  metadata: {
    note: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  success: boolean;
  data?: ApiDoctorPatientNote[];
  error?: string;
}

export interface DoctorPatientNote {
  doctorId: number;
  doctorName: string;
  metadata: {
    note: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

function adaptDoctorPatientNote(apiNote: ApiDoctorPatientNote): DoctorPatientNote {
  return {
    doctorId: apiNote.doctor_id,
    doctorName: apiNote.doctor_name,
    metadata: apiNote.metadata,
    createdAt: apiNote.created_at,
    updatedAt: apiNote.updated_at
  };
}

export async function getDoctorPatientNote() {
  try {
    const userId = useAuthStore.getState().userId;
    if (!userId) {
      return {
        success: false,
        notes: [],
        error: 'User not authenticated'
      };
    }

    const response: ApiResponse = await get(`${API_CONFIG.BASE_URL}/doctorpatientassociation/${userId}/relationships`);
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch doctor-patient notes");
    }

    const adaptedNotes = (response.data || []).map(adaptDoctorPatientNote);

    return {
      success: true,
      notes: adaptedNotes,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      notes: [],
      error: error instanceof Error ? error.message : 'Failed to fetch notes'
    };
  }
}

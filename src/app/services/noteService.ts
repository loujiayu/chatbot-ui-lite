import { get } from './api';
import useAuthStore from '../store/useAuthStore';
import API_CONFIG from '../config';

const API_BASE_URL = API_CONFIG.BASE_URL;

interface NoteResponse {
  note: string;
}

export async function getDoctorPatientNote() {
  const userId = useAuthStore.getState().userId;
  
  if (!userId) {
    return {
      success: false,
      note: '',
      error: 'User not authenticated'
    };
  }
  
  const url = `${API_BASE_URL}/notes/${userId}`;
  const response = await get<NoteResponse>(url, true);
  
  return {
    success: response.success,
    note: response.data?.note || '',
    error: response.error
  };
}
import { Doctor } from '@/types';
import { mockDoctors } from '@/lib/mock-data';

export const doctorsApi = {
  getAll: async (): Promise<Doctor[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDoctors;
  },
  
  getById: async (id: string): Promise<Doctor | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDoctors.find(doctor => doctor.id === id) || null;
  },
  
  getBySpecialty: async (specialty: string): Promise<Doctor[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDoctors.filter(doctor => doctor.specialty === specialty);
  },
  
  getAvailable: async (): Promise<Doctor[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDoctors.filter(doctor => doctor.isAvailable);
  },
  
  getByClinic: async (clinicId: string): Promise<Doctor[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDoctors.filter(doctor => doctor.clinic === clinicId);
  },
  
  search: async (query: string): Promise<Doctor[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(query.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(query.toLowerCase())
    );
  },
};

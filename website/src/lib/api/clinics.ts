import { Clinic } from '@/types';
import { mockClinics } from '@/lib/mock-data';

export const clinicsApi = {
  getAll: async (): Promise<Clinic[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockClinics;
  },
  
  getById: async (id: string): Promise<Clinic | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockClinics.find(clinic => clinic.id === id) || null;
  },
  
  getByCity: async (city: string): Promise<Clinic[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockClinics.filter(clinic => clinic.city === city);
  },
  
  getBySpecialty: async (specialty: string): Promise<Clinic[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockClinics.filter(clinic => 
      clinic.specialties.includes(specialty)
    );
  },
  
  getVerified: async (): Promise<Clinic[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockClinics.filter(clinic => clinic.isVerified);
  },
  
  search: async (query: string): Promise<Clinic[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockClinics.filter(clinic => 
      clinic.name.toLowerCase().includes(query.toLowerCase()) ||
      clinic.city.toLowerCase().includes(query.toLowerCase()) ||
      clinic.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))
    );
  },
};

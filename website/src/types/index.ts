// Types for the clinic management system

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  features: string[];
  isPopular: boolean;
  icon: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  clinic: string;
  languages: string[];
  education: string;
  certifications: string[];
  consultationFee: number;
  isAvailable: boolean;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  image: string;
  specialties: string[];
  rating: number;
  openingHours: {
    weekdays: string;
    weekends: string;
  };
  facilities: string[];
  isVerified: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  tags: string[];
  readTime: number;
  slug: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular: boolean;
  description: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';
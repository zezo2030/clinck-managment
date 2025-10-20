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
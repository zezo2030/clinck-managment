import { z } from 'zod';

// Auth validators
export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح').min(1, 'البريد الإلكتروني مطلوب'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

// User validators
export const createUserSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  firstName: z.string().min(1, 'الاسم الأول مطلوب'),
  lastName: z.string().min(1, 'الاسم الأخير مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  role: z.enum(['ADMIN', 'DOCTOR', 'PATIENT'], {
    errorMap: () => ({ message: 'نوع المستخدم غير صحيح' })
  }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

// Doctor validators
export const createDoctorSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  firstName: z.string().min(1, 'الاسم الأول مطلوب'),
  lastName: z.string().min(1, 'الاسم الأخير مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  licenseNumber: z.string().min(1, 'رقم الترخيص مطلوب'),
  specialties: z.array(z.number()).min(1, 'يجب اختيار تخصص واحد على الأقل'),
  clinics: z.array(z.number()).min(1, 'يجب اختيار عيادة واحدة على الأقل'),
  experience: z.number().min(0).optional(),
  education: z.string().optional(),
  bio: z.string().optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial().omit({ password: true });

// Clinic validators
export const createClinicSchema = z.object({
  name: z.string().min(1, 'اسم العيادة مطلوب'),
  address: z.string().min(1, 'العنوان مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  description: z.string().optional(),
});

export const updateClinicSchema = createClinicSchema.partial();

// Appointment validators
export const createAppointmentSchema = z.object({
  patientId: z.number().min(1, 'يجب اختيار المريض'),
  doctorId: z.number().min(1, 'يجب اختيار الطبيب'),
  clinicId: z.number().min(1, 'يجب اختيار العيادة'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  time: z.string().min(1, 'الوقت مطلوب'),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

// Consultation validators
export const createConsultationSchema = z.object({
  patientId: z.number().min(1, 'يجب اختيار المريض'),
  doctorId: z.number().min(1, 'يجب اختيار الطبيب'),
  subject: z.string().min(1, 'موضوع الاستشارة مطلوب'),
  description: z.string().min(1, 'وصف الاستشارة مطلوب'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    errorMap: () => ({ message: 'أولوية الاستشارة غير صحيحة' })
  }),
});

export const updateConsultationSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
});

// Specialty validators
export const createSpecialtySchema = z.object({
  name: z.string().min(1, 'اسم التخصص مطلوب'),
  description: z.string().optional(),
});

export const updateSpecialtySchema = createSpecialtySchema.partial();

// Department validators
export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'اسم القسم مطلوب'),
  description: z.string().optional(),
  clinicId: z.number().min(1, 'يجب اختيار العيادة'),
});

export const updateDepartmentSchema = createDepartmentSchema.partial().omit({ clinicId: true });

// Schedule validators
export const createScheduleSchema = z.object({
  doctorId: z.number().min(1, 'يجب اختيار الطبيب'),
  dayOfWeek: z.number().min(0).max(6, 'يوم الأسبوع غير صحيح'),
  startTime: z.string().min(1, 'وقت البداية مطلوب'),
  endTime: z.string().min(1, 'وقت النهاية مطلوب'),
});

export const updateScheduleSchema = createScheduleSchema.partial().omit({ doctorId: true, dayOfWeek: true });

// Message validators
export const sendMessageSchema = z.object({
  content: z.string().min(1, 'محتوى الرسالة مطلوب'),
});

// File validators
export const fileUploadSchema = z.object({
  file: z.instanceof(File, 'يجب اختيار ملف'),
});

// Search and filter validators
export const searchSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const appointmentFilterSchema = z.object({
  patientId: z.number().optional(),
  doctorId: z.number().optional(),
  clinicId: z.number().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  ...searchSchema.shape,
});

export const consultationFilterSchema = z.object({
  patientId: z.number().optional(),
  doctorId: z.number().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  ...searchSchema.shape,
});


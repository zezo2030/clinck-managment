# 🌐 المرحلة الثالثة - الميزات المتقدمة والتفاعل

## 📋 نظرة عامة

تطوير المرحلة الثالثة من موقع الويب تتضمن:
- الميزات المتقدمة (البحث، الفلترة، الترتيب)
- التفاعل مع المستخدمين (النماذج، التعليقات، التقييمات)
- تحسين تجربة المستخدم (التحميل، الرسوم المتحركة)
- الميزات التفاعلية (الخرائط، التقويم، الدردشة)
- التكامل مع الخدمات الخارجية

---

## 🔍 الميزات المتقدمة

### **1. نظام البحث المتقدم**
```typescript
// src/components/search/AdvancedSearch.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceRange: string;
  rating: number;
  availability: boolean;
}

export const AdvancedSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    priceRange: '',
    rating: 0,
    availability: false,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { value: '', label: 'جميع التخصصات' },
    { value: 'cardiology', label: 'أمراض القلب' },
    { value: 'dermatology', label: 'الأمراض الجلدية' },
    { value: 'pediatrics', label: 'طب الأطفال' },
    { value: 'orthopedics', label: 'العظام' },
  ];

  const locations = [
    { value: '', label: 'جميع المناطق' },
    { value: 'riyadh', label: 'الرياض' },
    { value: 'jeddah', label: 'جدة' },
    { value: 'dammam', label: 'الدمام' },
  ];

  const priceRanges = [
    { value: '', label: 'جميع الأسعار' },
    { value: '0-50', label: '0 - 50 ريال' },
    { value: '50-100', label: '50 - 100 ريال' },
    { value: '100-200', label: '100 - 200 ريال' },
    { value: '200+', label: 'أكثر من 200 ريال' },
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // تنفيذ البحث
      const results = await performSearch(filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      priceRange: '',
      rating: 0,
      availability: false,
    });
    setSearchResults([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* شريط البحث الرئيسي */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="ابحث عن طبيب، عيادة، أو خدمة..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* أزرار البحث والفلترة */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            فلترة
          </Button>
          <Button onClick={handleSearch} loading={isLoading}>
            بحث
          </Button>
        </div>
      </div>

      {/* الفلاتر المتقدمة */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="التخصص"
              value={filters.category}
              onChange={(value) => setFilters({ ...filters, category: value })}
              options={categories}
            />
            
            <Select
              label="المنطقة"
              value={filters.location}
              onChange={(value) => setFilters({ ...filters, location: value })}
              options={locations}
            />
            
            <Select
              label="نطاق السعر"
              value={filters.priceRange}
              onChange={(value) => setFilters({ ...filters, priceRange: value })}
              options={priceRanges}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                التقييم الأدنى
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">{filters.rating}+</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="availability"
                checked={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="availability" className="text-sm text-gray-700">
                متاح الآن
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                مسح الفلاتر
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### **2. نظام التقييمات والمراجعات**
```typescript
// src/components/reviews/ReviewSystem.tsx
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface ReviewSystemProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onAddReview: (review: Omit<Review, 'id'>) => void;
}

export const ReviewSystem: React.FC<ReviewSystemProps> = ({
  reviews,
  averageRating,
  totalReviews,
  onAddReview,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });

  const handleSubmitReview = () => {
    if (newReview.rating > 0 && newReview.comment.trim()) {
      onAddReview({
        user: { name: 'المستخدم الحالي', avatar: '/default-avatar.jpg' },
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString(),
        helpful: 0,
        verified: false,
      });
      setNewReview({ rating: 0, comment: '' });
      setShowReviewForm(false);
    }
  };

  const StarRating: React.FC<{ rating: number; onRatingChange?: (rating: number) => void }> = ({
    rating,
    onRatingChange,
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange?.(star)}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ملخص التقييمات */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </h3>
            <div className="flex items-center space-x-2">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-gray-600">({totalReviews} تقييم)</span>
            </div>
          </div>
          <Button onClick={() => setShowReviewForm(!showReviewForm)}>
            أضف تقييمك
          </Button>
        </div>

        {/* توزيع التقييمات */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => Math.round(r.rating) === rating).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-8">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* نموذج إضافة تقييم */}
      {showReviewForm && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">أضف تقييمك</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التقييم
              </label>
              <StarRating
                rating={newReview.rating}
                onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التعليق
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="شاركنا تجربتك..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSubmitReview}>
                إرسال التقييم
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* قائمة التقييمات */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start space-x-4">
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {review.user.name}
                    </span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        موثق
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <StarRating rating={review.rating} />
                </div>
                
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>مفيد ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600">
                    <Flag className="w-4 h-4" />
                    <span>إبلاغ</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

---

## 📝 النماذج التفاعلية

### **1. نموذج حجز الموعد**
```typescript
// src/components/forms/AppointmentBookingForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';

const appointmentSchema = z.object({
  patientName: z.string().min(2, 'الاسم مطلوب'),
  patientEmail: z.string().email('البريد الإلكتروني غير صحيح'),
  patientPhone: z.string().min(10, 'رقم الهاتف مطلوب'),
  doctorId: z.string().min(1, 'اختر الطبيب'),
  appointmentDate: z.string().min(1, 'اختر التاريخ'),
  appointmentTime: z.string().min(1, 'اختر الوقت'),
  reason: z.string().min(10, 'سبب الزيارة مطلوب'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentBookingFormProps {
  doctors: Array<{
    id: string;
    name: string;
    specialization: string;
    availableSlots: Array<{
      date: string;
      times: string[];
    }>;
  }>;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
}

export const AppointmentBookingForm: React.FC<AppointmentBookingFormProps> = ({
  doctors,
  onSubmit,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setValue('doctorId', doctorId);
    setSelectedDate('');
    setAvailableTimes([]);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setValue('appointmentDate', date);
    
    const doctor = doctors.find(d => d.id === selectedDoctor);
    const dateSlots = doctor?.availableSlots.find(slot => slot.date === date);
    setAvailableTimes(dateSlots?.times || []);
  };

  const handleTimeChange = (time: string) => {
    setValue('appointmentTime', time);
  };

  const onFormSubmit = async (data: AppointmentFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          احجز موعدك
        </h2>
        <p className="text-gray-600">
          اختر الطبيب والتاريخ والوقت المناسب لك
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* معلومات المريض */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            معلومات المريض
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="الاسم الكامل"
              {...register('patientName')}
              error={errors.patientName?.message}
              placeholder="أدخل اسمك الكامل"
            />
            
            <Input
              label="البريد الإلكتروني"
              type="email"
              {...register('patientEmail')}
              error={errors.patientEmail?.message}
              placeholder="example@email.com"
            />
          </div>
          
          <Input
            label="رقم الهاتف"
            {...register('patientPhone')}
            error={errors.patientPhone?.message}
            placeholder="+966 50 123 4567"
          />
        </div>

        {/* اختيار الطبيب */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            اختيار الطبيب
          </h3>
          
          <Select
            label="الطبيب"
            value={selectedDoctor}
            onChange={handleDoctorChange}
            error={errors.doctorId?.message}
            options={doctors.map(doctor => ({
              value: doctor.id,
              label: `${doctor.name} - ${doctor.specialization}`,
            }))}
          />
        </div>

        {/* اختيار التاريخ والوقت */}
        {selectedDoctor && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              التاريخ والوقت
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التاريخ
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">اختر التاريخ</option>
                  {doctors
                    .find(d => d.id === selectedDoctor)
                    ?.availableSlots.map(slot => (
                      <option key={slot.date} value={slot.date}>
                        {new Date(slot.date).toLocaleDateString('ar-SA')}
                      </option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوقت
                </label>
                <select
                  {...register('appointmentTime')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">اختر الوقت</option>
                  {availableTimes.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.appointmentTime && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.appointmentTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* سبب الزيارة */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            تفاصيل الزيارة
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سبب الزيارة
            </label>
            <textarea
              {...register('reason')}
              placeholder="اشرح سبب زيارتك للطبيب..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
            {errors.reason && (
              <p className="text-sm text-red-600 mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              {...register('notes')}
              placeholder="أي ملاحظات إضافية..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>

        {/* أزرار الإجراء */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            loading={isSubmitting}
            className="flex-1 bg-primary-600 text-white hover:bg-primary-700"
          >
            تأكيد الحجز
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Card>
  );
};
```

---

## 🗺️ الخرائط والموقع

### **1. خريطة العيادات**
```typescript
// src/components/maps/ClinicsMap.tsx
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  services: string[];
}

interface ClinicsMapProps {
  clinics: Clinic[];
  onClinicSelect: (clinic: Clinic) => void;
}

export const ClinicsMap: React.FC<ClinicsMapProps> = ({
  clinics,
  onClinicSelect,
}) => {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // تحميل Google Maps API
    const loadGoogleMaps = () => {
      if (window.google) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const handleClinicClick = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    onClinicSelect(clinic);
  };

  const getDirections = (clinic: Clinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.coordinates.lat},${clinic.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* قائمة العيادات */}
      <div className="lg:col-span-1">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            العيادات القريبة
          </h3>
          
          {clinics.map((clinic) => (
            <Card
              key={clinic.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedClinic?.id === clinic.id
                  ? 'ring-2 ring-primary-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleClinicClick(clinic)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-gray-900">
                    {clinic.name}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {clinic.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{clinic.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{clinic.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{clinic.hours}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {clinic.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                  {clinic.services.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{clinic.services.length - 3} أكثر
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClinicSelect(clinic);
                    }}
                  >
                    اختر
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      getDirections(clinic);
                    }}
                  >
                    الاتجاهات
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* الخريطة */}
      <div className="lg:col-span-2">
        <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
          {mapLoaded ? (
            <div id="map" className="w-full h-full" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">جاري تحميل الخريطة...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## 💬 نظام الدردشة المباشرة

### **1. Chat Widget**
```typescript
// src/components/chat/ChatWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // رسالة ترحيبية
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
          sender: 'agent',
          timestamp: new Date(),
          type: 'text',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // محاكاة رد الوكيل
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'شكراً لرسالتك. سأقوم بالرد عليك في أقرب وقت ممكن.',
        sender: 'agent',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-white rounded-lg shadow-xl border">
      {/* رأس الدردشة */}
      <div className="flex items-center justify-between p-4 border-b bg-primary-600 text-white rounded-t-lg">
        <div>
          <h3 className="font-semibold">الدعم الفني</h3>
          <p className="text-sm opacity-90">متاح الآن</p>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-primary-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* أزرار سريعة */}
      <div className="p-2 border-t bg-gray-50">
        <div className="flex space-x-2 mb-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Phone className="w-4 h-4 mr-1" />
            اتصال
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Mail className="w-4 h-4 mr-1" />
            إيميل
          </Button>
        </div>
      </div>

      {/* إدخال الرسالة */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---

## 📊 التحليلات والمراقبة

### **1. Analytics Dashboard**
```typescript
// src/components/analytics/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Star,
  Eye,
  MousePointer,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalAppointments: number;
  averageRating: number;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: string;
  topPages: Array<{
    page: string;
    views: number;
  }>;
  recentActivity: Array<{
    action: string;
    user: string;
    timestamp: Date;
  }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // محاكاة البيانات
      const mockData: AnalyticsData = {
        totalUsers: 1250,
        totalAppointments: 3420,
        averageRating: 4.8,
        pageViews: 15680,
        uniqueVisitors: 3240,
        bounceRate: 35.2,
        averageSessionDuration: '3:45',
        topPages: [
          { page: '/services', views: 2340 },
          { page: '/doctors', views: 1890 },
          { page: '/pricing', views: 1560 },
          { page: '/contact', views: 980 },
        ],
        recentActivity: [
          {
            action: 'حجز موعد جديد',
            user: 'أحمد محمد',
            timestamp: new Date(),
          },
          {
            action: 'تقييم طبيب',
            user: 'فاطمة علي',
            timestamp: new Date(Date.now() - 300000),
          },
        ],
      };
      setData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: 'إجمالي المستخدمين',
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'إجمالي المواعيد',
      value: data.totalAppointments.toLocaleString(),
      icon: Calendar,
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'متوسط التقييم',
      value: data.averageRating.toFixed(1),
      icon: Star,
      change: '+0.2',
      changeType: 'positive',
    },
    {
      title: 'مشاهدات الصفحة',
      value: data.pageViews.toLocaleString(),
      icon: Eye,
      change: '+15%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      {/* رأس التحليلات */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">لوحة التحليلات</h2>
          <p className="text-gray-600">نظرة شاملة على أداء الموقع</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          >
            <option value="24h">آخر 24 ساعة</option>
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 90 يوم</option>
          </select>
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} من الشهر الماضي
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* المزيد من الإحصائيات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الصفحات الأكثر زيارة */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            الصفحات الأكثر زيارة
          </h3>
          <div className="space-y-3">
            {data.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{page.page}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(page.views / data.topPages[0].views) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {page.views.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* النشاط الأخير */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            النشاط الأخير
          </h3>
          <div className="space-y-3">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">
                    {activity.user} • {activity.timestamp.toLocaleTimeString('ar-SA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
```

---

## 🧪 اختبارات الميزات المتقدمة

### **1. اختبار البحث المتقدم**
```typescript
// src/components/search/__tests__/AdvancedSearch.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdvancedSearch } from '../AdvancedSearch';

describe('AdvancedSearch Component', () => {
  it('renders search input and buttons', () => {
    render(<AdvancedSearch />);
    
    expect(screen.getByPlaceholderText(/ابحث عن طبيب/)).toBeInTheDocument();
    expect(screen.getByText('فلترة')).toBeInTheDocument();
    expect(screen.getByText('بحث')).toBeInTheDocument();
  });

  it('toggles advanced filters', () => {
    render(<AdvancedSearch />);
    
    const filterButton = screen.getByText('فلترة');
    fireEvent.click(filterButton);
    
    expect(screen.getByText('التخصص')).toBeInTheDocument();
    expect(screen.getByText('المنطقة')).toBeInTheDocument();
  });

  it('clears filters when clear button is clicked', () => {
    render(<AdvancedSearch />);
    
    // فتح الفلاتر
    fireEvent.click(screen.getByText('فلترة'));
    
    // ملء بعض الفلاتر
    const categorySelect = screen.getByLabelText('التخصص');
    fireEvent.change(categorySelect, { target: { value: 'cardiology' } });
    
    // مسح الفلاتر
    fireEvent.click(screen.getByText('مسح الفلاتر'));
    
    expect(categorySelect).toHaveValue('');
  });
});
```

### **2. اختبار نظام التقييمات**
```typescript
// src/components/reviews/__tests__/ReviewSystem.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewSystem } from '../ReviewSystem';

const mockReviews = [
  {
    id: '1',
    user: { name: 'أحمد محمد', avatar: '/avatar1.jpg' },
    rating: 5,
    comment: 'خدمة ممتازة',
    date: '2024-01-15',
    helpful: 3,
    verified: true,
  },
];

describe('ReviewSystem Component', () => {
  it('displays reviews and rating summary', () => {
    render(
      <ReviewSystem
        reviews={mockReviews}
        averageRating={4.5}
        totalReviews={10}
        onAddReview={jest.fn()}
      />
    );
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(10 تقييم)')).toBeInTheDocument();
    expect(screen.getByText('خدمة ممتازة')).toBeInTheDocument();
  });

  it('opens review form when add review button is clicked', () => {
    render(
      <ReviewSystem
        reviews={mockReviews}
        averageRating={4.5}
        totalReviews={10}
        onAddReview={jest.fn()}
      />
    );
    
    fireEvent.click(screen.getByText('أضف تقييمك'));
    expect(screen.getByText('أضف تقييمك')).toBeInTheDocument();
  });
});
```

---

## 🚀 تشغيل المرحلة الثالثة

### **1. التطوير**
```bash
# تشغيل التطوير
npm run dev

# فحص الكود
npm run lint

# تشغيل الاختبارات
npm test
```

### **2. مع Docker**
```bash
# تشغيل جميع الخدمات
npm run docker:dev

# إعادة بناء
npm run docker:build
```

---

## 📝 ملاحظات المرحلة الثالثة

### **المهام المكتملة**
- ✅ نظام البحث المتقدم
- ✅ نظام التقييمات والمراجعات
- ✅ النماذج التفاعلية
- ✅ الخرائط والموقع
- ✅ نظام الدردشة المباشرة
- ✅ لوحة التحليلات
- ✅ اختبارات الميزات المتقدمة

### **المهام التالية (المرحلة الرابعة)**
- 🔄 تحسين الأداء
- 🔄 تحسين SEO
- 🔄 تحسين إمكانية الوصول
- 🔄 تحسين الأمان

---

*تم إكمال المرحلة الثالثة بنجاح - جاهز للمرحلة الرابعة*

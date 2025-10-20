'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnimatedCard } from '@/components/animations/AnimatedCard';
import { StarIcon, MapPinIcon, PhoneIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';
import { mockClinics } from '@/lib/mock-data';

export const ClinicsList: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const cities = ['all', ...Array.from(new Set(mockClinics.map(clinic => clinic.city)))];

  const filteredClinics = mockClinics.filter(clinic => {
    const matchesCity = selectedCity === 'all' || clinic.city === selectedCity;
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         clinic.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         clinic.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCity && matchesSearch;
  });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            عياداتنا الشريكة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اكتشف شبكتنا الواسعة من العيادات والمستشفيات المعتمدة في جميع أنحاء المملكة
          </p>
        </div>

        {/* فلاتر البحث */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="ابحث عن عيادة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCity === city
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city === 'all' ? 'جميع المدن' : city}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClinics.map((clinic, index) => (
            <AnimatedCard 
              key={clinic.id} 
              delay={index * 0.1}
              className="p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {clinic.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPinIcon className="w-4 h-4 ml-2" />
                      <span className="text-sm">{clinic.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <span className="text-sm font-medium">{clinic.city}</span>
                    </div>
                  </div>
                  {clinic.isVerified && (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  )}
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(clinic.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 mr-2">
                      {clinic.rating}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4 ml-2" />
                    <span>{clinic.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 ml-2" />
                    <span>{clinic.openingHours.weekdays}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">التخصصات:</h4>
                  <div className="flex flex-wrap gap-1">
                    {clinic.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">المرافق:</h4>
                  <div className="flex flex-wrap gap-1">
                    {clinic.facilities.slice(0, 3).map((facility, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
                    {clinic.facilities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{clinic.facilities.length - 3} أكثر
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    تفاصيل أكثر
                  </Button>
                  <Button size="sm" className="flex-1">
                    احجز موعد
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لم يتم العثور على عيادات</p>
          </div>
        )}
      </div>
    </section>
  );
};

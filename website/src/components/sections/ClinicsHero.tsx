import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, MapPinIcon, ClockIcon } from 'lucide-react';

export const ClinicsHero: React.FC = () => {
  const features = [
    'عيادات معتمدة ومرخصة',
    'أطباء متخصصون ذوو خبرة عالية',
    'أحدث الأجهزة والتقنيات الطبية',
    'خدمة عملاء متميزة',
    'مواعيد مرنة ومناسبة',
    'أسعار تنافسية',
  ];

  return (
    <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                عياداتنا الشريكة
                <span className="text-primary-600 block">
                  في جميع أنحاء المملكة
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                شبكة واسعة من العيادات والمستشفيات المعتمدة في جميع أنحاء المملكة 
                لتوفير أفضل رعاية صحية قريبة منك.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary-600 text-white hover:bg-primary-700">
                ابحث عن عيادة
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                <MapPinIcon className="w-5 h-5 mr-2" />
                العيادات القريبة
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-4xl">🏥</span>
                  </div>
                  <p className="text-gray-600">خريطة العيادات</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

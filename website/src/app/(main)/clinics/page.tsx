import React from 'react';
import { Metadata } from 'next';
import { ClinicsHero } from '@/components/sections/ClinicsHero';
import { ClinicsList } from '@/components/sections/ClinicsList';

export const metadata: Metadata = {
  title: 'العيادات الشريكة | نظام إدارة العيادات',
  description: 'اكتشف شبكتنا الواسعة من العيادات والمستشفيات المعتمدة في جميع أنحاء المملكة',
  keywords: 'عيادات, مستشفيات, رعاية صحية, عيادات شريكة',
};

export default function ClinicsPage() {
  return (
    <div className="min-h-screen">
      <ClinicsHero />
      <ClinicsList />
    </div>
  );
}

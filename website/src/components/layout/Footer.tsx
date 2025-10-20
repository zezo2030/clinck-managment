import React from 'react';
import { CONTACT_INFO, NAVIGATION_LINKS, SITE_CONFIG } from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-400 mb-4">
              {SITE_CONFIG.name}
            </h3>
            <p className="text-gray-300 mb-4">
              {SITE_CONFIG.description} الذي يوفر رعاية طبية ذكية ومتطورة
              لجميع المرضى مع أحدث التقنيات والحلول الطبية المتقدمة.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-gray-300">
              <li>{CONTACT_INFO.address}</li>
              <li>{CONTACT_INFO.phone}</li>
              <li>{CONTACT_INFO.email}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 عيادة ذكية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

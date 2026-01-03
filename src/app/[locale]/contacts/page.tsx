'use client';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactsPage() {
  const t = useTranslations('contacts');
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">{t('phone')}</h3>
              <a href={`tel:${siteConfig.contacts.phone}`} className="text-text-muted hover:text-primary">
                {siteConfig.contacts.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">{t('email')}</h3>
              <a href={`mailto:${siteConfig.contacts.email}`} className="text-text-muted hover:text-primary">
                {siteConfig.contacts.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">{t('address')}</h3>
              <p className="text-text-muted">{siteConfig.contacts.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Режим работы</h3>
              <p className="text-text-muted">{siteConfig.contacts.workHours}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Напишите нам</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Ваше имя" className="w-full px-4 py-2 border rounded-lg" />
            <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
            <textarea placeholder="Сообщение" rows={4} className="w-full px-4 py-2 border rounded-lg" />
            <button type="submit" className="btn-primary w-full py-3">Отправить</button>
          </form>
        </div>
      </div>
    </div>
  );
}

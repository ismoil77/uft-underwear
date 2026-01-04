'use client';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import useContacts from '@/config/useContacts'

export default function ContactsPage() {

    const { phone, email, address, schedule, telegram, whatsapp, instagram } = useContacts();

  const t = useTranslations('contacts');
  const tConsultation = useTranslations('')
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">{t('phone')}</h3>
              <a href={`tel:${phone}`} className="text-text-muted hover:text-primary">
                {phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">{t('email')}</h3>
              <a href={`mailto:${email}`} className="text-text-muted hover:text-primary">
                {email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">{t('address')}</h3>
              <p className="text-text-muted">{address}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Режим работы</h3>
              <p className="text-text-muted">{schedule}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">{tConsultation('consultation.getConsultation')}</h2>
          <form className="space-y-4">
            <input type="text" placeholder={tConsultation('checkout.name')} className="w-full px-4 py-2 border rounded-lg" />
            <input type="email" placeholder={tConsultation('checkout.email')}  className="w-full px-4 py-2 border rounded-lg" />
            <textarea placeholder={tConsultation('checkout.comment')}  rows={4} className="w-full px-4 py-2 border rounded-lg" />
            <button type="submit" className="btn-primary w-full py-3">Отправить</button>
          </form>
        </div>
      </div>
    </div>
  );
}

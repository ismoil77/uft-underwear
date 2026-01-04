'use client';

import { useState, useEffect } from 'react';
import { socialMediaAPI } from '@/lib/api';
import { SocialMedia } from '@/types/api';

// Хук для использования в компонентах
export function useContacts() {
  const [contacts, setContacts] = useState<SocialMedia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socialMediaAPI.get()
      .then((data) => {
        if (data) setContacts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    loading,
    phone: contacts?.phone,
    email: contacts?.email,
    address: contacts?.address,
    schedule: contacts?.schedule,
    telegram: contacts?.telegram,
    whatsapp: contacts?.whatsapp,
    instagram: contacts?.instagram,
    raw: contacts,
  };
}

export default useContacts;

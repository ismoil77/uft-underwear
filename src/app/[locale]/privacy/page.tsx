'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { policyAPI } from '@/lib/api';
import { Locale } from '@/config/api.config';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  const locale = useLocale() as Locale;
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    policyAPI.get()
      .then((data) => setPolicy(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Заголовки на разных языках
  const titles = {
    ru: 'Политика конфиденциальности',
    en: 'Privacy Policy',
    uz: 'Maxfiylik siyosati',
    tj: 'Сиёсати махфият',
  };

  // Дефолтный контент на разных языках
  const defaultContent = {
    ru: `
      <h2>1. Общие положения</h2>
      <p>Настоящая политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта.</p>
      
      <h2>2. Сбор информации</h2>
      <p>Мы собираем следующую информацию:</p>
      <ul>
        <li>Имя и контактные данные при оформлении заказа</li>
        <li>Адрес доставки</li>
        <li>Историю заказов</li>
        <li>Данные об использовании сайта (cookies)</li>
      </ul>
      
      <h2>3. Использование информации</h2>
      <p>Собранная информация используется для:</p>
      <ul>
        <li>Обработки и доставки заказов</li>
        <li>Связи с вами по вопросам заказов</li>
        <li>Улучшения качества обслуживания</li>
        <li>Персонализации предложений</li>
      </ul>
      
      <h2>4. Защита данных</h2>
      <p>Мы применяем современные методы защиты данных и не передаем персональную информацию третьим лицам без вашего согласия.</p>
      
      <h2>5. Ваши права</h2>
      <p>Вы имеете право:</p>
      <ul>
        <li>Запросить информацию о ваших данных</li>
        <li>Потребовать исправления неточных данных</li>
        <li>Отозвать согласие на обработку данных</li>
        <li>Запросить удаление ваших данных</li>
      </ul>
      
      <h2>6. Контакты</h2>
      <p>По вопросам конфиденциальности обращайтесь на нашу страницу контактов.</p>
    `,
    en: `
      <h2>1. General Provisions</h2>
      <p>This privacy policy defines the procedure for processing and protecting personal data of website users.</p>
      
      <h2>2. Information Collection</h2>
      <p>We collect the following information:</p>
      <ul>
        <li>Name and contact details when placing an order</li>
        <li>Delivery address</li>
        <li>Order history</li>
        <li>Website usage data (cookies)</li>
      </ul>
      
      <h2>3. Use of Information</h2>
      <p>Collected information is used for:</p>
      <ul>
        <li>Processing and delivering orders</li>
        <li>Contacting you regarding orders</li>
        <li>Improving service quality</li>
        <li>Personalizing offers</li>
      </ul>
      
      <h2>4. Data Protection</h2>
      <p>We use modern data protection methods and do not share personal information with third parties without your consent.</p>
      
      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Request information about your data</li>
        <li>Request correction of inaccurate data</li>
        <li>Withdraw consent to data processing</li>
        <li>Request deletion of your data</li>
      </ul>
      
      <h2>6. Contact</h2>
      <p>For privacy concerns, please visit our contact page.</p>
    `,
    uz: `
      <h2>1. Umumiy qoidalar</h2>
      <p>Ushbu maxfiylik siyosati veb-sayt foydalanuvchilarining shaxsiy ma'lumotlarini qayta ishlash va himoya qilish tartibini belgilaydi.</p>
      
      <h2>2. Ma'lumot yig'ish</h2>
      <p>Biz quyidagi ma'lumotlarni yig'amiz:</p>
      <ul>
        <li>Buyurtma berishda ism va kontakt ma'lumotlari</li>
        <li>Yetkazib berish manzili</li>
        <li>Buyurtmalar tarixi</li>
        <li>Saytdan foydalanish ma'lumotlari (cookies)</li>
      </ul>
      
      <h2>3. Ma'lumotdan foydalanish</h2>
      <p>Yig'ilgan ma'lumotlar quyidagilar uchun ishlatiladi:</p>
      <ul>
        <li>Buyurtmalarni qayta ishlash va yetkazib berish</li>
        <li>Buyurtmalar bo'yicha siz bilan bog'lanish</li>
        <li>Xizmat sifatini yaxshilash</li>
        <li>Takliflarni shaxsiylashtirish</li>
      </ul>
      
      <h2>4. Ma'lumotlarni himoya qilish</h2>
      <p>Biz zamonaviy ma'lumotlarni himoya qilish usullarini qo'llaymiz va sizning roziligingiz bo'lmasa shaxsiy ma'lumotlarni uchinchi shaxslarga bermaydi.</p>
      
      <h2>5. Sizning huquqlaringiz</h2>
      <p>Sizda quyidagi huquqlar bor:</p>
      <ul>
        <li>Ma'lumotlaringiz haqida ma'lumot so'rash</li>
        <li>Noto'g'ri ma'lumotlarni tuzatishni talab qilish</li>
        <li>Ma'lumotlarni qayta ishlashga rozilikni qaytarib olish</li>
        <li>Ma'lumotlaringizni o'chirishni so'rash</li>
      </ul>
      
      <h2>6. Kontakt</h2>
      <p>Maxfiylik bo'yicha savollar uchun kontaktlar sahifamizga murojaat qiling.</p>
    `,
    tj: `
      <h2>1. Қоидаҳои умумӣ</h2>
      <p>Ин сиёсати махфият тартиби коркард ва ҳифзи маълумоти шахсии корбарони сайтро муайян мекунад.</p>
      
      <h2>2. Ҷамъоварии маълумот</h2>
      <p>Мо маълумоти зеринро ҷамъ меорем:</p>
      <ul>
        <li>Ном ва маълумоти тамос ҳангоми супориш</li>
        <li>Суроғаи расонидан</li>
        <li>Таърихи супоришҳо</li>
        <li>Маълумот дар бораи истифодаи сайт (cookies)</li>
      </ul>
      
      <h2>3. Истифодаи маълумот</h2>
      <p>Маълумоти ҷамъовардашуда барои ин истифода мешавад:</p>
      <ul>
        <li>Коркард ва расонидани супоришҳо</li>
        <li>Алоқа бо шумо оид ба супоришҳо</li>
        <li>Беҳтар кардани сифати хидматрасонӣ</li>
        <li>Шахсисозии пешниҳодҳо</li>
      </ul>
      
      <h2>4. Ҳифзи маълумот</h2>
      <p>Мо усулҳои муосири ҳифзи маълумотро истифода мебарем ва маълумоти шахсиро бе розигии шумо ба шахсони сеюм намедиҳем.</p>
      
      <h2>5. Ҳуқуқҳои шумо</h2>
      <p>Шумо ҳуқуқ доред:</p>
      <ul>
        <li>Маълумот дар бораи маълумоти худ пурсед</li>
        <li>Ислоҳи маълумоти нодурустро талаб кунед</li>
        <li>Розигии коркарди маълумотро бозпас гиред</li>
        <li>Нест кардани маълумоти худро талаб кунед</li>
      </ul>
      
      <h2>6. Тамос</h2>
      <p>Барои саволҳо оид ба махфият ба саҳифаи тамосҳои мо муроҷиат кунед.</p>
    `,
  };

  // Получаем контент на текущем языке
  const getContent = () => {
    if (policy && policy[locale]?.content) {
      return policy[locale].content;
    }
    return defaultContent[locale] || defaultContent.ru;
  };

  return (
    <div className="container py-12 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">{titles[locale] || titles.ru}</h1>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
          ))}
        </div>
      ) : (
        <div 
          className="prose prose-lg max-w-none prose-headings:text-secondary prose-headings:font-semibold prose-p:text-text-muted prose-li:text-text-muted prose-ul:list-disc prose-ul:pl-5"
          dangerouslySetInnerHTML={{ __html: getContent().replace(/\n/g, '') }}
        />
      )}
    </div>
  );
}
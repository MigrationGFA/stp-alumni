import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Hero');

  return (
    <main className='p-8 bg-black text-gray-100 hover:text-red-500'>
      <h1>{t('welcome')}</h1>
      <p>{t('subtitle')}</p>

      <LanguageSwitcher/>
    </main>
  );
}
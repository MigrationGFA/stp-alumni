'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from '@/i18n/routing';

export default function SignupPasswordPage() {
  const t = useTranslations('SignupPassword');
  const router = useRouter();

  const handleContinue = () => {
    router.push('/profile-setup');
  };

  return (
    <div className="min-h-screen flex px-4 sm:px-6 lg:px-12 xl:px-16 gap-6 lg:gap-8">
      {/* Left side - Image with gradient overlay */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pl-0 pr-4 py-8">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src="/assets/Signup.jpg"
            alt="Password setup background"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#155DFC]/30 to-[#155DFC]/60" />
        </div>
      </div>

      {/* Right side - Password form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('subtitle')}</p>

          {/* Password Input */}
          <div className="mb-4">
            <Label htmlFor="password" className="text-gray-700 mb-2 block">
              {t('password')}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              className="w-full"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block">
              {t('confirmPassword')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              className="w-full"
            />
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
          >
            {t('continueButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}






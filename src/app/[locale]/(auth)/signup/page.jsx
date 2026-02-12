'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useRouter } from '@/i18n/routing';
import { setRegisteredCookie } from '@/lib/auth-cookie';

export default function SignupPage() {
  const t = useTranslations('Signup');
  const router = useRouter();

  const handleContinue = () => {
    // TODO: Add form validation and data submission
    router.push('/signup-password');
  };



  return (
    <div className="min-h-screen flex px-4 sm:px-6 lg:px-12 xl:px-16 gap-6 lg:gap-8">
      {/* Left side - Image with gradient overlay */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pl-0 pr-4 py-8">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src="/assets/Signup.jpg"
            alt="Signup background"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#155DFC]/30 to-[#155DFC]/60" />
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('subtitle')}</p>


          {/* First Name Input */}
          <div className="mb-4">
            <Label htmlFor="firstName" className="text-gray-700 mb-2 block">
              {t('firstName')}
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder={t('firstNamePlaceholder')}
              className="w-full"
            />
          </div>

          {/* Last Name Input */}
          <div className="mb-4">
            <Label htmlFor="lastName" className="text-gray-700 mb-2 block">
              {t('lastName')}
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder={t('lastNamePlaceholder')}
              className="w-full"
            />
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <Label htmlFor="email" className="text-gray-700 mb-2 block">
              {t('email')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              className="w-full"
            />
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white mb-6"
          >
            {t('continueButton')}
          </Button>

          {/* Login link */}
          <div className="text-center text-sm text-gray-600">
            {t('alreadyMember')}{' '}
            <Link href="/login" className="text-[#155DFC] hover:underline font-medium">
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}






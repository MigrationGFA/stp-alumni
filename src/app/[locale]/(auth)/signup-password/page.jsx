'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from '@/i18n/routing';
import { useMutation } from '@tanstack/react-query';
import authService from '@/lib/services/authService';
import useSignupStore from '@/lib/store/useSignupStore';
import { toast } from 'sonner';

export default function SignupPasswordPage() {
  const t = useTranslations('SignupPassword');
  const router = useRouter();

  const { signupData, clearSignupData } = useSignupStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Redirect back if user lands here without filling step 1
  useEffect(() => {
    if (!signupData.emailAddress) {
      router.replace('/signup');
    }
  }, [signupData, router]);

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success(t('signupSuccess', { fallback: 'Account created successfully!' }));
      // Clear the temporary store once we successfully register
      clearSignupData();
      // Redirect to login or automatically log them in depending on backend behavior
      // Currently redirecting to login based on common patterns
      router.push('/login');
    },
    onError: (error) => {
      console.error('Registration error:', error);
      let errorMessage = error.response?.data?.message;

      if (errorMessage === "The email field must contain a unique value.") {
        errorMessage = t('emailInUse', { fallback: 'Email already in use' });
      }

      toast.error(
        errorMessage ||
        t('signupError', { fallback: 'Registration failed. Please try again.' })
      );
    },
  });

  const handleContinue = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error(t('fillAllFields', { fallback: 'Please fill in all fields' }));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t('passwordMismatch', { fallback: 'Passwords do not match' }));
      return;
    }

    // Combine data and submit
    const finalData = {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      emailAddress: signupData.emailAddress,
      password,
    };

    registerMutation.mutate(finalData);
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmPasswordPlaceholder')}
              className="w-full"
            />
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={registerMutation.isPending}
            className="w-full h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
          >
            {registerMutation.isPending ? t('registering', { fallback: 'Creating account...' }) : t('continueButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}






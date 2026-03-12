'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useRouter } from '@/i18n/routing';
import { useMutation } from '@tanstack/react-query';
import authService from '@/lib/services/authService';
import useAuthStore from '@/lib/store/useAuthStore';
import { toast } from 'sonner';

export default function LoginPage() {
  const t = useTranslations('Login');
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const setLoginSession = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      // The backend returns: { status: true, message: "Login successful", data: { token: "..." } }
      const token = response?.data?.token || response?.token;

      // Since the API only returns a token (not user details), we will store what we have.
      // A follow-up `authService.getProfile()` might be needed to get user details later.
      const user = response?.data?.user || { emailAddress };

      setLoginSession(user, token);
      toast.success(t('loginSuccess', { fallback: 'Logged in successfully!' }));
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.message ||
        t('loginError', { fallback: 'Invalid credentials. Please try again.' })
      );
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!emailAddress || !password) {
      toast.error(t('fillAllFields', { fallback: 'Please fill in all fields' }));
      return;
    }

    loginMutation.mutate({ emailAddress, password });
  };

  return (
    <div className="min-h-screen flex px-4 sm:px-6 lg:px-12 xl:px-16 gap-6 lg:gap-8">
      {/* Left side - Image with gradient overlay */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pl-0 pr-4 py-8">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src="/assets/Login.jpg"
            alt="Login background"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#155DFC]/30 to-[#155DFC]/60" />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('subtitle')}</p>



          {/* OR separator */}
          {/* <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">{t('or')}</span>
            </div>
          </div> */}

          {/* Email Input */}
          <div className="mb-4">
            <Label htmlFor="email" className="text-gray-700 mb-2 block">
              {t('email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
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

          {/* Login Button */}
          <Button
            className="w-full h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white mb-6"
            onClick={handleLogin}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? t('loggingIn', { fallback: 'Logging in...' }) : t('loginButton')}
          </Button>

          {/* Sign up link */}
          <div className="text-center text-sm text-gray-600">
            {t('notMember')}{' '}
            <Link href="/signup" className="text-[#155DFC] hover:underline font-medium">
              {t('createAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}






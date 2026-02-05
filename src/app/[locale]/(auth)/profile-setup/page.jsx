'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CloudUpload } from 'lucide-react';
import { useState, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { setRegisteredCookie } from '@/lib/auth-cookie';

export default function ProfileSetupPage() {
  const t = useTranslations('ProfileSetup');
  const router = useRouter();
  const [sectors, setSectors] = useState([]);
  const [sectorInput, setSectorInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const profileImageInputRef = useRef(null);

  const handleAddSector = (e) => {
    if (e.key === 'Enter' && sectorInput.trim()) {
      e.preventDefault();
      setSectors([...sectors, sectorInput.trim()]);
      setSectorInput('');
    }
  };

  const handleRemoveSector = (index) => {
    setSectors(sectors.filter((_, i) => i !== index));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleProfileImageClick = () => {
    profileImageInputRef.current?.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here if needed
      console.log('Profile image selected:', file);
    }
  };

  const handleContinue = () => {
    // TODO: Add form validation and data submission
    setRegisteredCookie();
    router.push('/dashboard');
  };

  return (
    <div className="h-screen flex overflow-hidden px-4 sm:px-6 lg:px-12 xl:px-16 gap-6 lg:gap-8">
      {/* Left side - Image with gradient overlay */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pl-0 pr-4 py-8 sticky top-0 h-screen">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src="/assets/Profile setup.jpg"
            alt="Profile setup background"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#155DFC]/30 to-[#155DFC]/60" />
        </div>
      </div>

      {/* Right side - Profile setup form */}
      <div className="flex-1 flex items-start justify-center bg-gray-50 px-4 sm:px-6 lg:px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('subtitle')}</p>

          {/* Sector Input */}
          <div className="mb-4">
            <Label htmlFor="sector" className="text-gray-700 mb-2 block">
              {t('sector')}
            </Label>
            <Input
              id="sector"
              type="text"
              placeholder={t('sectorPlaceholder')}
              className="w-full"
              value={sectorInput}
              onChange={(e) => setSectorInput(e.target.value)}
              onKeyDown={handleAddSector}
            />
            {/* Sector tags */}
            {sectors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {sectors.map((sector, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#155DFC] text-[#155DFC] text-sm bg-transparent"
                  >
                    {sector}
                    <button
                      onClick={() => handleRemoveSector(index)}
                      className="ml-1 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Location Input */}
          <div className="mb-4">
            <Label htmlFor="location" className="text-gray-700 mb-2 block">
              {t('location')}
            </Label>
            <Input
              id="location"
              type="text"
              placeholder={t('locationPlaceholder')}
              className="w-full"
            />
          </div>

          {/* Skills Input */}
          <div className="mb-4">
            <Label htmlFor="skills" className="text-gray-700 mb-2 block">
              {t('skills')}
            </Label>
            <Input
              id="skills"
              type="text"
              placeholder={t('skillsPlaceholder')}
              className="w-full"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
            />
            {/* Skills tags */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#155DFC] text-[#155DFC] text-sm bg-transparent"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-1 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Upload Profile Image */}
          <div className="mb-4">
            <input
              type="file"
              ref={profileImageInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              className="hidden"
            />
            <div 
              onClick={handleProfileImageClick}
              className="border border-[#155DFC] rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <CloudUpload className="w-8 h-8 mx-auto mb-2 text-[#155DFC]" />
              <p className="text-sm text-gray-600">{t('uploadProfileImage')}</p>
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="mb-4">
            <Label htmlFor="linkedin" className="text-gray-700 mb-2 block">
              {t('linkedin')}
            </Label>
            <Input
              id="linkedin"
              type="url"
              placeholder={t('linkedinPlaceholder')}
              className="w-full"
            />
          </div>

          {/* Goals Textarea */}
          <div className="mb-6">
            <Label htmlFor="goals" className="text-gray-700 mb-2 block">
              {t('goals')}
            </Label>
            <textarea
              id="goals"
              placeholder={t('goalsPlaceholder')}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
              rows={4}
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






'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { CloudUpload, X, Check, ChevronsUpDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useMutation } from '@tanstack/react-query';
import userService from '@/lib/services/userService';
import useAuthStore from '@/lib/store/useAuthStore';
import { SECTORS, SKILL_SUGGESTIONS } from '@/lib/constants/profileOptions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProfileSetupPage() {
  const t = useTranslations('ProfileSetup');
  const router = useRouter();
  const isOnboarded = useAuthStore((state) => state.isOnboarded);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);

  useEffect(() => {
    if (isAuthenticated && isOnboarded) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isOnboarded, router]);

  // Form state
  const [sectors, setSectors] = useState([]);
  const [sectorOpen, setSectorOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillOpen, setSkillOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [linkedInProfile, setLinkedInProfile] = useState('');
  const [goals, setGoals] = useState('');
  const [cohort, setCohort] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const profileImageInputRef = useRef(null);

  // Fetch countries on mount
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name')
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sorted);
      })
      .catch(() => {
        // Fallback list if API fails
        setCountries([
          'Benin', 'Cameroon', 'Canada', 'Côte d\'Ivoire', 'France',
          'Gabon', 'Germany', 'Ghana', 'Kenya', 'Nigeria', 'Rwanda',
          'Senegal', 'South Africa', 'Togo', 'United Kingdom', 'United States',
        ]);
      })
      .finally(() => setCountriesLoading(false));
  }, []);

  const setupMutation = useMutation({
    mutationFn: userService.setupProfile,
    onSuccess: () => {
      updateUser({ isOnboarded: true });
      toast.success(t('setupSuccess'));
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Profile setup error:', error);
      toast.error(error.response?.data?.message || t('setupError'));
    },
  });

  // Sector handlers
  const handleToggleSector = (sector) => {
    setSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  // Skill handlers
  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
    setSkillOpen(false);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Image handlers
  const handleProfileImageClick = () => profileImageInputRef.current?.click();

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setProfileImage(null);
    setImagePreview(null);
  };

  // Submit
  const handleSubmit = () => {
    if (sectors.length === 0 || !location.trim() || skills.length === 0) {
      toast.error(t('fillRequired'));
      return;
    }

    const formData = new FormData();
    sectors.forEach((s, i) => formData.append(`sector[${i}]`, s));
    formData.append('location', location);
    skills.forEach((s, i) => formData.append(`skills[${i}]`, s));
    if (linkedInProfile) formData.append('linkedInProfile', linkedInProfile);
    if (goals) formData.append('goals', goals);
    if (cohort) formData.append('cohort', cohort);
    if (profileImage) formData.append('profileImage', profileImage);

    setupMutation.mutate(formData);
  };

  if (isAuthenticated && isOnboarded) return null;

  // Filter countries for search
  const filteredCountries = locationSearch
    ? countries.filter((c) => c.toLowerCase().includes(locationSearch.toLowerCase()))
    : countries;

  // Filter skill suggestions (exclude already selected, match input)
  const filteredSkills = SKILL_SUGGESTIONS.filter(
    (s) => !skills.includes(s) && s.toLowerCase().includes(skillInput.toLowerCase())
  );

  return (
    <div className="h-screen flex overflow-hidden px-4 sm:px-6 lg:px-12 xl:px-16 gap-6 lg:gap-8">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pl-0 pr-4 py-8 sticky top-0 h-screen">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src="/assets/Profile setup.jpg"
            alt="Profile setup background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#155DFC]/30 to-[#155DFC]/60" />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-start justify-center bg-gray-50 px-4 sm:px-6 lg:px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('subtitle')}</p>

          {/* Sector - Multi-select dropdown */}
          <div className="mb-4">
            <Label className="text-gray-700 mb-2 block">
              {t('sector')} <span className="text-red-500">*</span>
            </Label>
            <Popover open={sectorOpen} onOpenChange={setSectorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={sectorOpen}
                  className="w-full justify-between h-auto min-h-10 font-normal text-left"
                  disabled={setupMutation.isPending}
                >
                  <span className={cn("truncate", sectors.length === 0 && "text-muted-foreground")}>
                    {sectors.length > 0
                      ? `${sectors.length} sector${sectors.length > 1 ? 's' : ''} selected`
                      : t('sectorPlaceholder')}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder={t('sectorSearch')} />
                  <CommandList>
                    <CommandEmpty>{t('noResults')}</CommandEmpty>
                    <CommandGroup>
                      {SECTORS.map((sector) => (
                        <CommandItem
                          key={sector}
                          value={sector}
                          onSelect={() => handleToggleSector(sector)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              sectors.includes(sector) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {sector}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {sectors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {sectors.map((sector) => (
                  <span key={sector} className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#155DFC] text-[#155DFC] text-sm bg-transparent">
                    {sector}
                    <button onClick={() => handleToggleSector(sector)} className="ml-1 hover:text-gray-600">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Location - Searchable country combobox */}
          <div className="mb-4">
            <Label className="text-gray-700 mb-2 block">
              {t('location')} <span className="text-red-500">*</span>
            </Label>
            <Popover open={locationOpen} onOpenChange={setLocationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={locationOpen}
                  className="w-full justify-between font-normal"
                  disabled={setupMutation.isPending || countriesLoading}
                >
                  <span className={cn(!location && "text-muted-foreground")}>
                    {location || (countriesLoading ? t('loadingCountries') : t('locationPlaceholder'))}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t('locationSearch')}
                    value={locationSearch}
                    onValueChange={setLocationSearch}
                  />
                  <CommandList>
                    <CommandEmpty>{t('noResults')}</CommandEmpty>
                    <CommandGroup>
                      {filteredCountries.map((country) => (
                        <CommandItem
                          key={country}
                          value={country}
                          onSelect={() => {
                            setLocation(country);
                            setLocationOpen(false);
                            setLocationSearch('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              location === country ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {country}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Skills - Autocomplete with custom input */}
          <div className="mb-4">
            <Label className="text-gray-700 mb-2 block">
              {t('skills')} <span className="text-red-500">*</span>
            </Label>
            <Popover open={skillOpen} onOpenChange={setSkillOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    placeholder={t('skillsPlaceholder')}
                    className="w-full"
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      if (e.target.value) setSkillOpen(true);
                    }}
                    onFocus={() => { if (skillInput) setSkillOpen(true); }}
                    onKeyDown={handleSkillKeyDown}
                    disabled={setupMutation.isPending}
                  />
                </div>
              </PopoverTrigger>
              {filteredSkills.length > 0 && (
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {filteredSkills.slice(0, 8).map((skill) => (
                          <CommandItem
                            key={skill}
                            value={skill}
                            onSelect={() => handleAddSkill(skill)}
                          >
                            {skill}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#155DFC] text-[#155DFC] text-sm bg-transparent">
                    {skill}
                    <button onClick={() => handleRemoveSkill(index)} className="ml-1 hover:text-gray-600">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cohort */}
          <div className="mb-4">
            <Label htmlFor="cohort" className="text-gray-700 mb-2 block">
              {t('cohort')}
            </Label>
            <Input
              id="cohort"
              type="text"
              placeholder={t('cohortPlaceholder')}
              className="w-full"
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              disabled={setupMutation.isPending}
            />
          </div>

          {/* Upload Profile Image */}
          <div className="mb-4">
            <Label className="text-gray-700 mb-2 block">{t('uploadProfileImage')}</Label>
            <input
              type="file"
              ref={profileImageInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              className="hidden"
              disabled={setupMutation.isPending}
            />
            {imagePreview ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#155DFC]">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={handleProfileImageClick}
                className="border border-[#155DFC] rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <CloudUpload className="w-8 h-8 mx-auto mb-2 text-[#155DFC]" />
                <p className="text-sm text-gray-600">{t('clickToUpload')}</p>
              </div>
            )}
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
              value={linkedInProfile}
              onChange={(e) => setLinkedInProfile(e.target.value)}
              disabled={setupMutation.isPending}
            />
          </div>

          {/* Goals */}
          <div className="mb-6">
            <Label htmlFor="goals" className="text-gray-700 mb-2 block">
              {t('goals')}
            </Label>
            <textarea
              id="goals"
              placeholder={t('goalsPlaceholder')}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
              rows={4}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              disabled={setupMutation.isPending}
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={setupMutation.isPending}
            className="w-full h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
          >
            {setupMutation.isPending ? t('submitting') : t('continueButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}

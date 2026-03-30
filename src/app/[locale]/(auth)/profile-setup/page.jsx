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
import { CloudUpload, X, Check, ChevronsUpDown, User, Building2, ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useMutation } from '@tanstack/react-query';
import userService from '@/lib/services/userService';
import useAuthStore from '@/lib/store/useAuthStore';
import { SECTORS, SKILL_SUGGESTIONS } from '@/lib/constants/profileOptions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BUSINESS_MODELS = [
  'B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS', 'D2C', 'Franchise',
  'Non-profit', 'Social Enterprise', 'Other',
];

const COMPANY_STAGES = [
  'Idea / Pre-revenue',
  'MVP / Early traction',
  '1–10 employees',
  '10–50 employees',
  '50–200 employees',
  '200+ employees',
];

const OFFER_TAGS = [
  'Fundraising advice', 'Raising Series A', 'Raising Seed', 'Angel investing',
  'Technical Co-founder', 'Product strategy', 'Go-to-market', 'Sales & BD',
  'Marketing & Growth', 'Legal & Compliance', 'HR & Talent', 'Finance & CFO',
  'Design & UX', 'Operations', 'Mentorship', 'Customer introductions',
  'Media & PR', 'M&A advisory',
];

const NEED_TAGS = [
  'Technical Co-founder', 'Fundraising', 'Sales leads', 'Strategic partnerships',
  'Marketing support', 'Legal advice', 'Hiring support', 'Product feedback',
  'Design help', 'Mentorship', 'Investor introductions', 'Market expansion',
  'Finance advice', 'Operations help', 'PR & Media', 'Board members',
];

const VISIBILITY_OPTIONS = [
  { value: 'all_alumni', label: 'All Alumni', description: 'Your contact info is visible to the entire STP community.' },
  { value: 'admin_only', label: 'Admin Only', description: 'Only programme admins can see your contact details.' },
];


function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, icon: User, label: 'Personal' },
    { num: 2, icon: Building2, label: 'Business' },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = currentStep === step.num;
        const isDone = currentStep > step.num;

        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isActive && 'bg-[#155DFC] border-[#155DFC] text-white shadow-lg shadow-[#155DFC]/30',
                  isDone && 'bg-[#155DFC] border-[#155DFC] text-white',
                  !isActive && !isDone && 'bg-white border-gray-200 text-gray-400'
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={cn(
                'text-xs font-medium transition-colors',
                (isActive || isDone) ? 'text-[#155DFC]' : 'text-gray-400'
              )}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn(
                'w-16 h-0.5 mx-3 mb-5 transition-colors duration-500',
                currentStep > step.num ? 'bg-[#155DFC]' : 'bg-gray-200'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}


function TagSelector({ tags, selected, onToggle, max = 3, label, description }) {
  return (
    <div>
      <Label className="text-gray-700 mb-1 block">
        {label} {max && <span className="text-gray-400 font-normal text-xs">(pick up to {max})</span>}
      </Label>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selected.includes(tag);
          const isDisabled = !isSelected && selected.length >= max;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => !isDisabled && onToggle(tag)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-all duration-150',
                isSelected && 'bg-[#155DFC] border-[#155DFC] text-white',
                !isSelected && !isDisabled && 'border-gray-200 text-gray-600 hover:border-[#155DFC] hover:text-[#155DFC] bg-white',
                isDisabled && 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed',
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}


export default function ProfileSetupPage() {
  const t = useTranslations('ProfileSetup');
  const router = useRouter();
  const isOnboarded = useAuthStore((state) => state.isOnboarded);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isAuthenticated && isOnboarded) {
      // router.replace('/dashboard');
      console.log('hala madrid');
    }
  }, [isAuthenticated, isOnboarded, router]);

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
  const [jobTitle, setJobTitle] = useState('');
  const profileImageInputRef = useRef(null);

  const [companyName, setCompanyName] = useState('');
  const [businessModel, setBusinessModel] = useState('');
  const [businessModelOpen, setBusinessModelOpen] = useState(false);
  const [companyStage, setCompanyStage] = useState('');
  const [companyStageOpen, setCompanyStageOpen] = useState(false);
  const [elevatorPitch, setElevatorPitch] = useState('');
  const [offers, setOffers] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [visibility, setVisibility] = useState('all_alumni');

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name')
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.map((c) => c.name.common).sort((a, b) => a.localeCompare(b));
        setCountries(sorted);
      })
      .catch(() => {
        setCountries([
          'Benin', 'Cameroon', 'Canada', "Côte d'Ivoire", 'France',
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


  const handleToggleSector = (sector) => {
    setSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed]);
    setSkillInput('');
    setSkillOpen(false);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleRemoveSkill = (index) => setSkills(skills.filter((_, i) => i !== index));

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

  const handleToggleOffer = (tag) => {
    setOffers((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleNeed = (tag) => {
    setNeeds((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };


  const handleNextStep = () => {
    console.log("lol")
    if (sectors.length === 0 || !location.trim() || skills.length === 0) {
      toast.error(t('fillRequired'));
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleSubmit = () => {

    if (sectors.length === 0 || !location.trim() || skills.length === 0 || !linkedInProfile.trim() || !goals.trim()) {
      toast.error(t('fillRequired'));
      return;
    }

    const formData = new FormData();

    // Personal info (existing endpoint)
    sectors.forEach((s, i) => formData.append(`sector[${i}]`, s));
    formData.append('location', location);
    skills.forEach((s, i) => formData.append(`skills[${i}]`, s));
    if (linkedInProfile) formData.append('linkedInProfile', linkedInProfile);
    if (goals) formData.append('goals', goals);
    if (cohort) formData.append('cohort', cohort);
    if (profileImage) formData.append('profileImage', profileImage);
    if (jobTitle) formData.append('jobTitle', jobTitle);

    // Business info — append to same formData or send separately once endpoint is ready
    // TODO: Replace with dedicated business endpoint when available
    if (companyName) formData.append('companyName', companyName);
    if (businessModel) formData.append('businessModel', businessModel);
    if (companyStage) formData.append('companyStage', companyStage);
    if (elevatorPitch) formData.append('elevatorPitch', elevatorPitch);
    offers.forEach((o, i) => formData.append(`offers[${i}]`, o));
    needs.forEach((n, i) => formData.append(`needs[${i}]`, n));
    formData.append('contactVisibility', visibility);

    console.log(formData,"lol")

    // setupMutation.mutate(formData);
  };


  const filteredCountries = locationSearch
    ? countries.filter((c) => c.toLowerCase().includes(locationSearch.toLowerCase()))
    : countries;

  const filteredSkills = SKILL_SUGGESTIONS.filter(
    (s) => !skills.includes(s) && s.toLowerCase().includes(skillInput.toLowerCase())
  );

  const sidePanelContent = {
    1: {
      title: 'Build your STP identity',
      subtitle: 'Your personal profile is your face to the alumni community.',
      bullets: ['Visible to all STP alumni', 'Used to match you with relevant peers', 'Editable any time from Settings'],
    },
    2: {
      title: 'Power the Marketplace',
      subtitle: 'Your business details fuel the STP deal room and member directory.',
      bullets: ['Auto-populates your Marketplace card', 'Helps alumni find the right help', 'Control who sees your contact info'],
    },
  };

  const panel = sidePanelContent[step];

  return (
    <div className="h-screen flex overflow-hidden px-4 sm:px-6 lg:px-12 xl:px-16 gap-6 lg:gap-8">

      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pl-0 pr-4 py-8 sticky top-0 h-screen">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src="/assets/Profile setup.jpg"
            alt="Profile setup background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-[#155DFC]/30 to-[#155DFC]/70" />

          {/* Side panel copy */}
          <div className="absolute bottom-10 left-8 right-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
              Step {step} of 2
            </p>
            <h2 className="text-2xl font-bold mb-2 leading-snug">{panel.title}</h2>
            <p className="text-white/80 text-sm mb-5">{panel.subtitle}</p>
            <ul className="space-y-2">
              {panel.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-white/90">
                  <Check className="h-4 w-4 text-white/60 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-start justify-center bg-gray-50 px-4 sm:px-6 lg:px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-6">
            <StepIndicator currentStep={step} />

            {step === 1 && (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{t('title')}</h1>
                <p className="text-gray-500 text-sm">{t('subtitle')}</p>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Your Business</h1>
                <p className="text-gray-500 text-sm">Tell the community about your company — this powers your Marketplace card.</p>
              </>
            )}
          </div>

          {step === 1 && (
            <div className="space-y-4">

              {/* Upload Profile Image */}
              <div>
                <Label className="text-gray-700 mb-2 block">{t('uploadProfileImage')}</Label>
                <input
                  type="file"
                  ref={profileImageInputRef}
                  onChange={handleProfileImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#155DFC] shrink-0">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Looking great!</p>
                      <button
                        onClick={handleRemoveImage}
                        className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> Remove photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={handleProfileImageClick}
                    className="border border-dashed border-[#155DFC]/40 rounded-xl p-6 text-center cursor-pointer hover:bg-[#155DFC]/5 transition-colors"
                  >
                    <CloudUpload className="w-7 h-7 mx-auto mb-2 text-[#155DFC]" />
                    <p className="text-sm text-gray-500">{t('clickToUpload')}</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Job Title */}
              <div>
                <Label htmlFor="jobTitle" className="text-gray-700 mb-2 block">
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g. Co-founder & CEO"
                  className="w-full"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              {/* Cohort */}
              <div>
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
                />
              </div>

              {/* Location */}
              <div>
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
                      disabled={countriesLoading}
                    >
                      <span className={cn(!location && 'text-muted-foreground')}>
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
                              <Check className={cn('mr-2 h-4 w-4', location === country ? 'opacity-100' : 'opacity-0')} />
                              {country}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Sector */}
              <div>
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
                    >
                      <span className={cn('truncate', sectors.length === 0 && 'text-muted-foreground')}>
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
                            <CommandItem key={sector} value={sector} onSelect={() => handleToggleSector(sector)}>
                              <Check className={cn('mr-2 h-4 w-4', sectors.includes(sector) ? 'opacity-100' : 'opacity-0')} />
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

              {/* Skills */}
              <div>
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
                              <CommandItem key={skill} value={skill} onSelect={() => handleAddSkill(skill)}>
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

              {/* LinkedIn */}
              <div>
                <Label htmlFor="linkedin" className="text-gray-700 mb-2 block">
                  {t('linkedin')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder={t('linkedinPlaceholder')}
                  className="w-full"
                  value={linkedInProfile}
                  onChange={(e) => setLinkedInProfile(e.target.value)}
                />
              </div>

              {/* Goals */}
              <div>
                <Label htmlFor="goals" className="text-gray-700 mb-2 block">
                  {t('goals')} <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="goals"
                  placeholder={t('goalsPlaceholder')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                  rows={3}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                />
              </div>

              {/* Settings note */}
              <p className="text-xs text-gray-400 text-center pt-1">
                Profile details can be modified later in Settings.
              </p>

              {/* Next button */}
              <Button
                onClick={handleNextStep}
                className="w-full h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
              >
                Continue to Business Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* ── STEP 2: Business ─────────────────────────────────────────── */}

          {step === 2 && (
            <div className="space-y-4">

              {/* Company name */}
              <div>
                <Label htmlFor="companyName" className="text-gray-700 mb-2 block">
                  Company Name <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="e.g. Acme Inc."
                  className="w-full"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={setupMutation.isPending}
                />
              </div>

              {/* Business Model */}
              <div>
                <Label className="text-gray-700 mb-2 block">Business Model</Label>
                <Popover open={businessModelOpen} onOpenChange={setBusinessModelOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                      disabled={setupMutation.isPending}
                    >
                      <span className={cn(!businessModel && 'text-muted-foreground')}>
                        {businessModel || 'Select a model'}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {BUSINESS_MODELS.map((model) => (
                            <CommandItem
                              key={model}
                              value={model}
                              onSelect={() => {
                                setBusinessModel(model);
                                setBusinessModelOpen(false);
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', businessModel === model ? 'opacity-100' : 'opacity-0')} />
                              {model}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Company Stage */}
              <div>
                <Label className="text-gray-700 mb-2 block">Company Stage</Label>
                <Popover open={companyStageOpen} onOpenChange={setCompanyStageOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                      disabled={setupMutation.isPending}
                    >
                      <span className={cn(!companyStage && 'text-muted-foreground')}>
                        {companyStage || 'Select stage'}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {COMPANY_STAGES.map((stage) => (
                            <CommandItem
                              key={stage}
                              value={stage}
                              onSelect={() => {
                                setCompanyStage(stage);
                                setCompanyStageOpen(false);
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', companyStage === stage ? 'opacity-100' : 'opacity-0')} />
                              {stage}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Elevator Pitch */}
              <div>
                <Label htmlFor="pitch" className="text-gray-700 mb-2 block">
                  Elevator Pitch{' '}
                  <span className="text-gray-400 font-normal text-xs">(one sentence)</span>
                </Label>
                <textarea
                  id="pitch"
                  placeholder="We help African SMEs access affordable trade finance through a mobile-first platform."
                  className="flex min-h-[72px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                  rows={2}
                  value={elevatorPitch}
                  onChange={(e) => setElevatorPitch(e.target.value)}
                  disabled={setupMutation.isPending}
                />
              </div>

              {/* Offers */}
              <TagSelector
                tags={OFFER_TAGS}
                selected={offers}
                onToggle={handleToggleOffer}
                max={3}
                label="What can you offer?"
                description="Skills and experience you can share with fellow alumni."
              />

              {/* Needs */}
              <TagSelector
                tags={NEED_TAGS}
                selected={needs}
                onToggle={handleToggleNeed}
                max={3}
                label="What are you looking for?"
                description="Areas where you'd welcome support from the network."
              />

              {/* Divider */}
              <div className="pt-2 border-t border-gray-100">
                <Label className="text-gray-700 mb-3 block">Contact Visibility</Label>
                <div className="space-y-2">
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                        visibility === opt.value
                          ? 'border-[#155DFC] bg-[#155DFC]/5'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      )}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={opt.value}
                        checked={visibility === opt.value}
                        onChange={() => setVisibility(opt.value)}
                        className="mt-0.5 accent-[#155DFC]"
                        disabled={setupMutation.isPending}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Settings note */}
              <p className="text-xs text-gray-400 text-center">
                Profile details can be modified later in Settings.
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={setupMutation.isPending}
                  className="flex-1 h-11"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={setupMutation.isPending}
                  className="flex-1 h-11 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
                >
                  {setupMutation.isPending ? t('submitting') : 'Complete Setup'}
                  {!setupMutation.isPending && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
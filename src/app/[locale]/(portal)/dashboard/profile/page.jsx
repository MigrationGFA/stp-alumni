"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin, Briefcase, GraduationCap, ExternalLink, Target, Sparkles,
  Building2, Globe, MessageCircle, Users, TrendingUp, ArrowLeft,
  CheckCircle2, Handshake,
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
// Replace with: const { data } = useQuery({ queryKey: ["profile", params.id], queryFn: () => userService.getProfileById(params.id) })

const DUMMY_PROFILE = {
  id: "usr_01",
  name: "Amara Osei-Bonsu",
  jobTitle: "Co-founder & CEO",
  email: "amara@veridian.io",
  profileImagePath: null, // replace with real URL
  cohort: "2021",
  location: "Accra, Ghana",
  sector: ["Fintech", "Climate Tech"],
  skills: ["Product Strategy", "Fundraising", "Go-to-Market", "Data Analytics"],
  linkedInProfile: "https://linkedin.com/in/amara-osei-bonsu",
  goals: "Scaling Veridian across West Africa and building a coalition of climate-focused founders to drive sustainable finance at the grassroots level.",

  // Business
  companyName: "Veridian Finance",
  businessModel: "B2B",
  companyStage: "10–50 employees",
  elevatorPitch: "We help African SMEs access affordable green trade finance through a mobile-first platform that scores climate impact alongside creditworthiness.",
  offers: ["Fundraising advice", "Go-to-market", "Mentorship"],
  needs: ["Investor introductions", "Technical Co-founder", "Market expansion"],
  contactVisibility: "all_alumni",

  // Stats (mock)
  connectionsCount: 84,
  postsCount: 12,
  cohortRank: "West Africa Node",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ children, className }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 overflow-hidden", className)}>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title, badge }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#155DFC]" />
        <span className="text-sm font-semibold text-gray-800">{title}</span>
      </div>
      {badge && (
        <span className="text-[10px] bg-[#155DFC]/10 text-[#155DFC] px-2 py-0.5 rounded-full font-semibold tracking-wide">
          {badge}
        </span>
      )}
    </div>
  );
}

function Pill({ label, variant = "blue" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm border",
        variant === "blue" && "border-[#155DFC]/30 text-[#155DFC] bg-[#155DFC]/5",
        variant === "green" && "border-emerald-200 text-emerald-700 bg-emerald-50",
        variant === "amber" && "border-amber-200 text-amber-700 bg-amber-50",
        variant === "gray" && "border-gray-200 text-gray-600 bg-gray-50",
      )}
    >
      {label}
    </span>
  );
}

function StatBadge({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-5 py-3">
      <span className="text-xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ViewProfilePage({ params }) {
  // TODO: replace dummy with:
  // const { data, isLoading } = useQuery({
  //   queryKey: ["profile", params.id],
  //   queryFn: () => userService.getProfileById(params.id),
  // });
  // const profile = data?.data || data || {};

  const profile = DUMMY_PROFILE;
  const router = useRouter();
  const initials = getInitials(profile.name);

  // TODO: wire to real connect / message actions
  const handleConnect = () => console.log("TODO: connect to", profile.id);
  const handleMessage = () => console.log("TODO: message", profile.id);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative h-40 md:h-52 bg-gradient-to-br from-[#155DFC] via-[#1e4fd8] to-[#233389] overflow-hidden">
        {/* Subtle geometric texture */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/4 translate-x-1/4" />
        <div className="absolute top-4 left-1/2 w-40 h-40 rounded-full bg-white/5 -translate-x-3/4" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 md:left-6 flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* ── Profile Identity ───────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Avatar row — overlapping the banner */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-6">
          <div className="flex items-end gap-4">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-white shadow-xl shrink-0">
              <AvatarImage src={profile.profileImagePath} />
              <AvatarFallback className="bg-[#155DFC] text-white text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{profile.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{profile.jobTitle}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {profile.cohort && (
                  <span className="text-xs bg-[#155DFC]/10 text-[#155DFC] px-2.5 py-0.5 rounded-full font-semibold">
                    Cohort {profile.cohort}
                  </span>
                )}
                {profile.cohortRank && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                    {profile.cohortRank}
                  </span>
                )}
                {profile.contactVisibility === "all_alumni" && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Visible to alumni
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2 sm:pb-1 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMessage}
              className="gap-1.5 border-gray-200"
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
            <Button
              size="sm"
              onClick={handleConnect}
              className="gap-1.5 bg-[#155DFC] hover:bg-[#155DFC]/90 text-white"
            >
              <Handshake className="h-4 w-4" />
              Connect
            </Button>
          </div>
        </div>

        {/* ── Stats Row ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 mb-4 flex divide-x divide-gray-100">
          <StatBadge icon={Users} value={profile.connectionsCount} label="Connections" />
          <StatBadge icon={TrendingUp} value={profile.postsCount} label="Posts" />
          <StatBadge icon={GraduationCap} value={`'${profile.cohort}`} label="Cohort" />
        </div>

        {/* ── Main Grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-12">

          {/* Left column */}
          <div className="lg:col-span-1 space-y-4">

            {/* Quick Info */}
            <SectionCard>
              <CardHeader icon={Globe} title="About" />
              <div className="p-5 space-y-3">
                {profile.location && (
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    {profile.location}
                  </div>
                )}
                {profile.sector?.length > 0 && (
                  <div className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Briefcase className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>{profile.sector.join(" · ")}</span>
                  </div>
                )}
                {profile.linkedInProfile && (
                  <a
                    href={profile.linkedInProfile.startsWith("http") ? profile.linkedInProfile : `https://${profile.linkedInProfile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-[#155DFC] hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </SectionCard>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <SectionCard>
                <CardHeader icon={Sparkles} title="Skills" />
                <div className="p-5 flex flex-wrap gap-2">
                  {profile.skills.map((s) => <Pill key={s} label={s} variant="gray" />)}
                </div>
              </SectionCard>
            )}

            {/* Goals */}
            {profile.goals && (
              <SectionCard>
                <CardHeader icon={Target} title="Goals" />
                <div className="p-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{profile.goals}</p>
                </div>
              </SectionCard>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Business Card */}
            <SectionCard>
              <CardHeader icon={Building2} title="Business Profile" badge="Marketplace" />
              <div className="p-6">
                {/* Company header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{profile.companyName}</h2>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-md">
                      {profile.elevatorPitch}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {profile.businessModel && (
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 font-medium">
                        {profile.businessModel}
                      </span>
                    )}
                    {profile.companyStage && (
                      <span className="text-xs px-3 py-1 rounded-full bg-[#155DFC]/10 text-[#155DFC] border border-[#155DFC]/20 font-medium">
                        {profile.companyStage}
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Offers */}
                    {profile.offers?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                          Can offer
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {profile.offers.map((o) => <Pill key={o} label={o} variant="green" />)}
                        </div>
                      </div>
                    )}

                    {/* Needs */}
                    {profile.needs?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
                          Looking for
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {profile.needs.map((n) => <Pill key={n} label={n} variant="amber" />)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Activity placeholder */}
            <SectionCard>
              <CardHeader icon={TrendingUp} title="Recent Activity" />
              <div className="p-6 space-y-4">
                {/* Dummy posts — replace with real PostCard components */}
                {[
                  {
                    text: "Just closed our pre-seed round! Grateful to the STP network for the introductions that made this possible. 🙌",
                    time: "2 days ago",
                    likes: 34,
                  },
                  {
                    text: "We're hiring a Head of Engineering. If you know anyone passionate about climate-fintech, send them our way.",
                    time: "1 week ago",
                    likes: 18,
                  },
                  {
                    text: "Attended the IFC Africa Summit in Nairobi — incredible conversations around blended finance and climate resilience.",
                    time: "2 weeks ago",
                    likes: 27,
                  },
                ].map((post, i) => (
                  <div key={i} className={cn("pb-4", i < 2 && "border-b border-gray-100")}>
                    <p className="text-sm text-gray-700 leading-relaxed">{post.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">{post.time}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">{post.likes} likes</span>
                    </div>
                  </div>
                ))}

                {/* TODO: replace dummy posts with:
                  myPosts.map(post => <PostCard key={post.id} post={post} ... />)
                */}
              </div>
            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  );
}
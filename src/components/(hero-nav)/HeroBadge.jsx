import { Sparkles } from "lucide-react";

const HeroBadge = ({ text }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full gradient-primary-rtl px-4 py-2 text-sm font-light text-white backdrop-blur-sm dark:border dark:border-[#314158] animate-fade-in">
      <Sparkles className="h-4 w-4 dark:text-[#00D3F2]" />
      <span>{text}</span>
    </div>
  );
};

export default HeroBadge;

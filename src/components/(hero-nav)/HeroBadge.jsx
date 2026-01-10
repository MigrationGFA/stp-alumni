import { Sparkles } from "lucide-react";

const HeroBadge = ({ text,className,iconClass }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full  px-4 py-2 text-sm font-light text-white backdrop-blur-sm animate-fade-in ${className}`}
    >
      <Sparkles className={`h-4 w-4 ${iconClass}`} />
      <span>{text}</span>
    </div>
  );
};

export default HeroBadge;

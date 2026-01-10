import { Network, BookOpen, ShoppingCart, UsersRound } from "lucide-react";
import React from "react";
import { useTranslations } from 'next-intl';

function Everything() {
  const t = useTranslations('Everything');

  const arr = [
    {
      title: t('networkTitle'),
      desc: t('networkDesc'),
      icon: Network,
      iconColor: "from-[#00B8DB] to-[#155DFC]",
    },
    {
      title: t('marketplaceTitle'),
      desc: t('marketplaceDesc'),
      icon: ShoppingCart,
      iconColor: "from-[#AD46FF] to-[#E60076]",
    },
    {
      title: t('mentorshipTitle'),
      desc: t('mentorshipDesc'),
      icon: UsersRound,
      iconColor: "from-[#FF6900] to-[#E7000B]",
    },
    {
      title: t('learningTitle'),
      desc: t('learningDesc'),
      icon: BookOpen,
      iconColor: "from-[#00C950] to-[#009966]",
    },
  ];

  return (
    <section className="dark:bg-linear-to-r dark:from-[#233389] dark:via-[#162456] dark:to-[#233389]">

    <div className="container mx-auto py-20 ">
      <h1 className="text-stp-blue-light font-semibold text-5xl text-center dark:text-white">
        {t('headingMain')}
        <p className="gradient-btn-primary-grew">{t('headingGradient')}</p>
      </h1>

      <p className="text-center text-[#90A1B9] my-7">
        {t('description')}
      </p>

      <div className="flex gap-4 justify-center">
        {arr.map((ele) => (
          <div className="p-4 bg-stp-blue-dark dark:bg-[#0F172B80] rounded-md text-white space-y-2" key={ele.title}>
            <div className={`bg-linear-to-r ${ele.iconColor} p-2 w-fit rounded-lg`}>
              <ele.icon />
            </div>
            <h2 className="text-md">{ele.title}</h2>
            <p className="text-sm font-thin">{ele.desc}</p>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
}

export default Everything;
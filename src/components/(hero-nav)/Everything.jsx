"use client";

import { Network, BookOpen, ShoppingCart, UsersRound } from "lucide-react";
import React from "react";
import { useTranslations } from 'next-intl';
import Container from "../container";

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
    <section className="dark:bg-[#233389]">

    <Container className=" mx-auto py-20 ">
      <h1 className="text-stp-blue-light font-semibold text-5xl text-center dark:text-white">
        {t('headingMain')}
        <p className="gradient-btn-primary-grew">{t('headingGradient')}</p>
      </h1>

      <p className="text-center text-[#90A1B9] my-7">
        {t('description')}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
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
    </Container>
    </section>
  );
}

export default Everything;
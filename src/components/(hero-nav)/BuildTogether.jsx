"use client";

import React from "react";
import TestimonialCarousel from "../TestimonialCarousel";
import { useTranslations } from 'next-intl';

function BuildTogether() {
  const t = useTranslations('BuildTogether');

  const stats = [
    { text: t('activeMember'), num: 10000 },
    { text: t('industries'), num: 50 },
    { text: t('opportunityShared'), num: 5000 },
    { text: t('sanctionRate'), num: 98 },
  ];

  return (
    <div className="bg-[linear-gradient(135deg,#233389_0%,#162456_75%,#233389_100%)] pb-10">
      <div className="text-center flex flex-col gap-5 items-center pt-12">
        <h1 className="text-5xl text-white">
          {t('titleMain')} <br />
          <span className="text-4xl text-grow-together">{t('titleStronger')}</span>
        </h1>
        <p className="text-[#90A1B9]">
          {t('description')}
        </p>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 max-w-4xl">
          {stats.map((ele, i) => (
            <div className="text-center space-y-1 bg-stp-blue-dark py-5 px-18" key={ele.text}>
              <p className="text-[#00D3F2] text-2xl flex items-center">
                {ele.num} 
                <span className="text-lg">
                  {i !== 3 ? "+" : "%"}
                </span>
              </p>
              <p className="text-lg text-[#90A1B9]">{ele.text}</p>
            </div>
          ))}
        </div>
      </div>

      <TestimonialCarousel />
    </div>
  );
}

export default BuildTogether;
"use client";

import { Link } from "@/i18n/routing";
import Container from "./container";
import { useTranslations } from "next-intl";
import { FiFacebook, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { SiInstagram } from "react-icons/si";

export function Footer() {
  const t = useTranslations("Footer");

  const linkColumn = [
    {
      title: t("product.title"),
      links: [
        { label: t("product.features"), href: "#" },
        { label: t("product.marketplace"), href: "#" },
        { label: t("product.mentorship"), href: "#" },
        { label: t("product.learning"), href: "#" },
        { label: t("product.pricing"), href: "#" },
      ],
    },
    {
      title: t("company.title"),
      links: [
        { label: t("company.aboutUs"), href: "/about" },
        { label: t("company.careers"), href: "/careers" },
        { label: t("company.blog"), href: "/blog" },
        { label: t("company.pressKit"), href: "/press-kit" },
        { label: t("company.contact"), href: "/contact" },
      ],
    },
    {
      title: t("legal.title"),
      links: [
        { label: t("legal.privacyPolicy"), href: "#" },
        { label: t("legal.termsOfService"), href: "#" },
        { label: t("legal.cookiePolicy"), href: "#" },
        { label: t("legal.gdpr"), href: "#" },
        { label: t("legal.accessibility"), href: "#" },
      ],
    },
  ];

  const social = [FiFacebook, FiTwitter, FiLinkedin, SiInstagram, FiGithub];

  return (
    <footer className="bg-stp-blue-dark pt-20 pb-10 border-t border-white/5">
      <Container className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-l from-[#00D3F2] to-[#155DFC] text-white font-bold text-sm">
                S
              </div>
              <span className="text-lg font-light text-white">
                {t("brandName")}
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mt-5">
              {t("tagline")}
            </p>

            <div className="flex gap-2 mt-3">
              {social.map((ele, i) => {
                const Icon = ele;

                return (
                  <p className="bg-[#1D293D] p-3 rounded-lg" key={i}>
                    <Icon className="text-[#90A1B9]" />
                  </p>
                );
              })}
            </div>
          </div>

          {/* Footer Link Columns */}
          {linkColumn.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-6">{col.title}</h4>
              <ul className="space-y-4 text-sm text-white/40">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#1D293D] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p className="flex items-center gap-2">✉ {t("email")}</p>
        </div>
      </Container>
    </footer>
  );
}

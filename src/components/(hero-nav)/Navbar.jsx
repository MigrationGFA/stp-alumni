"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing"; // This is the specialized Link
import { useTranslations } from "next-intl";
import { ModeToggle } from "../ModeToggle";
import LanguageSwitcher from "../LanguageSwitcher";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Using translation keys for the labels
  const navLinks = [
    { label: t("features"), href: "/features" },
    { label: t("about"), href: "/about" },
    { label: t("community"), href: "/community" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 ">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo - Link ensures locale prefix like /en or /fr */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2B7FFF] text-white font-bold text-sm">
            S
          </div>
          <span className="text-lg font-semibold text-white">STP Alumni</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className={"border border-white dark:border-[#2B7FFF] text-white dark:text-[#2B7FFF] rounded-sm p-3.75"}
            asChild
          >
            <Link href="/login">
              {t("login")}
            </Link>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gradient-btn-primary-rtl hover:opacity-90 transition-opacity rounded-sm p-3.75"
            asChild
          >
            <Link href="/signup">
              {t("join")}
            </Link>
          </Button>

          <ModeToggle/>
          <LanguageSwitcher/>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background/95 md:hidden">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-4">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-red-500"
                  asChild
                >
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    {t("login")}
                  </Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    {t("join")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

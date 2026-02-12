// app/[locale]/(marketing)/layout.jsx
import Navbar from "@/components/(hero-nav)/Navbar";
import { Footer } from "@/components/Footer";
import { NavbarProvider } from "@/contexts/NavbarContext";

export default function MarketingLayout({ children }) {
  return (
    // <NavbarProvider>
    <>
      <Navbar />
      <div className="min-h-screen bg-background">{children}</div>
      <Footer />
      </>
    // </NavbarProvider>
  );
}
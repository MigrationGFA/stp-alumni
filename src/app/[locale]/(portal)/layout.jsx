import Sidebar from "@/components/shared/Sidebar";
import UserHeader from "./user-header";
import { MobileBottomNav } from "@/components/MobileBottomNav";


export default function PortalLayout({ children }) {
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-0 lg:ml-70 flex flex-col">
        
       <UserHeader/>
      
        <div className="flex-1 p-4 lg:p-6 overflow-auto pb-20 lg:pb-6 bg-[#E8ECF4]">
        {/* <div className="px-8 py-5 overflow-auto flex-1 bg-[#E8ECF4]"> */}
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
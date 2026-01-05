import Sidebar from "@/components/shared/Sidebar";

/**
 * Layout for the portal/dashboard section
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function PortalLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-[280px]">
        {children}
      </main>
    </div>
  );
}







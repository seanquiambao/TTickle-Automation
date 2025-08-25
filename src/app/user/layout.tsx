import Navigation from "@/components/global/navigation";
// import ProtectedPage from "@/components/protected";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User",
  description: "The User Dashboard for Ttickle",
};

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = async ({ children }: LayoutProps) => {
  return (
    <div>
      {/* <ProtectedPage> */}
      <SidebarProvider>
        <Navigation />
        {children}
      </SidebarProvider>
      {/* </ProtectedPage> */}
    </div>
  );
};

export default Layout;

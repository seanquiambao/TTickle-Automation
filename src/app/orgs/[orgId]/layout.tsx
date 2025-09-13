import Navigation from "@/components/global/navigation";
import ProtectedPage from "@/components/protected";
import { SidebarProvider } from "@/components/ui/sidebar";
import { options } from "@/utils/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Organizations",
  description: "The Organizations Dashboard for Ttickle",
};

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = async ({ children }: LayoutProps) => {
  // const session = await getServerSession(options);
  // const header = await headers();
  // const path = header.get("x-url") || "";
  // if (!session?.user.orgId || session?.user.orgId === "") {
  //   redirect("/user");
  // }
  // if (path === "/orgs" || path.startsWith("/orgs/@mine")) {
  //   redirect(path.replace("@mine", session.user.orgId));
  // }
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

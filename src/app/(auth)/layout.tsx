import Navigation from "@/components/live/navigation";

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = async ({ children }: LayoutProps) => {
  return (
    <div>
      {/* <Navigation /> */}
      {children}
    </div>
  );
};

export default Layout;

"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { TABS } from "@/data/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/temporarylogo.png";
import { usePathname, useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
// import { signOut } from "next-auth/react";
import { LogIn } from "lucide-react";
import { serverSignOut } from "@/app/(auth)/actions";
import { auth } from "@/utils/firebase";

const Navigation = () => {
  const path = usePathname().split("/");
  const navParent = path[1];

  const router = useRouter();

  const NAVTABS = TABS[navParent].tabs;
  const generalPath = `${path.slice(0, 2).join("/")}/@mine/${path.slice(3).join("/")}`;
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className={`
        h-screen bg-white text-white border-white/10 border-r flex justify-between rounded-r-3xl shadow-xl transition-all z-30
        ${open ? "" : "w-[70px] min-w-[56px]"}
      `}
    >
      <SidebarHeader className="flex flex-col items-center">
        <Link href="/">
          <Image src={Logo} alt="TTickle Logo" className="hover:scale-105" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col text-lg ml-3 items-start">
        {NAVTABS.map((tab, index) => (
          <SidebarMenu key={index}>
            <Collapsible
              defaultOpen={generalPath.startsWith(tab.link)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild className="">
                  <SidebarGroup
                    key={index}
                    className={`flex flex-row items-center cursor-pointer py-2
                     ${
                       generalPath === tab.link
                         ? "bg-gradient-to-r from-transparent to-ttickles-lightblue shadow-sm"
                         : "hover:bg-gradient-to-r hover:from-transparent hover:to-ttickles-lightblue hover:bg-opacity-50"
                     }
                      gap-3
                                      ${!open ? "justify-center px-4" : ""}
                    `}
                    onClick={() => router.push(tab.link)}
                  >
                    <span className={`${!open && "mx-auto -ml-2"}`}>
                      {tab.icon}
                    </span>
                    {open && (
                      <Link
                        href={tab.link}
                        className="ml-2 mr-1 flex items-center"
                      >
                        {tab.name}
                      </Link>
                    )}
                  </SidebarGroup>
                </CollapsibleTrigger>
                {tab.subtabs && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {tab.subtabs.map((subtab, subindex) => (
                        <Link
                          key={subindex}
                          href={subtab.link}
                          className={`
                            flex flex-row items-center cursor-pointer rounded-md py-2 px-2
                            transition-all duration-200 ease-in-out
                            ${
                              generalPath === subtab.link
                                ? "bg-gradient-to-r from-transparent to-ttickles-lightblue shadow-sm"
                                : "hover:bg-gradient-to-r hover:from-transparent hover:to-ttickles-lightblue hover:bg-opacity-30"
                            }
                            gap-3 text-sm
                            ${!open && "justify-center"}
                          `}
                        >
                          <span className={`${!open && "mx-auto -ml-2"}`}>
                            {subtab.icon}
                          </span>
                          {open && (
                            <Link
                              href={subtab.link}
                              className="ml-2 mr-1 flex items-center"
                            >
                              {subtab.name}
                            </Link>
                          )}
                        </Link>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        ))}
      </SidebarContent>
      <SidebarFooter className="my-1 flex flex-col p-0 pb-2 pl-1 border-t border-white/10 py-3 ">
        <span
          onClick={() => toggleSidebar()}
          className={`${open ? "h-7 pl-3" : "mx-auto h-6"} flex items-center text-lg hover:cursor-pointer`}
        >
          <span className={`${!open && "mx-auto"}`}>
            <SidebarTrigger className="hover:bg-inherit hover:text-current" />
          </span>
          {open && <span className="ml-2 ">Close Sidebar</span>}
        </span>
        <span
          onClick={async () => {
            await auth.signOut();
            const { success } = await serverSignOut();
            if (success) router.push("/login");
          }}
          // onClick={() => signOut({ callbackUrl: "/", redirect: true })}
          className={`${open ? "h-7 pl-3" : "mx-auto h-6"} flex items-center text-lg hover:cursor-pointer`}
        >
          <span className={`${!open && "mx-auto"}`}>
            <LogIn className="mr-1 h-7 p-0.5" />
          </span>
          {open && <span className="ml-2">Log Out</span>}
        </span>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Navigation;

import {
  Users,
  Link,
  Mail,
  Users2,
  Clock,
  ChartArea,
  User,
} from "lucide-react";
interface Tab {
  name: string;
  link: string;
  icon: JSX.Element;
  requiresOrg?: boolean;
  requiresOwner?: boolean;
  subtabs?: Tab[];
}

interface Collapsible {
  expand: boolean;
  tabs: Tab[];
}
type Tabs = Record<string, Collapsible>;

export const TABS: Tabs = {
  user: {
    expand: true,
    tabs: [
      {
        name: "My Organization",
        link: "/orgs/@mine/manage",
        icon: <Users2 />,
        requiresOrg: true,
      },
      {
        name: "Profile",
        link: "/user/profile",
        icon: <User />,
      },
    ],
  },
  orgs: {
    expand: true,
    tabs: [
      {
        name: "Manage",
        link: "/orgs/@mine/manage",
        icon: <Link />,
        requiresOwner: true,
      },
      {
        name: "Newsletter",
        link: "/orgs/@mine/newsletter",
        icon: <Mail />,
        subtabs: [
          {
            name: "Recipients",
            link: "/orgs/@mine/newsletter/recipients",
            icon: <Users size={20} />,
          },
        ],
      },
      {
        name: "History",
        link: "/orgs/@mine/history",
        icon: <Clock />,
      },
      {
        name: "Analytics",
        link: "/orgs/@mine/analytics",
        icon: <ChartArea />,
      },
      {
        name: "Email",
        link: "/orgs/@mine/email",
        icon: <Mail />,
      },
    ],
  },
};

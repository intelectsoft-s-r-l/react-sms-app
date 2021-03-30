import {
  DashboardOutlined,
  MessageOutlined,
  DollarOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export interface INavTree {
  key: string;
  path: string;
  title: string;
  icon: any;
  breadcrumb: boolean;
  submenu: INavTree[];
}

const dashBoardNavTree = [
  {
    key: "dashboard",
    path: "/app/dashboard",
    title: "sidenav.dashboard",
    icon: DashboardOutlined,
    breadcrumb: true,
    submenu: [],
  },
  {
    key: "campaign",
    path: "/app/campaign",
    title: "sidenav.campaign",
    icon: MessageOutlined,
    breadcrumb: true,
    submenu: [],
  },
  {
    key: "tariffs",
    path: "/app/tariffs",
    title: "sidenav.tariffs",
    icon: DollarOutlined,
    breadcrumb: true,
    submenu: [],
  },
  {
    key: "settings",
    path: "/app/settings",
    title: "sidenav.settings",
    icon: SettingOutlined,
    breadcrumb: true,
    submenu: [],
  },
];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;

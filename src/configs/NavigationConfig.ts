import { DashboardOutlined, HomeOutlined } from "@ant-design/icons";

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
    key: "home",
    path: "/app/home",
    title: "sidenav.home",
    icon: HomeOutlined,
    breadcrumb: true,
    submenu: [],
  },
  {
    key: "dashboard",
    path: "/app/dashboard",
    title: "sidenav.dashboard",
    icon: DashboardOutlined,
    breadcrumb: true,
    submenu: [],
  },
];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;

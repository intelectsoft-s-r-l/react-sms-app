import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "constants/ThemeConstant";
import { env } from "./EnvironmentConfig";

export const APP_NAME = "App Starter";
export const API_APP_URL = env!.API_APP_URL;
export const APP_PREFIX_PATH = "/app";
export const AUTH_PREFIX_PATH = "/auth";

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: "en",
  navType: NAV_TYPE_SIDE,
  topNavColor: "#fff",
  headerNavColor: "#193550",
  mobileNav: false,
};

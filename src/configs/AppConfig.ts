import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "constants/ThemeConstant";
import { env } from "./EnvironmentConfig";

export const APP_NAME = "My SMS App";
export const PORTAL_URL = env!.PORTAL_URL;
export const DOMAIN = env!.DOMAIN;
export const APP_ENV = env!.APP_ENV;
export const API_MAIL_URL = env!.API_MAIL_URL;
export const API_PORTAL_URL = env!.API_PORTAL_URL;
export const API_AUTH_URL = env!.API_AUTH_URL;
export const API_SMS_URL = env!.API_SMS_URL;
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

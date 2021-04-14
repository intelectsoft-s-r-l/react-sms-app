const dev = {
  APP_ENV: "dev",
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  API_SMS_URL: "https://dev.edi.md/SMSService/json",
  API_MAIL_URL: "https://dev.edi.md/ISMailService/json",
  PORTAL_URL: "http://localhost.com:3001",
  API_PORTAL_URL: "https://dev.edi.md/ISClientWebAppService/json",
  DOMAIN: "localhost.com",
};

const prod = {
  APP_ENV: "prod",
  API_AUTH_URL: "https://api.edi.md/ISAuthService/json",
  API_SMS_URL: "https://api.edi.md/SMSService/json",
  API_MAIL_URL: "https://api.edi.md/ISMailService/json",
  PORTAL_URL: "https://eservicii.md",
  API_PORTAL_URL: "https://api.edi.md/ISClientWebAppService/json",
  DOMAIN: "eservicii.md",
};

const test = {
  APP_ENV: "test",
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  API_SMS_URL: "https://dev.edi.md/SMSService/json",
  API_MAIL_URL: "https://dev.edi.md/ISMailService/json",
  PORTAL_URL: "https://test.eservicii.md",
  API_PORTAL_URL: "https://dev.edi.md/ISClientWebAppService/json",
  DOMAIN: "eservicii.md",
};

const getEnv = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return dev;
    case "production":
      return prod;
    case "test":
      return test;
    default:
      break;
  }
};

export const env = getEnv();

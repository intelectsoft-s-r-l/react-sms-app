const dev = {
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  API_SMS_URL: "https://dev.edi.md/SMSService/json",
  DOMAIN: "localhost.com",
};

const prod = {
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  API_SMS_URL: "https://dev.edi.md/SMSService/json",
  DOMAIN: "eservicii.md",
};

const test = {
  API_AUTH_URL: "https://api.edi.md/ISAuthService/json",
  API_SMS_URL: "https://api.edi.md/SMSService/json",
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

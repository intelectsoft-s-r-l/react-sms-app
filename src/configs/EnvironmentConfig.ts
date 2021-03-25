const dev = {
  API_APP_URL: "https://api.example.com",
};

const test = {
  API_APP_URL: "https://api.example.com",
};

const prod = {
  API_APP_URL: "https://api.example.com",
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

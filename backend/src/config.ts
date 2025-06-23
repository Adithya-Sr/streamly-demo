
//config manages environment configurations and secrets 
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  mongodbConnectionString: process.env.MONGODB_CONNECTION_STRING || "",
  HMACSecretKey: process.env.HMAC_SECRET_KEY || "sampleSecretKey",
};

export default config;

// module.exports = {
//   host: "localhost",
//   user: "postgres",
//   password: "12345678",
//   database: "seating-allocation-db",
//   port: 5432,
// };
// // db.config.js
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
require('dotenv').config();

const client = new SecretManagerServiceClient();

async function getSecret(name) {
  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.GCP_PROJECT_ID}/secrets/${name}/versions/latest`,
  });

  return version.payload.data.toString("utf8");
}

async function getDbConfig() {
  const dbPassword = await getSecret("mysecret");
  return {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: dbPassword,
    port: 5432,
  };
}

module.exports = getDbConfig;

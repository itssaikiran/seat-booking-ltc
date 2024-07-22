const { Pool } = require("pg");
const getDbConfig = require("../config/db.config");

let pool;

async function initializePool() {
  const dbConfig = await getDbConfig();
  pool = new Pool(dbConfig);

  pool.on("connect", () => {
    console.log("Connected to the database");
  });

  pool.on("error", (err) => {
    console.error("Error connecting to the database:", err);
  });
}

const query = async (text, params) => {
  if (!pool) {
    await initializePool();
  }

  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};

module.exports = {
  query,
  initializePool,
};

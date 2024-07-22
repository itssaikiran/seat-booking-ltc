// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 8080;
// const routes = require('./routes/routes');

// app.use(bodyParser.json());

// app.use(cors());

// app.use(routes);

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
const express = require('express');
const { Pool } = require('pg');
const { getDatabaseConfig } = require('./config');

const app = express();
const port = process.env.PORT || 3000;

async function initializePool() {
    const dbConfig = await getDatabaseConfig();
    return new Pool(dbConfig);
}

app.get('/api/data', async (req, res) => {
    try {
        const pool = await initializePool();
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        res.json(result.rows);
        client.release();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


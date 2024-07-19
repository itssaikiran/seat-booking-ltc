const jwt = require('jsonwebtoken');
const models = require('../models/models');

const JWT_SECRET = '2343434asaflajsdfkljalsibkei'; // Hardcoded JWT secret

exports.signup = (req, res) => {
  const { firstName, lastName, email, password, role, bu, transport } = req.body;
  const token = jwt.sign({ email }, JWT_SECRET);

  models.insertUser(firstName, lastName, email, password, role, bu, transport, (err, result) => {
    if (err) {
      console.error("Error inserting user:", err.message);
      return res.status(500).json({ error: 'Error inserting data into the database' });
    }
    res.status(201).json({ message: 'Data inserted successfully', token });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  models.findUserByEmailAndPassword(email, password, (err, rows) => {
    if (err) {
      console.error('Error fetching user data:', err.message);
      return res.status(500).json({ error: 'Error fetching user data' });
    }

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const newToken = jwt.sign({ email: user.email }, JWT_SECRET);
    res.status(200).json({ message: 'Login successful', token: newToken, role: user.role });
  });
};

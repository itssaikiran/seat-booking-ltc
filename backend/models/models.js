const pool = require('./db');

const insertUser = (firstName, lastName, email, password, role, bu, transport, callback) => {
  const sql = "INSERT INTO users (first_name, last_name, email, password, bu, transport, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
  const values = [firstName, lastName, email, password, bu, transport, role];
  pool.query(sql, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows[0]);
  });
};

const findUserByEmailAndPassword = (email, password, callback) => {
  const sql = 'SELECT * FROM users WHERE email = $1 AND password = $2';
  const values = [email, password];
  pool.query(sql, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
};

const getBu=async()=>{
    const query = 'SELECT * FROM business_unit';
    const values = [];
  
    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
  }

const getAllocatedSetsAdmin=async()=>{
    const query = 'SELECT * FROM seat_allocation';
    const values = [];
  
    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
}

const getSeatingCapacityAdmin=async()=>{
    const query = 'SELECT * FROM seating_capacity';
    const values = [];
  
    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
}

const createSeatingCapacityAdmin=async(body)=>{
  const {country,state,city,floor,capacity}=body
  const values= [country,state,city,parseInt(floor),parseInt(capacity)]
  const query = 'INSERT INTO seating_capacity (country,state,city,floor,capacity) VALUES ($1, $2, $3,$4,$5);';
  //  return values
    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
}

const updateSeatingCapacityAdmin=async(id,capacity)=>{ 
  const query = `
  UPDATE seating_capacity
  SET capacity = $1
  WHERE id = $2;
`;
  const values = [parseInt(capacity), id]; 
    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
}

const deleteSeatingCapacityAdmin=async(id)=>{ 
  const query = `
  DELETE FROM seating_capacity
  WHERE id = $1
`;
const values = [id];

try {
  const res = await pool.query(query, values);
  return res;
} catch (error) {
  console.error('Error executing query:', error);
  throw error;
}
}

const createAllocatedSetsAdmin=async(body)=>{
  const {country,state,city,floor,bu,seats}=body
  const values= [country,state,city,parseInt(floor),bu,seats,seats.length>0?seats.length:0]
  console.log(values,"jjjjjj")
  const query = 'INSERT INTO seat_allocation (country,state,city,floor,bu_id,seats,total) VALUES ($1, $2, $3,$4,$5,$6::int[],$7);';
  //  return values
    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
}

const getSeatingCapacityAdminByFilter=async(values)=>{
  console.log(values,"5555")
  const query = `SELECT SUM(capacity) FROM seating_capacity where country=$1 and state=$2 and city=$3 and floor=$4`;
     try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
}

const getHOEFromTable = async (id) => {
  const sql = `SELECT t1.id, t1.name, t1.manager, t1.role, t2.country, t2.state, t2.city, t2.campus, t2.floor, t2.total, t2.seats
            FROM business_unit AS t1
            INNER JOIN seat_allocation AS t2
            ON t1.id = t2.bu_id
            WHERE t1.id = $1`;
  const values = [id];

  try {
    const { rows } = await pool.query(sql, values);
    //console.log(rows);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
};

const getManagersByHOEIdFromTable = async (id, campus, floor) => {
  const sql = 'SELECT * FROM manager_allocation WHERE hoe_id = $1 AND campus = $2 AND floor = $3 ORDER BY seats_array[1]';
  const values = [id, campus, floor];

  try {
    const { rows } = await pool.query(sql, values);
    //console.log(rows);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
};

const updateManagerData = async (id, seats) => {
  const sql = 'UPDATE manager_allocation SET seats_array = $1 WHERE id = $2';
  const values = [seats, id];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
};

module.exports = {
  insertUser,
  findUserByEmailAndPassword,
  getBu,
  getAllocatedSetsAdmin,
  getSeatingCapacityAdminByFilter,
  createAllocatedSetsAdmin,
  deleteSeatingCapacityAdmin,
  updateSeatingCapacityAdmin,
  createSeatingCapacityAdmin,
  getSeatingCapacityAdmin,
  getHOEFromTable, 
  getManagersByHOEIdFromTable, 
  updateManagerData
};


const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

connection.connect((error) => {
  if (error) {
    console.error('Database connection error:', error);
  } else {
    console.log('MYSQL DB Connected!');
  }
});
module.exports = connection;

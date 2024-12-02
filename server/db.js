require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.USERNAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
  ssl: {
    rejectUnauthorized: false,  // Não rejeita certificados não autorizados (importante em ambientes de desenvolvimento)
  }
});

client.connect()
  .then(() => console.log('Connected to the database!'))
  .catch((err) => console.error('Connection error', err.stack));

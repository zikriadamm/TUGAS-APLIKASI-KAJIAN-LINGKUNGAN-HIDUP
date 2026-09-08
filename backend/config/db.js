const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbName = process.env.DB_NAME || 'bank_sampah_palu';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbDialect = process.env.DB_DIALECT || 'mysql';

let sequelize;

const initDatabase = async () => {
  if (dbDialect === 'sqlite') {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../database/bank_sampah_palu.sqlite'),
      logging: false
    });
    console.log(' Using SQLite database engine');
    return sequelize;
  }

  try {
    // Quick ping connection check to MySQL server (2000ms timeout)
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      connectTimeout: 2000
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    sequelize = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: false,
      timezone: '+08:00',
      pool: {
        max: 10,
        min: 0,
        acquire: 10000,
        idle: 5000
      }
    });

    await sequelize.authenticate();
    console.log(` MySQL database connected successfully [${dbName}]`);
    return sequelize;
  } catch (error) {
    console.warn(` MySQL connection not available (${error.message}).`);
    console.warn(' Falling back to embedded SQLite database engine (database/bank_sampah_palu.sqlite)...');
    
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../database/bank_sampah_palu.sqlite'),
      logging: false
    });

    await sequelize.authenticate();
    return sequelize;
  }
};

sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/bank_sampah_palu.sqlite'),
  logging: false
});

module.exports = {
  sequelize,
  initDatabase
};

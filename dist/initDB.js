"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
const db_1 = require("./db");
const createUsersTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      balance NUMERIC(10, 2) NOT NULL
    );
  `;
    try {
        await db_1.client.query(createTableQuery);
        console.log('Users table created or exists.');
    }
    catch (error) {
        console.error('Error creating users table:', error);
    }
};
const initDB = async () => {
    await createUsersTable();
};
exports.initDB = initDB;

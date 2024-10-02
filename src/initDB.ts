import {client} from "./db";

const createUsersTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      balance NUMERIC(10, 2) NOT NULL
    );
  `;
    try {
        await client.query(createTableQuery);
        console.log('Users table created or exists.');
    } catch (error) {
        console.error('Error creating users table:', error);
    }
};

export const initDB = async () => {
  await createUsersTable()
}
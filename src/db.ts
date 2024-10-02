require('dotenv').config()
import {Client} from 'pg';

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});

client.connect()
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error('Database connection error', err));

export { client };
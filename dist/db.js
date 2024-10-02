"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
require('dotenv').config();
const pg_1 = require("pg");
const client = new pg_1.Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});
exports.client = client;
client.connect()
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error('Database connection error', err));

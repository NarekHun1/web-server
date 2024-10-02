"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fastify_1 = __importDefault(require("fastify"));
const items_1 = require("./routes/items");
const users_1 = require("./routes/users");
const initDB_1 = require("./initDB");
const fastify = (0, fastify_1.default)({ logger: true });
fastify.register(items_1.itemRoutes);
fastify.register(users_1.userRoutes);
const start = async () => {
    try {
        await (0, initDB_1.initDB)();
        await fastify.listen({ port: 3000 });
        console.log('Server running on http://localhost:3000');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();

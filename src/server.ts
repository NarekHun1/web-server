import dotenv from 'dotenv';
dotenv.config()

import Fastify from 'fastify';
import { itemRoutes } from './routes/items';
import { userRoutes } from './routes/users';

import {initDB} from "./initDB";


const fastify = Fastify({ logger: true });

fastify.register(itemRoutes);
fastify.register(userRoutes);

const start = async () => {
    try {
        await initDB()
        await fastify.listen({ port: 3000 });
        console.log('Server running on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();

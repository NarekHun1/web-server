"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const db_1 = require("../db");
async function userRoutes(fastify) {
    fastify.post('/users/purchase', {
        schema: {
            body: {
                type: 'object',
                required: ['amount'],
                properties: {
                    amount: { type: 'number', minimum: 0.01 },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        newBalance: { type: 'number' },
                    },
                },
            },
        }
    }, async (request, reply) => {
        const userId = 1;
        const { amount } = request.body;
        try {
            const res = await db_1.client.query('SELECT balance FROM users WHERE id = $1', [userId]);
            const currentBalance = res.rows[0]?.balance;
            if (currentBalance === undefined) {
                return reply.status(404).send({ error: 'User not found' });
            }
            if (currentBalance < amount) {
                return reply.status(400).send({ error: 'Insufficient balance' });
            }
            const newBalance = currentBalance - amount;
            await db_1.client.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);
            return { success: true, newBalance };
        }
        catch (error) {
            return reply.status(500).send({ error: 'Error updating balance' });
        }
    });
    fastify.post('/users/init', async (_, reply) => {
        const userId = 1;
        const initialBalance = 100;
        try {
            const res = await db_1.client.query('SELECT id FROM users WHERE id = $1', [userId]);
            if (res.rows.length > 0) {
                await db_1.client.query('UPDATE users SET balance = $1 WHERE id = $2', [initialBalance, userId]);
                return reply.send({ message: 'User balance reset to 100', id: userId, balance: initialBalance });
            }
            else {
                await db_1.client.query('INSERT INTO users (id, balance) VALUES ($1, $2)', [userId, initialBalance]);
                return reply.send({ message: 'User created successfully', id: userId, balance: initialBalance });
            }
        }
        catch (error) {
            console.error('Error initializing user:', error);
            return reply.status(500).send({ error: 'Error initializing user' });
        }
    });
}

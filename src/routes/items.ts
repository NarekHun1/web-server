import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { cache } from '../cache';


const getSkinportAuthHeader = () => {
    const apiKey = process.env.SKINPORT_API_KEY || '';
    return `Basic ${Buffer.from(apiKey).toString('base64')}`;
};

const fetchItemsFromSkinport = async (tradable: boolean) => {
    const response = await axios.get('https://api.skinport.com/v1/items', {
        params: {
            tradable: tradable,
        },
        headers: {
            Authorization: getSkinportAuthHeader(),
        },
    });
    return response.data;
};

export async function itemRoutes(fastify: FastifyInstance) {
    fastify.get('/items', async (_, reply) => {
        const cacheKey = 'skinport_items';
        const cachedItems = cache.get(cacheKey);

        if (cachedItems) {
            return cachedItems;
        }

        try {
            // Fetch treatable and non-treatable items list
            const tradableItems = await fetchItemsFromSkinport(true);
            const nonTradableItems = await fetchItemsFromSkinport(false);

            // Combine both prices
            const combinedItems = nonTradableItems.map((nonTradableItem: any) => {
                const tradableItem = tradableItems.find(
                    (item: any) => item.market_hash_name === nonTradableItem.market_hash_name
                );

                return {
                    name: nonTradableItem.market_hash_name,
                    tradable_price: tradableItem?.min_price || null,
                    non_tradable_price: nonTradableItem.min_price || null,
                    currency: nonTradableItem.currency,
                    item_page: nonTradableItem.item_page,
                    market_page: nonTradableItem.market_page,
                    quantity: nonTradableItem.quantity,
                };
            });

            cache.set(cacheKey, combinedItems);
            return combinedItems;
        } catch (error) {
            console.error('Error fetching items from Skinport API:', error);
            return reply.status(500).send({ error: 'Error fetching items from Skinport API' });
        }
    });
}

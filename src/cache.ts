import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // Кэш на 10 минут

export { cache };
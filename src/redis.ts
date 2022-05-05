import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.on('connect', () => console.log('Redis Client Connect'));

export default redisClient;
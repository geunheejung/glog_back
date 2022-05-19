import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.on('connect', () => console.log('Redis Client Connect'));

redisClient.on('disconnect', () => console.log('Redis Client Disconnect'));

export const _redis = async (work: () => Promise<void>) => {
  try {
    await redisClient.connect();
    await work();
    await redisClient.disconnect();
  } catch (err) {
    throw '_redis Error';
  }
}

export default redisClient;
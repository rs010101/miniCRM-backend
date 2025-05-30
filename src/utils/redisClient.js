import { createClient } from 'redis';

// Create Redis client with reconnection strategy
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://default:vfdFRrPCVIZZy2gE27DCQKXmwZ3BFvh3@redis-19431.c8.us-east-1-3.ec2.redns.redis-cloud.com:19431',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('Redis connection retries exceeded');
                return new Error('Redis connection retries exceeded');
            }
            return Math.min(retries * 100, 3000);
        }
    }
});

// Event handlers
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('reconnecting', () => {
    console.log('Reconnecting to Redis...');
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Utility functions for caching
async function getCache(key) {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis Get Error:', error);
        return null;
    }
}

async function setCache(key, value, expireTime = 3600) {
    try {
        await redisClient.setEx(key, expireTime, JSON.stringify(value));
    } catch (error) {
        console.error('Redis Set Error:', error);
    }
}

async function deleteCache(key) {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Redis Delete Error:', error);
    }
}

async function clearCache() {
    try {
        await redisClient.flushAll();
    } catch (error) {
        console.error('Redis Clear Error:', error);
    }
}

async function deleteCachePattern(pattern) {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        return true;
    } catch (error) {
        console.error('Redis Delete Pattern Error:', error);
        return false;
    }
}

// Cache key prefixes
const CACHE_KEYS = {
    USER: 'user:',
    CUSTOMER: 'customer:',
    CAMPAIGN: 'campaign:',
    SEGMENT: 'segment:',
    ORDER: 'order:'
};

export {
    redisClient,
    getCache,
    setCache,
    deleteCache,
    clearCache,
    deleteCachePattern,
    CACHE_KEYS
};

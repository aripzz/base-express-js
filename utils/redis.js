// redisUtils.js
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();

// Promisify Redis commands
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
const expireAsync = promisify(client.expire).bind(client);

const expiredTime = process.env.EXPIRED_REDIS || 300; // Default expiration time in seconds

// Fungsi ini digunakan untuk menyimpan data dalam Redis dengan kunci (path) tertentu.
function setRedis(path, data, expire = 0) {
  return setAsync(path, JSON.stringify(data), "EX", expire || expiredTime);
}

// Fungsi ini digunakan untuk mengambil data dari Redis berdasarkan kunci (path).
async function getRedis(path) {
  const data = await getAsync(path);
  return JSON.parse(data);
}

// Fungsi ini digunakan untuk mengatur waktu kedaluwarsa (expire time) dari suatu kunci (path) di Redis.
function expireRedis(path, duration = 3) {
  return expireAsync(path, duration);
}

// how to use
// npm install redis

module.exports = {
  setRedis,
  getRedis,
  expireRedis,
};

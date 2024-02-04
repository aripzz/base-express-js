const md5 = require("md5");
const jwt = require("jsonwebtoken");
const aes256 = require("aes256");
const logger = require("./logger");
const redisUtils = require("./redis");

function getValue(str) {
  let sTr = str;
  if (typeof sTr === "undefined") {
    sTr = "";
  }
  if (!sTr) {
    return "";
  }
  if (sTr === null) {
    return "";
  }
  return sTr;
}

function getNullValue(str) {
  let sTr = str;
  if (typeof sTr === "undefined") {
    sTr = null;
  }
  if (!sTr) {
    return null;
  }
  if (sTr === null) {
    return null;
  }
  return sTr;
}

function parseFloatIND(str) {
  if (str === null) {
    return 0;
  }
  if (!str) {
    return 0;
  }
  if (str === "") {
    return 0;
  }
  str = str.toString();
  str = str.replace(/\./g, "");
  str = str.replace(",", ".");
  return parseFloat(str);
}

function normalisasiNoHP(nohp) {
  const nomerHP = nohp.replace(/([^0-9]+)/g, "");
  if (nomerHP.length < 7 || nomerHP.length > 14) {
    return "";
  }
  if (nomerHP.startsWith("0")) {
    return `62${nomerHP.substring(1)}`;
  }
  if (nomerHP.startsWith("62")) {
    return nomerHP;
  }
  if (nomerHP.startsWith("+62")) {
    return nomerHP.substring(1);
  }
  if (nohp.startsWith("8")) {
    return `62${nohp}`;
  }
  return "";
}

function midtransHP(nohp) {
  const nomerHP = nohp.replace(/([^0-9]+)/g, "");
  if (nomerHP.length < 7 || nomerHP.length > 14) {
    return "";
  }
  if (nomerHP.startsWith("0")) {
    return `+62${nomerHP.substring(1)}`;
  }
  if (nomerHP.startsWith("62")) {
    return `+${nomerHP}`;
  }
  if (nomerHP.startsWith("+62")) {
    return nomerHP;
  }
  if (nomerHP.startsWith("8")) {
    return `+62${nomerHP}`;
  }
  return "";
}

function gopayHP(nohp) {
  const nomerHP = nohp.replace(/([^0-9]+)/g, "");
  if (nomerHP.length < 7 || nomerHP.length > 14) {
    return "";
  }
  if (nomerHP.startsWith("0")) {
    return `+62${nomerHP.substring(1)}`;
  }
  if (nomerHP.startsWith("62")) {
    return `+${nomerHP}`;
  }
  if (nomerHP.startsWith("+62")) {
    return nomerHP;
  }
  if (nomerHP.startsWith("8")) {
    return `+62${nomerHP}`;
  }
  return "";
}

function denormalisasiNoHP(nohp) {
  if (typeof noHP === "undefined") {
    nohp = "";
  }
  if (nohp === null) {
    return "";
  }
  nohp = nohp.replace(/([^0-9]+)/g, "");
  if (nohp.length < 7 || nohp.length > 14) {
    return "";
  }
  if (nohp.startsWith("0")) {
    return nohp;
  }
  if (nohp.startsWith("62")) {
    return `0${nohp.substring(2)}`;
  }
  if (nohp.startsWith("+62")) {
    return `0${nohp.substring(3)}`;
  }
  if (nohp.startsWith("8")) {
    return `0${nohp}`;
  }
  return "";
}

function getIp(req) {
  let { ip } = req;
  try {
    ip = this.getValue(req.headers["x-client"]);
    if (ip === "") {
      ip = this.getValue(req.headers["x-forwarded-for"]);
    }
    if (ip === "") {
      ip = req.ip;
    }
  } catch (error) {
    logger.error(error);
  }
  return ip;
}

function dateInterval(date, seconds) {
  try {
    return new Date(date.getTime() + parseInt(seconds) * 1000);
  } catch (error) {
    return error;
  }
}

async function createActiveToken(data) {
  try {
    let expired = new Date();
    const expiry = parseInt(process.env.APILIFETIME);
    const dataKey = md5(`${data.phoneUser}-${data.activateMethod}`);
    expired = dateInterval(expired, expiry);
    data.expired = expired;

    await redisUtils.setRedis(
      process.env.prefix + process.env.userActivate + dataKey,
      data,
      expiry
    );

    return dataKey;
  } catch (error) {
    return false;
  }
}

async function expiredToken(token) {
  try {
    let tokenSaved = await redisUtils.getRedis(
      process.env.prefix + process.env.userActivate + token
    );

    if (tokenSaved != null && tokenSaved !== "") {
      tokenSaved.expired = new Date();

      redisUtils.setRedis(
        process.env.prefix + process.env.userActivate + token,
        tokenSaved,
        "EX",
        1
      );
      logger.info("Expired Token Activate");
    }
  } catch (error) {
    logger.error(error);
  }
}

function numberFormat(data) {
  const val = data.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
  return val;
}

async function getPinPartner(pin) {
  const decoded = await jwt.verify(
    pin,
    `~98900Viu4aitMatntuLLJ4ayaB1siill4H^%@*1`,
    {
      algorithm: "HS256",
    }
  );
  return decoded;
}

async function getPinUser(pin) {
  try {
    return aes256.decrypt(configs.get("secretKey"), pin);
  } catch (e) {
    logger.error(e);
    return undefined;
  }
}

module.exports = {
  getIp,
  denormalisasiNoHP,
  normalisasiNoHP,
  parseFloatIND,
  getValue,
  midtransHP,
  gopayHP,
  createActiveToken,
  expiredToken,
  numberFormat,
  dateInterval,
  getNullValue,
  getPinPartner,
  getPinUser,
};

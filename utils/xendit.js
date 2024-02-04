const superagent = require("superagent");
const logger = require("./logger");
const generalResp = require("../constant/httpResp");
const helper = require("./helper");
const config = require("../configs/config");

function parseResponse(response, isCharge = "", mid) {
  const result = {
    rc: generalResp.HTTP_GENERALERROR,
    rd: "General Error",
    data: {},
    mid,
  };
  logger.http(response.text);
  if (response.status === 202 || response.status === 200) {
    try {
      const ver = JSON.parse(response.text);
      result.rc = generalResp.HTTP_OK;
      result.rd = ver.status ? ver.status : "OK";
      if (isCharge === 1) {
        result.data = {
          order_id: helper.getValue(ver.reference_id),
          transaction_id: helper.getValue(ver.id),
          transaction_status: helper.getValue(ver.status),
          transaction_time: helper.getValue(ver.created),
          merchant_id: helper.getValue(ver.merchant_id),
          gross_amount: helper.getValue(ver.charge_amount),
          fraud_status: helper.getValue(ver.void_status),
          actions: helper.getValue(ver.actions),
        };
      } else {
        result.data = ver;
      }
    } catch (e) {
      logger.error(e);
      logger.error(response);
    }
  } else if (response.status === 403) {
    try {
      const ver = JSON.parse(response.text);
      result.rc = generalResp.HTTP_BADREQUEST;
      result.rd = ver.message;
    } catch (e) {
      logger.error(e);
      logger.error(response);
    }
  } else {
    logger.error(response);
    result.rc = generalResp.HTTP_GENERALERROR;
    result.rd = `Tidak dapat terhubung ke penyedia layanan #${response.status}`;

    logger.error(result);
  }

  return result;
}

async function doCharge(data, mid) {
  const apiUrl = `${config.get("xendit:url")}/ewallets/charges`;
  logger.http(data);
  const response = await new Promise((resolve) => {
    return superagent
      .post(apiUrl)
      .auth(`${config.get("xendit:client_key")}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(data)
      .end((err, res) => {
        if (!err) {
          resolve(res);
        } else {
          resolve(err);
          logger.error(err);
        }
      });
  });

  return parseResponse(response, 1, mid);
}

async function doPostTrx(path, payload, mid) {
  const apiUrl = `${config.get("xendit:url")}/${path}`;

  logger.http(payload);
  const response = await new Promise((resolve) => {
    return superagent
      .post(apiUrl)
      .auth(`${config.get("xendit:client_key")}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(payload)
      .end((err, res) => {
        if (!err) {
          resolve(res);
        } else {
          resolve(err);
          logger.error(err);
        }
      });
  });

  return parseResponse(response, "", mid);
}

async function doGetTrx(path, mid) {
  const apiUrl = `${config.get("xendit:url")}/${path}`;

  logger.http(apiUrl);
  const response = await new Promise((resolve) => {
    return superagent
      .get(apiUrl)
      .auth(`${config.get("xendit:client_key")}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .end((err, res) => {
        if (!err) {
          resolve(res);
        } else {
          resolve(err);
          logger.error(err);
        }
      });
  });

  return parseResponse(response, "", mid);
}
module.exports = {
  doCharge,
  doPostTrx,
  doGetTrx,
};

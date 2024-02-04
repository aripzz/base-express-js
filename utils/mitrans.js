const superagent = require("superagent");
const logger = require("./logger");
const generalResp = require("../constant/httpResp");
const helper = require("./helper");

function parseResponse(response, isCharge = "", mid) {
  const result = {
    rc: generalResp.HTTP_GENERALERROR,
    rd: "General Error",
    data: {},
    mid,
  };

  logger.http(response.text);

  if (response.status === 200) {
    try {
      const responseBody = JSON.parse(response.text);
      logger.http(responseBody);

      if (generalResp.MIDTRANS_HTTP_OK.includes(responseBody.status_code)) {
        result.rc = generalResp.HTTP_OK;
        result.rd = responseBody.status_message || "OK";

        if (isCharge === 1) {
          result.data = {
            order_id: helper.getValue(responseBody.order_id),
            transaction_id: helper.getValue(responseBody.transaction_id),
            transaction_status: helper.getValue(
              responseBody.transaction_status
            ),
            transaction_time: helper.getValue(responseBody.transaction_time),
            merchant_id: helper.getValue(responseBody.merchant_id),
            gross_amount: helper.getValue(responseBody.gross_amount),
            fraud_status: helper.getValue(responseBody.fraud_status),
            actions: responseBody.actions,
          };
        } else {
          result.data = responseBody;
        }
      } else if (generalResp.MIDTRANS_HTTP_DENY === responseBody.status_code) {
        logger.error(responseBody);
        result.rc = responseBody.status_code;
        result.rd = responseBody.status_message;
      } else if (
        generalResp.MIDTRANS_BADREQUEST.includes(responseBody.status_code)
      ) {
        result.rc = responseBody.status_code;
        result.rd = responseBody.status_message;
        logger.error(responseBody);
      }
    } catch (error) {
      logger.error(error);
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

async function makeRequest(method, path, payload, mid) {
  const apiUrl = `${process.env.MIDTRANS_URL}/${path}`;
  logger.http(`${method} ${apiUrl}`);

  const response = await new Promise((resolve) => {
    const request = superagent[method.toLowerCase()](apiUrl)
      .auth(`${process.env.MIDTRANS_SERVER_KEY}`)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    if (payload) {
      request.send(payload);
    }

    request.end((err, res) => {
      if (!err) {
        resolve(res);
      } else {
        resolve(err);
        logger.error(err);
      }
    });
  });

  logger.http(response);
  return parseResponse(response, "", mid);
}

async function doCharge(data, mid) {
  return makeRequest("POST", "charge", data, mid);
}

async function doPostTrx(path, payload, mid) {
  return makeRequest("POST", path, payload, mid);
}

async function doGetTrx(path, mid) {
  return makeRequest("GET", path, null, mid);
}

module.exports = {
  doCharge,
  doPostTrx,
  doGetTrx,
};

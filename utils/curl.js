const { spawn } = require("child_process");

function makeCurlRequest(url, method = "GET", data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const curl = spawn("curl", buildCurlCommand(url, method, data, headers));

    let responseData = "";

    curl.stdout.on("data", (data) => {
      responseData += data.toString();
    });

    curl.stderr.on("data", (data) => {
      console.error(`cURL error: ${data}`);
      reject(new Error("cURL request failed"));
    });

    curl.on("close", (code) => {
      if (code === 0) {
        resolve(responseData);
      } else {
        reject(new Error(`cURL process exited with code ${code}`));
      }
    });
  });
}

function buildCurlCommand(url, method, data, headers) {
  let curlCommand = [url, "-X", method];

  // Add headers
  Object.keys(headers).forEach((header) => {
    curlCommand.push("-H", `${header}:${headers[header]}`);
  });

  // Add data for POST requests
  if (data && method === "POST") {
    curlCommand.push("--data", data);
  }

  return curlCommand;
}

// Example POST request
//  const postData = JSON.stringify({ title: 'foo', body: 'bar', userId: 1 });
//  const postHeaders = { 'Content-Type': 'application/json' };
//  const postResponse = await curlUtils.makeRequest('https://jsonplaceholder.typicode.com/posts', 'POST', postData, postHeaders);
//  console.log('POST Response:', postResponse);

// Example GET request
//  const getResponse = await curlUtils.makeRequest('https://jsonplaceholder.typicode.com/posts/1');
//  console.log('GET Response:', getResponse);

module.exports = {
  makeCurlRequest,
};

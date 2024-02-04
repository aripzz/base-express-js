const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Use body-parser middleware to parse JSON in request bodies
app.use(bodyParser.json());

// Import your product router
const productRouter = require("./router/product");
const protectRouter = require("./router/protect");

// Use the product router for routes starting with /api
app.use("/api", productRouter);
app.use("/api", protectRouter);

// Set up server to listen on a port (e.g., 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

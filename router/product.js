const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSummaryProduct,
  getBestSellers,
  getWorstSellers,
} = require("../repository/product");

router.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/products", async (req, res) => {
  const { name, price, stok, deskripsi } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name cannot be null." });
  }

  // Validate that the 'price' field
  if (typeof price !== "string") {
    return res.status(400).json({ error: "price should be a string." });
  }

  // Validate that the 'stok' field
  if (typeof stok !== "number") {
    return res.status(400).json({ error: "stok should be a number." });
  }

  // Validate that the 'stok' field
  if (stok < 1) {
    return res.status(400).json({ error: "stok minimum 1." });
  }

  try {
    const newItem = await createProduct(name, price, stok, deskripsi);

    res.status(201).json({ message: "Created Success" });
  } catch (error) {
    // Handle other errors (e.g., database errors) by sending a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const item = await getProductById(id);

    if (!item) {
      // If item is not found, send a 404 Not Found response
      return res.status(404).json({ error: "Product not found" });
    }

    // If item is found, send the item in the response
    res.json(item);
  } catch (error) {
    // Handle other errors (e.g., database errors) by sending a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/summaryProducts", async (req, res) => {
  let { search } = req.query; // Use req.query to get query parameters
  if (!search) {
    search = "";
  }
  const item = await getSummaryProduct(search);
  res.json(item);
});

router.put("/products/:id", async (req, res) => {
  const id = req.params.id;

  const { name, price, stok, deskripsi } = req.body;
  // Validate that the 'name' field is not null or empty
  if (!name) {
    return res.status(400).json({ error: "Name cannot be null." });
  }
  // Validate that the 'price' field
  if (typeof price !== "string") {
    return res.status(400).json({ error: "price should be a string." });
  }

  // Validate that the 'stok' field
  if (typeof stok !== "number") {
    return res.status(400).json({ error: "stok should be a number." });
  }

  // Validate that the 'stok' field
  if (stok < 1) {
    return res.status(400).json({ error: "stok minimum 1." });
  }
  try {
    const updatedItem = await updateProduct(id, name, price, stok, deskripsi);
    res.status(200).json({ message: "Updated Success" });
  } catch (error) {
    // Handle other errors (e.g., database errors) by sending a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  await deleteProduct(id);
  res.json({ message: "Deleted Success" });
});

router.get("/best-sellers", async (req, res) => {
  try {
    const bestSellers = await getBestSellers();
    res.json(bestSellers);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/worst-sellers", async (req, res) => {
  try {
    const worstSellers = await getWorstSellers();
    res.json(worstSellers);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

const db = require("../utils/db");

function getAllProducts() {
  return db.any("SELECT * FROM product");
}

function getProductById(id) {
  return db.one("SELECT * FROM product WHERE id = $1", id);
}

function createProduct(name, price, stok, deskripsi) {
  return db.one(
    "INSERT INTO product(name, price, stok, deskripsi) VALUES($1, $2, $3, $4) RETURNING *",
    [name, price, stok, deskripsi]
  );
}

function updateProduct(id, name, price, stok, deskripsi) {
  return db.one(
    "UPDATE product SET name=$1, price=$2, stok=$3, deskripsi=$4 WHERE id=$5 RETURNING *",
    [name, price, stok, deskripsi, id]
  );
}

function deleteProduct(id) {
  return db.none("DELETE FROM product WHERE id = $1", id);
}

function getSummaryProduct(search) {
  return db.one(
    "SELECT count(*) as jumlah FROM product WHERE name ILIKE $1",
    [`${search}%`] // Assuming you want to match names starting with the provided search term
  );
}

// Fetch best-selling products
function getBestSellers() {
  return db.any(`
      SELECT 
        products.id,
        products.name,
        SUM(transaction_details.quantity) AS total_sold
      FROM 
        products
      JOIN 
        transaction_details ON products.id = transaction_details.product_id
      GROUP BY 
        products.id, products.name
      ORDER BY 
        total_sold DESC
      LIMIT 10
    `);
}

// Fetch worst-selling products
function getWorstSellers() {
  return db.any(`
      SELECT 
        products.id,
        products.name,
        COALESCE(SUM(transaction_details.quantity), 0) AS total_sold
      FROM 
        products
      LEFT JOIN 
        transaction_details ON products.id = transaction_details.product_id
      GROUP BY 
        products.id, products.name
      ORDER BY 
        total_sold ASC
      LIMIT 10
    `);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSummaryProduct,
  getBestSellers,
  getWorstSellers,
};

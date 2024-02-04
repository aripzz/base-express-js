const db = require("../utils/db");

db.none(
  `
  CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    stok integer NOT NULL
  )
`
)
  .then(() => {
    console.log("Table successfully created");
  })
  .catch((error) => {
    console.error("Failed to create table", error);
  });

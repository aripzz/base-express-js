-- pre
DROP USER IF EXISTS azlogistikusr;
CREATE USER azlogistikusr WITH PASSWORD 'z1ogistikpass';
ALTER USER azlogistikusr WITH SUPERUSER;
DROP DATABASE IF EXISTS gudang;
CREATE DATABASE gudang;
ALTER DATABASE gudang OWNER TO azlogistikusr;

USE gudang;

-- Tabel transaksi
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL
);

-- Tabel transaksi detail
CREATE TABLE transaction_details (
  id SERIAL PRIMARY KEY,
  transaction_id INT,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);
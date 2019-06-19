

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
item_id INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(255),
department_name VARCHAR(255),
price DECIMAL(6,2),
stock_quantity INTEGER,
PRIMARY KEY (item_id),
UNIQUE (product_name)
);

SELECT * FROM products;


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

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('milk-bone', 'dog treats', '8.24', '25'); 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('pup-peroni', 'dog treats', '5.49', '12'); 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('beggin strips', 'dog treats', '14.83', '32'); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('pedigree', 'dog food', '18.10', '50'); 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('iams', 'dog food', '31.94', '43'); 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('blue buffalo', 'dog food', '48.74', '32'); 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('beneful', 'dog food', '13.59', '48'); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('plush monkey', 'dog squeaky toys', '12.88', '50'); 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('screamin chicken', 'dog squeaky toys', '12.80', '43'); 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('3 pack standing stick latex animals', 'dog squeaky toys', '48.74', '32'); 

SELECT * FROM products;
## REPO Name: bamazon
### Bamazon - Amazon-like store front. It uses MySQL, inquirer, and console.table NPM packages.

### OVERVIEW and OPERATION

**bamazonCustomer.js** takes orders and depletes stock. There is error handling for invalid product IDs and insufficient quantity while ordering. 
**bamazonManager.js** monitors current stock, monitors low inventory, allows managers to add to inventory, and allows managers to add new products. There is error handling for invalid product IDs and duplicate product names (when adding new products). There are five options for the Manager program. 
They are:
* View Products for Sale 
* View Low Inventory - any product with quantity less than 5.
* Add to Inventory - requests product id and quantity
* Add New Product - requests product name, department, price, and quantity
* Exit


### Technology
The technology/interesting features for this project includes the following:
* node.js 
* inquirer - NPM package to allow cli input
* MySQL - Both the primary key (item_id) and the product_name are unique in the database. The file bamazon.sql has the script to create the database, the table, and populate it.
* console.table - NPM package to print display output in a table format. The table handling is handled in a external file (utilsTable.js).
* dotenv - allows hiding of the MySQL password

 
Find a recording of bamazon running at [ScreenRecodingHW12.mov](ScreenRecordingHW12.mov)
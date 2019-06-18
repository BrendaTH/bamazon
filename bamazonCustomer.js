require("dotenv").config();

var mysql    = require("mysql");
var inquirer = require('inquirer');
const cTable = require('console.table');
var keys    = require('./keys');
var utils   = require("./utilsTable.js");


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: keys.mysqlpw.pw,
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProductTable();
});

//******************************* */
// Display the Product Table
//******************************* */
function displayProductTable() {
    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var productTableArr = utils.displayProductTable(res);
    RequestIdAndQuantity(productTableArr);
    });
}
//******************************* */
// Request Product ID and Quanity to Buy From User
//******************************* */
function RequestIdAndQuantity(productTableArray) {
    var maxItems = productTableArray.length;
    var questions = [
        {
            type: 'input',
            name: 'product_id',
            message: 'Please enter the product id for the item to purchase.',
            validate: function(id) {
                if (isNaN(id) || id <= 0) {
                return 'Must be a number and greater than 0. Please try again';
                }
        
                return true;
            }
        },
        {
            type: 'input',
            name: 'unit_count',
            message: 'Please enter the quantity you would like to buy.',
            validate: function(count) {
                if (isNaN(count) || count <= 0 ) {
                    return 'Must be a number and greater than zero. Please try again';
                }
            
                return true;
            }
        }
    ];
    inquirer.prompt(questions).then(answers => {
        validateOrder(answers);
    });
}
//******************************* */
// Validate the User's Order 
// ie do we have enough stock to fulfill the order
//******************************* */
function validateOrder(answers) {
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { item_id: answers.product_id }, function(err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log("Invalid product ID. Exiting program");
            connection.end();
            return;
        }
        var orderItem = utils.displayItemAvailabilityTable(res, answers);

        if (orderItem.totalAvailable < answers.unit_count) {
            connection.end();
        } else {
            placeOrder(answers, orderItem); 
        }
    });
}
//******************************* */
// Finalize the User's Order 
// ie adjust the inventory and display the user's cost
// then end the connection
//******************************* */
function placeOrder(answers, orderItem) {
    var newTotalAvailable = orderItem.totalAvailable - answers.unit_count;
    var query = "UPDATE  products SET ? WHERE ?";

    connection.query(query, [{ stock_quantity: newTotalAvailable}, {item_id: answers.product_id }], function(err) {
        if (err) throw err;
        utils.displayOrderStatusTable(answers, orderItem);
        connection.end();
    });
}
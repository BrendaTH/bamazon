require("dotenv").config();

var mysql    = require("mysql");
var inquirer = require('inquirer');
const cTable = require('console.table');
var keys    = require('./keys');
var utils   = require("./utilsTable.js");

//******************************************** */
// sql connection config
//******************************************** */
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
//******************************************** */
// make the sql connection
//******************************************** */
connection.connect(function(err) {
if (err) throw err;
console.log("connected as id " + connection.threadId + "\n");
listMenuOptions();
});
//******************************************** */
// show the menu
//******************************************** */
function listMenuOptions() {
    inquirer
    .prompt({
        name: "menuChoice",
        type: "list",
        message: "Please choose a menu option.",
        choices: [
        "View Products for Sale", 
        "View Low Inventory", 
        "Add to Inventory",
        "Add New Product",
        "Exit"]
    })
    .then(function(answer) {
      // based on their answer, either execute the right function
      switch (answer.menuChoice) {
        case "View Products for Sale":
            displayProductTable();
            break;
        case "View Low Inventory":
            viewLowInventory();
            break;
        case "Add to Inventory":
            addToInventory();
            break;
        case "Add New Product":
            addNewProduct();
            break;
        case "Exit":
            exitManagerView();
            break;
      }

    });
}
//******************************************** */
// display product table
//******************************************** */
function displayProductTable() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        utils.displayProductTable(res);
        listMenuOptions();
        });
}
//******************************************** */
// view low inventory
//******************************************** */
function viewLowInventory() {
    const lowQuantity = 5;
    var query = "SELECT * FROM products WHERE stock_quantity < ?";
    connection.query(query, lowQuantity, function(err, res) {
        if (err) throw err;
        utils.displayProductLowInventory(res);
        listMenuOptions();
    });
}
//************************************************** */
// add to inventory
//************************************************** */
function addToInventory() {
    // display the product table first
    // bjt bjt delete this showing of table
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // display the product table
        var maxItems = utils.displayProductTable(res).length;
        // ask inventory questions
        askInventoryQuestions(maxItems)

    });
}

function askInventoryQuestions(maxItems) {
    var questions = [
        {
            type: 'input',
            name: 'product_id',
            message: 'Please enter the product id for the item to add to inventory.',
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
            message: 'Please enter the quantity you would like to add to inventory.',
            validate: function(count) {
                if (isNaN(count) || count <= 0 ) {
                    return 'Must be a number and greater than zero. Please try again';
                }
                return true;
            }
        }
    ];
    inquirer.prompt(questions).then(answers => {
        findCurrentInventory(answers);
    });
}

function findCurrentInventory(answers) {
    var query = "SELECT stock_quantity FROM products WHERE ?";
    connection.query(query, {item_id: answers.product_id}, function(err, res) {
        if (err) throw err;

        if (res.length === 0) {
            console.log("Invalid product ID. Please choose again");
            listMenuOptions();
            return;
        } else {

            var currentQuantity;
            var newQuantity = 0;
            for (var i = 0; i < res.length; i++) {
                currentQuantity = res[i].stock_quantity;
                newQuantity = parseInt(currentQuantity) ? parseInt(currentQuantity) + parseInt(answers.unit_count) : 0
            }
            updateInventory(newQuantity, answers.product_id);
        }
    });
}
function updateInventory(newQuantity, id) {
    var query = "UPDATE  products SET ? WHERE ?";
    var response = connection.query(query, [{ stock_quantity: newQuantity}, {item_id: id}], function(err) {
        if (err) throw err;
        console.log(response.sql);
        console.log("new quantity for id: " + id + " is: " + newQuantity);
        listMenuOptions();
    });

}
//******************************************** */
// add new product
//******************************************** */
function addNewProduct() {
        var questions = [
            {
                type: 'input',
                name: 'product_name',
                message: 'Please enter the product name.',
            },
            {
                type: 'input',
                name: 'department_name',
                message: 'Please enter the department name for the new product.',
            },
            {
                type: 'input',
                name: 'price',
                message: 'Please enter the price per unit for the new product.',
                validate: function(count) {
                    if (isNaN(count) || count <= 0 ) {
                        return 'Must be a number and greater than zero. Please try again';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'stock_quantity',
                message: 'Please enter the quantity you would like to add to inventory.',
                validate: function(count) {
                    if (isNaN(count) || count <= 0 ) {
                        return 'Must be a number and greater than zero. Please try again';
                    }
                    return true;
                }
            }
        ];
        inquirer.prompt(questions).then(answers => {
            insertProductIntoTable(answers);
        });
}
function insertProductIntoTable(a) {
    var query = "INSERT INTO products SET ?";
    connection.query(query, 
            {product_name:a.product_name, 
            department_name: a.department_name, 
            price: a.price, 
            stock_quantity: a.stock_quantity},
            function(err) {
                if (err) {
                    console.log(`
                    ${err.code}: ${err.sqlMessage}
                    failed to add new product
                    `);
                } else {
                    console.log("adding new inventory is a success");
                }
                listMenuOptions();
            });
}
//******************************************** */
// exit 
//******************************************** */
function exitManagerView() {
    connection.end();
}

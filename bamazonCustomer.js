require("dotenv").config();

var mysql    = require("mysql");
var inquirer = require('inquirer');
const cTable = require('console.table');
var keys    = require('./keys');



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
    // build all products into an array
    var productTableArr = [];
    for (var i = 0; i < res.length; i++) {
        productTableArr.push({
            ID: res[i].item_id,
            product: res[i].product_name,
            department: res[i].department_name,
            price : '$' + res[i].price,
            quantity: res[i].stock_quantity,
        });
    }
    // log the products in a table format to the screen
    console.table('          I T E M S   A V A I L A B L E   F O R   S A L E', productTableArr);
    AcceptIdAndQuantity(productTableArr);
    });
}
//******************************* */
// Accept Product ID and Quanity to Buy From User
//******************************* */
function AcceptIdAndQuantity(productTableArray) {
    var maxItems = productTableArray.length;
    var questions = [
        {
            type: 'input',
            name: 'product_id',
            message: 'Please enter the product id for the item to purchase.',
            validate: function(id) {
                if (isNaN(id) || id <= 0 || id > maxItems) {
                return 'Must be a number, greater than 0, and less than or equal to ' + maxItems + '. Please try again';
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

function validateOrder(answers) {
    var query = "SELECT product_name, stock_quantity, price FROM products WHERE ?";
    connection.query(query, { item_id: answers.product_id }, function(err, res) {
        if (err) throw err;
        var totalAvailable;
        var productName;
        var pricePerUnit;
        for (var i = 0; i < res.length; i++) {
            totalAvailable = res[i].stock_quantity;
            productName = res[i].product_name;
            pricePerUnit = res[i].price;

        }
        var productAvailabilityArr = [];
        productAvailabilityArr.push({
            ID: answers.product_id,
            product: productName,
            price: '$' + pricePerUnit,
            'Quantity In Stock': totalAvailable,
            'Total Ordered': answers.unit_count,
            'Order Status': `${totalAvailable < answers.unit_count ? 'Failed: Insufficient Quantity!' : 'Processing - In Stock'}`,
        });
        // log the item availability in table format to the screen
        console.log(`
        
        `);
        console.table('          I T E M   A V A I L A B L I T Y', productAvailabilityArr);
        if (totalAvailable < answers.unit_count) {
            connection.end();
        } else {
            var orderItem = {
                totalAvailable: totalAvailable,
                productName: productName,
                pricePerUnit: pricePerUnit,
            }
            placeOrder(answers, orderItem); 

        }
    });
}

function placeOrder(answers, orderItem) {
    var newTotalAvailable = orderItem.totalAvailable - answers.unit_count;
    var query = "UPDATE  products SET ? WHERE ?";

    connection.query(query, [{ stock_quantity: newTotalAvailable}, {item_id: answers.product_id }], function(err) {
        if (err) throw err;
        var orderStatusArr = [];
        orderStatusArr.push({
            ID: answers.product_id,
            product: orderItem.productName,
            price: '$' + orderItem.pricePerUnit,
            'Total Ordered': answers.unit_count,
            'Customer Cost': `${answers.unit_count * orderItem.pricePerUnit}`,
            'Order Status': 'Complete',
        });
        // log the order status in table format to the screen
        console.log(`
        
        `);
        console.table('              O R D E R   S T A T U S ', orderStatusArr);
        connection.end();
    });
}

/*


        var totalAvailable = 0;
        var productName = '';
        for (var i = 0; i < res.length; i++) {
            totalAvailable = res[i].stock_quantity;
            productName = res[i].product_name;
            console.log("quantity: " + total);

        }
        if (total < answers.unit_count) {
            console.log("Insufficient quantity of " + productName);
            connection.end();
        } else {
            console.log(" There are " + totalAvailable + " of the " + productName + " available");
            placeOrder(answers, totalAvailable, productName); 

        }
    });
}



    
        if (err) throw err;
        // build all products into an array
        var productTableArr = [];
        for (var i = 0; i < res.length; i++) {
            productTableArr.push({
                ID: res[i].item_id,
                product: res[i].product_name,
                department: res[i].department_name,
                price : '$' + res[i].price,
                quantity: res[i].stock_quantity,
            });
        }
        // log the products in a table format to the screen
        console.table('          I T E M S   A V A I L A B L E   F O R   S A L E', productTableArr);
        AcceptIdAndQuantity(productTableArr);
        });

}







    inquirer
    .prompt({
      name: "postOrBid",
      type: "list",
      message: "Would you like to [POST] an auction or [BID] on an auction?",
      choices: ["POST", "BID", "EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.postOrBid === "POST") {
        postAuction();
      }
      else if(answer.postOrBid === "BID") {
        bidAuction();
      } else{
        connection.end();
      }
    });

   }
*/
  
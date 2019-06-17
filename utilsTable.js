module.exports = {
    buildArr: function(res) {
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
        return productTableArr;
    },
    displayProductTable: function(res) {
        var productTableArr = this.buildArr(res);
        // log the products in a table format to the screen
        console.table('          I T E M S   A V A I L A B L E   F O R   S A L E', productTableArr);
        return (productTableArr);
    },
    displayProductLowInventory: function(res) {
        var productTableArr = this.buildArr(res);
        // log the products in a table format to the screen
        console.table('          I T E M S   W I T H    L O W   I N V E N T O R Y ', productTableArr);
        return (productTableArr);
    },

    displayItemAvailabilityTable: function(res, answers) {
        var totalAvailable, productName, pricePerUnit;
        var productAvailabilityArr = [];

        
        for (var i = 0; i < res.length; i++) {
            totalAvailable = res[i].stock_quantity;
            productName = res[i].product_name;
            pricePerUnit = res[i].price;

        }
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
        return {
            totalAvailable: totalAvailable,
            productName: productName,
            pricePerUnit: pricePerUnit,
            };

    },
    displayOrderStatusTable: function(answers, orderItem){
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
    },



}

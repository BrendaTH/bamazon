module.exports = {

    displayProductTable: function(res) {
        console.table('          I T E M S   A V A I L A B L E   F O R   S A L E', res);
        return (res);
    },
    displayProductLowInventory: function(res) {
        // log the products in a table format to the screen
        console.table('          I T E M S   W I T H    L O W   I N V E N T O R Y ', res);
        return (res);
    },

    displayItemAvailabilityTable: function(res, answers) {
        var totalAvailable, productName, pricePerUnit;
        
        for (var i = 0; i < res.length; i++) {
            totalAvailable = res[i].stock_quantity;
            productName = res[i].product_name;
            pricePerUnit = res[i].price;
            res[i]['Total Ordered'] = answers.unit_count;
            res[i]['Order Status'] = `${totalAvailable < answers.unit_count ? 'Failed: Insufficient Quantity!' : 'Processing - In Stock'}`;

        }
        console.table('                          I T E M   A V A I L A B L I T Y', res);

        return {
            totalAvailable: totalAvailable, 
            productName: productName, 
            pricePerUnit: pricePerUnit
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

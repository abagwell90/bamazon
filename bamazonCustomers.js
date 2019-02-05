
var inquirer = require('inquirer');
var mysql = require('promise-mysql');
var connection;
var answers;
var questions = [{
    message: "What fruit or vegetable do you want to order?",
    type: "input",
    name: "itemId"
},
{
    message: "How many do you want to buy?",
    type: "input",
    name: "quantity"
}];

mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '*********',//deleted my password for github
    database: 'bamazon'
}).then(function (conn) {
    connection = conn
    return inquirer.prompt(questions)
}).then(function (ans) {
    answers = ans
    // console.log('answers:', answers) 
    return connection.query('select stock_quantity, price from products WHERE item_id = ' + answers.itemId);
}).then(function (rows) {
    // console.log('rows:', rows);
    // console.log('quantity', answers.quantity);
    // console.log('stock_quantity', rows[0].stock_quantity);
    var itemsLeft = rows[0].stock_quantity - answers.quantity;
    if (itemsLeft < 0) {
        console.log("Insufficient quantity!");
    } else {
        console.log('Items left', itemsLeft);
        var totalCost = answers.quantity * rows[0].price;
        console.log('Total cost:', totalCost);
        return connection.query(`UPDATE products SET stock_quantity  = ${itemsLeft} WHERE item_id = ${answers.itemId}`);
    }
}).then(function (){
    connection.end();
});

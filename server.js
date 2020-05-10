const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    //adding this so I don't have to show my password in my code
    password: process.env.PASSWORD,
    database: "trackingDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    //run the start function after the connection is made to prompt the user
    start();
});

// prompt user if they want to add a manager or department
function start() {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
            ]
        })
        .then(function (answer) {
            switch (answer.menu) {
                case "Add Department":
                    addDepartment()
                    break;
            }
        });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the Department name?",
            },
        ])
        .then(function (answer) {
            console.log(answer.name)
            var query = connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.name
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows)
                }
            )
        })
}

// function to handle posting new items up for auction
function addManager() {

    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the item you would like to submit?"
            },
            {
                name: "category",
                type: "input",
                message: "What category would you like to place your auction in?"
            },
            {
                name: "startingBid",
                type: "input",
                message: "What would you like your starting bid to be?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO auctions SET ?",
                {
                    item_name: answer.item,
                    category: answer.category,
                    starting_bid: answer.startingBid || 0,
                    highest_bid: answer.startingBid || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your auction was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });
}



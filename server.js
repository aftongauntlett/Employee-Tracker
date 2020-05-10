const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "tracker_DB"
});

//
connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name:
            type:
            message:
            choices: []
        })





    connection.connect(function(err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        createEmployee();
    });

    function createEmployee() {
        console.log("Employee Name...\n");
        var query = connection.query(
            "INSERT INTO employee SET ?",
            {
                firstname:
                lastname:
                roleid:
                managerid:
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                updateProduct();
            }
        );

        // logs the actual query being run
        console.log(query.sql);
    }

    function updateProduct() {
        console.log("Updating all Rocky Road quantities...\n");
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    quantity: 100
                },
                {
                    flavor: "Rocky Road"
                }
            ],
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " products updated!\n");
                // Call deleteProduct AFTER the UPDATE completes
                deleteProduct();
            }
        );

        // logs the actual query being run
        console.log(query.sql);
    }

    function deleteProduct() {
        console.log("Deleting all strawberry icecream...\n");
        connection.query(
            "DELETE FROM products WHERE ?",
            {
                flavor: "strawberry"
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " products deleted!\n");
                // Call readProducts AFTER the DELETE completes
                readProducts();
            }
        );
    }

    function readProducts() {
        console.log("Selecting all products...\n");
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log(res);
            connection.end();
        });
    }

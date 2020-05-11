const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const figlet = require('figlet');



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
    figlet('Employee Tracker', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        start();
    });
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
                "Add Manager",
                "Remove Employee",
            ]
        })
        .then(function (answer) {
            switch (answer.menu) {
                case "Add Department":
                    addDepartment()
                    break;
                case "Add Role":
                    addRole()
                    break;
                case "Add Employee":
                    addEmployee()
                    break;
                case "View all Employees":
                    viewEmployees()
                    break;
                case "Remove Employee":
                    removeEmployee()
                    break;
                case "Add Manager":
                    addManagers()
                    break;

            }
        });
}
// create a function to add the department
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
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.name
                },
                function (err, res) {
                    if (err) throw err;
                    // let the user know what department they have added, then send them back to the main menu
                    console.log(`You have added ${answer.name}`)
                    start()
                }
            )
        })
}

function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        const choices = res.map(result => {
            // make choices an array that renames ID to value
            return {
                name: result.name, value: result.id
            }
        })
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the role title?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary for this role?",
                },
                {
                    name: "department",
                    type: "list",
                    message: "Please choose a department.",
                    choices
                }
            ])
            // create variable called answers
            .then(function (answers) {
                connection.query(
                    // sending user input to database
                    "INSERT INTO role SET ?",
                    {
                        department_id: answers.department,
                        title: answers.title,
                        salary: answers.salary,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`You have added the role ${answers.title}`)
                        start()
                    }
                )
            })
    })

}

function addEmployee() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        const choices = res.map(result => {
            return {
                name: result.title, value: result.id
            }
        })
        console.log(res)
        inquirer
            .prompt([{
                name: "first_name",
                type: "input",
                message: "Please enter first name.",
            },
            {
                name: "last_name",
                type: "input",
                message: "Please enter last name.",
            },
            {
                name: "role",
                type: "list",
                message: "Please choose a role.",
                choices
            },
                // {
                //     name: "manager",
                //     type: "list",
                //     message: "Is this employee a manager?",
                //     choices: [
                //         "Yes",
                //         "No",
                //     ]
                // }
            ])

            // create variable called answers
            .then(function (answers) {
                connection.query(
                    // sending user input to database
                    "INSERT INTO employee SET ?",
                    {
                        // employee_id: answers.employee,
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id: answers.role,
                        // manager: answers.manager
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`You have added the employee ${answers.first_name} ${answers.last_name}`)
                        start()
                    }
                )
            })
    })

}

// view employee
function viewEmployees() {
    connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        // connection.end();
        start();
    });
}

// remove employee
function removeEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {

    })
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Which employee would you like to remove?"
        }

    ]).then(response => {
        connection.query(
            "DELETE FROM employee WHERE ?",
            {
                id: response.id
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employee removed.\n");
                // viewEmployee();
                start();
            }
        )
    });
}

// function complete() {
//     console.log("Thanks for using Employee Tracker");
//     connection.end();
// }


// use console.table

// command line should allow:
// add and view employee
// add and view role
// add and view department
// update employee roles

// bonus
// update employee managers
// view employees by manager
// delete departments, roles and employees
// view the total utilized budget of a department (combined salaries of all employees in dept)
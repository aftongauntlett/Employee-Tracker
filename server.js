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
    // added ASCII art node package
    figlet('Employee Tracker', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        //run the start function after the connection is made to prompt the user
        start();
    });
});

// prompt user if they want to add a manager or department
function start() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Manage Users",
            "Manage Roles",
            "Manage Departments",
        ]
        // Create prompt to ask the user to choose between 3 options: role, department or employee
    }).then(function (answer) {
        switch (answer.menu) {
            case "Manage Users":
                employeeMenu();
                break;
            case "Manage Roles":
                roleMenu();
                break;
            case "Manage Departments":
                departmentMenu();
                break;
        }
    })

}
// breakdown prompts with functions for each role, asking more questions about each within.
function employeeMenu() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do with employees?",
        choices: [
            "View all Employees",
            "View Employees by Manager",
            "Add Employee",
            "Add Manager",
            "Update Employee Manager",
            "Remove Employee",
        ]
    }).then(function (answer) {
        switch (answer.menu) {
            case "Add Manager":
                addManagers()
                break;
            case "Add Employee":
                addEmployee()
                break;
            case "View Employees":
                viewEmployees()
                break;
            case "View Employees by Manager":
                viewByManager()
                break;
            case "Remove Employee":
                removeEmployee()
                break;
            case "Update Employee Role":
                updateEmployeeRole()
                break;
            case "Update Employee Manager":
                updateEmployeeManager()
                break;
        }
    });
}

function roleMenu() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do with roles?",
        choices: [
            "View Roles",
            "Add Role",
            "Remove Role",
        ]
    }).then(function (answer) {
        switch (answer.menu) {
            case "Add Role":
                addRole()
                break;
            case "View Roles":
                viewRoles()
                break;
            case "Remove Role":
                removeRole()
                break;
        }
    });
}

function departmentMenu() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do with departments?",
        choices: [
            "View Departments",
            "Add Department",
            "Remove Department",
            "View total utilized budget (combined salaries of all employees)",
        ]
    }).then(function (answer) {
        switch (answer.menu) {
            case "Add Department":
                addDepartment()
                break;
            case "View Utilized Budget of Department":
                viewBudget()
                break;
            case "View Departments":
                viewDepartments()
                break;
            case "Remove Department":
                removeDepartment()
                break;
        }
    });
}

// View Departments
function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}
// Add Department
function addDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the Department name?",
            },
        ]).then(function (answer) {
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

// Remove Department
function removeDepartment() {

}

// view Role
function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Add Role
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

// Remove Role
function removeRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}



// Add Employee
function addEmployee() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        const choices = res.map(result => {
            return {
                name: result.title, value: result.id
            }
        })
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
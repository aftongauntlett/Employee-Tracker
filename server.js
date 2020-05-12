const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const figlet = require('figlet');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    //adding process.env so I don't have to show my password in my code
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
            "Manage Employees",
            "Manage Roles",
            "Manage Departments",
            "Exit",
        ]
        // Create prompt to ask the user to choose between 3 options: role, department or employee
    }).then(function (answer) {
        switch (answer.menu) {
            case "Manage Employees":
                employeeMenu();
                break;
            case "Manage Roles":
                roleMenu();
                break;
            case "Manage Departments":
                departmentMenu();
                break;
            case "Exit":
                exitApp()
                break;
        }
    })
}

// breakdown prompts with functions for each option, asking more questions about each within.
function employeeMenu() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do with employees?",
        choices: [
            "View all Employees",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Return to Main Menu",
            // removing manager items for now
            // "View Employees by Manager",
            // "Update Employee Manager",
            // "Add Manager",
        ]
    }).then(function (answer) {
        switch (answer.menu) {
            case "Add Employee":
                addEmployee()
                break;
            case "View all Employees":
                viewEmployees()
                break;
            case "Remove Employee":
                removeEmployee()
                break;
            case "Update Employee Role":
                updateEmployeeRole()
                break;
            case "Return to Main Menu":
                mainMenu()
                break;
            // removing manager items for now
            // case "Add Manager":
            //     addManagers()
            //     break;
            // case "View Employees by Manager":
            //     viewByManager()
            //     break;
            // case "Update Employee Manager":
            //     updateEmployeeManager()
            //     break;
        }
    });
}

// removing manager options for now

// function addManagers() {
//     console.log("Add manager")
// }

// function viewByManager() {
//     console.log("View by manager")
// }

// function updateEmployeeManager() {
//     console.log("Update employee manager")
// }

function updateEmployeeRole() {
    connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id", (err, res) => {
        if (err) throw err;
        const choices = res.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name} -- ${employee.title}`,
                value: employee.id
            }
        })
        inquirer.prompt({
            name: 'employee',
            type: 'list',
            message: "Which employee's role would you like to edit?",
            choices
        })
            .then(answers => {
                updateSpecificEmployeeRole(answers.employee)
            })
    })
}

function updateSpecificEmployeeRole(id) {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        const choices = res.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        })

        inquirer.prompt({
            name: 'role',
            type: 'list',
            message: "Which role would you like the for the employee",
            choices
        }).then(answer => {
            connection.query(`UPDATE employee SET role_id = ${answer.role} WHERE id = ${id}`, (err, res) => {
                if (err) throw err;
                mainMenu();
            })
        })
    })
}

// removing budget option for now

// function viewBudget() {
//     console.log("View budget")
// }

function roleMenu() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do with roles?",
        choices: [
            "View Roles",
            "Add Role",
            "Remove Role",
            "Return to Main Menu"
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
            case "Return to Main Menu":
                mainMenu()
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
            "Return to Main Menu",
            // will come back to this
            // "View total utilized budget (combined salaries of all employees)",
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
            case "Return to Main Menu":
                mainMenu()
                break;
        }
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

// View Departments
function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Remove Department
function removeDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
        const choices = res.map(department => {
            return {
                name: department.name,
                value: department.id
            }
        })
        inquirer.prompt([
            {
                name: "id",
                type: "list",
                message: "Which department would you like to remove?",
                choices
            }

        ]).then(response => {
            connection.query(
                "DELETE FROM department WHERE ?",
                response.id,
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " department removed.\n");
                    start();
                }
            )
        });
    })

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

// view Role
function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Remove Role
function removeRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        const choices = res.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        })
        inquirer.prompt([
            {
                name: "id",
                type: "list",
                message: "Which role would you like to remove?",
                choices
            }

        ]).then(response => {
            connection.query(
                "DELETE FROM role WHERE ?",
                response.id,
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " role removed.\n");
                    start();
                }
            )
        });
    })

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
        const choices = res.map(employee => {
            return {
                name: employee.first_name + " " + employee.last_name,
                value: employee.id
            }
        })
        inquirer.prompt([
            {
                name: "id",
                type: "list",
                message: "Which employee would you like to remove?",
                choices
            }

        ]).then(response => {
            connection.query(
                "DELETE FROM employee WHERE ?",
                response.id,
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " employee removed.\n");
                    start();
                }
            )
        });
    })

}

// return to the main menu
function mainMenu() {
    start();
}

// exit the app
function exitApp() {
    figlet('Goodbye!', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        connection.end();
    });
}


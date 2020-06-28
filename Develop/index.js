const inquirer = require("inquirer");

const mysql = require("mysql");

const figlet = require('figlet');
const cTable = require("console.table");


const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    figlet('Employee Manager', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        runStart();
    });
});


function runStart() {

    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Exit"],

        }
    ]).then(selectedAction => {
        if (selectedAction.action === "View All Employees") {
            viewAllEmployees();
        }
        else if (selectedAction.action === "View All Employees by Department") {
            viewEmpbyDept();
        }
        else if (selectedAction.action === "View All Employees by Manager") {
            viewEmpbyMan();
        }
        else if (selectedAction.action === "Add Employee") {
            addEmployee();
        }
        else if (selectedAction.action === "Remove Employee") {
            removeEmployee();
        }
        else if (selectedAction.action === "Update Employee Role") {
            updateEmpRole();
        }
        else if (selectedAction.action === "Update Employee Manager") {
            updateEmpManager();
        }
        else if (selectedAction.action === "Exit") {
            console.log("Have a nice day, goodbye.");
            return;
        }
    });
};


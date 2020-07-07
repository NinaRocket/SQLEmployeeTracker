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

//arrays to hold departments, managers, and roles
let dept = [];
let managers = [];
let roles = [];

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
    getDepartments();
    getRoles();
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View All Employees",
                "View All Departments",
                "View All Managers", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Exit"],

        }
    ]).then(selectedAction => {
        if (selectedAction.action === "View All Employees") {
            viewAllEmployees();
        }
        else if (selectedAction.action === "View All Departments") {
            viewAllDept();
        }
        else if (selectedAction.action === "View All Managers") {
            viewAllManagers();
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
            process.exit();
            return;
        }
    })
};

//view all employees and join tables to show department and salary
function viewAllEmployees() {
    const query = `SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        r.salary 
    FROM 
        employee AS e 
    INNER JOIN role AS r 
    ON e.role_id = r.id`;
    connection.query(query, (err, res) => {
        console.table(res);
        runStart();
    });
};
//view employees by Department - I want to make this work in the future
// function viewEmpbyDept() {
//     inquirer.prompt([

//         {
//             type: "list",
//             name: "department",
//             message: "What department would you like to view?",
//             choices: dept

//         }
//     ]).then((selection) => {


//         const query = `SELECT e.id, e.first_name, e.last_name, r.title, department.department_name, FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department ON r.department_id = department.id WHERE department = "${selection.department}"`
//         connection.query(query, (err, res) => {
//             console.table(res);
//             console.log(selection.department);
//             runStart();
//         })
//     })
// };
function viewAllDept() {
    const query = `SELECT 
    d.department_name, 
    d.department.id 
    FROM department AS d`
    connection.query(query, (err, res) => {
        console.table(res);
        runStart();
    });
};

function viewAllManagers() {
    const query = `
    SELECT e.first_name, 
    e.last_name, 
    e.manager_id, 
    r.role_title, 
    r.salary, 
    d.department_name 
    FROM employee AS e
    INNER JOIN role AS r
    ON e.role_id = r.id
    INNER JOIN department AS d
    ON r.department_id = d.id 
    ORDER BY e.manager_id`
    connection.query(query, (err, res) => {
        console.table(res);
        runStart();
    });
};

function getDepartments() {
    const query = "SELECT department_name FROM department"
    connection.query(query, (err, res) => {
        dept = [];
        for (let i = 0; i < res.length; i++) {
            const department = res[i].department_name;
            dept.push(department);
        }
    })
};


function getRoles() {
    const query = "SELECT title FROM role"
    connection.query(query, (err, res) => {
        roles = [];
        for (let i = 0; i < res.length; i++) {
            const role = res[i].title;
            roles.push(role);
        }
    })
};
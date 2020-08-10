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
let managers = [" "];
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
    //getManagers(); 
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View All Employees",
                "View All Departments", "View All Employees by Department", "View Employees by Role",
                "View All Managers", "Add Employee", "Add Department", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Exit"],

        }
    ]).then(selectedAction => {
        if (selectedAction.action === "View All Employees") {
            viewAllEmployees();
        }
        else if (selectedAction.action === "View All Departments") {
            viewAllDept();
        }
        else if (selectedAction.action === "View All Employees by Department") {
            viewEmpbyDept();
        }
        else if (selectedAction.action === "View Employees by Role") {
            viewEmpByRole();
        }
        else if (selectedAction.action === "View All Managers") {
            viewAllManagers();
        }
        else if (selectedAction.action === "Add Employee") {
            addEmployee();
        }
        else if(selectedAction.action === "Add Department"){
            addDepartment(); 
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
//view employees by Department 
function viewEmpbyDept() {
    inquirer.prompt([

        {
            type: "list",
            name: "department",
            message: "What department would you like to view?",
            choices: dept

        }
    ]).then((selection) => {


        const query = `SELECT e.id, 
        e.first_name, e.last_name, 
        r.title, department.department_name 
        FROM employee AS e 
        INNER JOIN role AS r 
        ON e.role_id = r.id 
        INNER JOIN department 
        ON r.department_id = department.id
         WHERE department.department_name = '${selection.department}'`
        connection.query(query, (err, res) => {
            console.table(res);
            runStart();
        })
    })
};

//view employees by roles
function viewEmpByRole() {
    inquirer.prompt({
        
        type: "list",
        name: "role",
        message: "Which role would you like to view?",
        choices: roles
    }).then((selection) => {
        const query =
            `SELECT
	            e.id,
                e.first_name,
                e.last_name,
                r.title,
                r.salary,
                department.department_name
            FROM
	            employee AS e
            INNER JOIN
	            role AS r
            ON e.role_id = r.id
            INNER JOIN
	            department
            ON r.department_id = department.id
            WHERE title = "${selection.role}"`
        connection.query(query, (err, res) => {
            console.log("this ran"); 
            console.table(res);
            runStart();
        })
    })
};

//view the departments
function viewAllDept() {
    const query = `SELECT * FROM department`
    connection.query(query, (err, res) => {
        console.table(res);
        runStart();
    });
};


function addEmployee(){
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roles
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: managers
        }

    ]).then((selection)=>{
        connection.query("SELECT id FROM role WHERE ?",
        {
            title: selection.role
        },
    (err, res)=> {
        const role = res[0].id;
        let manager;
        const name = selection.manager.split(" ")
        connection.query("SELECT id FROM employee WHERE ? AND ?",
        [{
            first_name: name[0]
        },
        {
            last_name: name[1]
        }],
        (err, res) => {
            if(!res.length){
                manager = null;
            }else{
                manager = res[0].id
            }
            connection.query("INSERT INTO employee SET ?",
            {
                first_name: selection.firstName,
                last_name: selection.lastName,
                role_id: role,
                manager_id: manager
            },
            (err) => {
                if (err) throw err;
                console.log("Employee added!");
                runStart(); 
            })
        });
    })

})
};

//add a new department
function addDepartment() {
    inquirer.prompt({
      type: "input",
      name: "addDept",
      message: "What is the name of the new Department?"
    }).then(function (answer) {
      //let query = "INSERT INTO department SET ?";
      connection.query("INSERT INTO department SET ?",
       { department_name: `${answer.addDept}` }, 
       (err) =>{
        if (err) throw err;
        console.log("Department added!");
        runStart();
      });
    });
  };

//get departments
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

//get roles
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

//function that retrieves Managers, need get managers working
function getManagers() {
    const query =
    `SELECT DISTINCT manager
    FROM (
    SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        role.salary,
        department.department_id,
        CONCAT(m.first_name, " ", m.last_name) as "manager"
    FROM
        employee
    INNER JOIN
        role
      ON employee.role_id = role.id
    INNER JOIN
        department
      ON role.department_id = department.id
    LEFT OUTER JOIN employee m
      ON employee.manager_id = m.id
    ) m`
    connection.query(query, (err, res) => {
        managers = [" "]
        for (let i = 0; i < res.length; i++) {
            const manager = res[i].manager;
            managers.push(manager);
        }
    })
};

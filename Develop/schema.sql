
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee
(
    id INT NOT NULL AUTO_INCREMENT;
    first_name VARCHAR(30);
    last_name VARCHAR(30);
    role_id INT;
    manager_id INT;
);

 CREATE TABLE role
(
        id INT NOT NULL AUTO_INCREMENT;
    title VARCHAR (30);
    salary DECIMAL;
    department_id INT;
);

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT ;
    name VARCHAR(30);
);
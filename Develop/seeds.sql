USE employee_db; 

INSERT INTO department (department_name)
VALUES ("Enrollment"), ("Financial Aid");

INSERT INTO role (title, salary, department_id)
VALUES ("Enrollment Advisor", 53000, 1), ("Financial Aid Advisor", 49000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Harmony", "Blake", 1), ("Rosco", "Asante", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Harry", "Henderson", 1, 1),
("Susan", "Apple", 1, 1),
("Melinda", "Reed", 1, 1),
("Olivia", "August", 1, 1),
("Hillary", "Clinton", 1, 1),
("Boston", "Dex", 1, 1),
("Alice", "Wilkins", 2, 2),
("Hannah", "Musk", 2, 2),
("Octavian", "Smith", 2, 2);








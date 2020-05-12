-- department
INSERT INTO department (name)
VALUES ("Human Resources"), ("Customer Service"), ("Quality Assurance"), ("Development");

-- roles
INSERT INTO role (title, salary, department_id)
VALUES("Human Resources", 45000,1);

INSERT INTO role (title, salary, department_id)
VALUES("Customer Service", 40000, 2);

INSERT INTO role (title, salary, department_id)
VALUES("Quality Assurance", 55000, 3);

INSERT INTO role (title, salary, department_id)
VALUES("Senior Developer", 95000, 4);

-- employees
INSERT INTO employee(first_name, last_name, role_id)
VALUES
("Sparky", "Meows", 1),
("Sumia", "Meows", 2),
("Afton", "Gauntlett", 3),
("David", "Gauntlett", 4)
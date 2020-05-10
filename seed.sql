DROP DATABASE IF EXISTS trackingDB;
CREATE DATABASE trackingDB;
USE trackingDB;

-- Create a table for the department
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

-- Create a table for role
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INTEGER,
  PRIMARY KEY (id)
);

-- Create a table for the Employee
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INTEGER NULL,
  manager_id INTEGER,
  PRIMARY KEY (id)
);

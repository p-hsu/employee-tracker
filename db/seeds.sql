USE employee_trackerDB;


-- for department table
INSERT INTO department (dept_name)
VALUES ("Finance"), ("HR"), ("Medical"), ("Outreach");

-- for roles table
INSERT INTO roles (title, salary, department_id)
VALUES ("Executive Director", "85000", 1), ("HR staff", "28000", 1), ("Technician", "25000", 1), ("Outreach Coordinator", "30000", 1);

-- for employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES("Wendy", "Heckman", 1, 5), ("Kelly", "Thorpe", 2, NULL), ("Angie", "Duhr", 3, 6), ("Andrea", "Schwartz", 4, NULL);
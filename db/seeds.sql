USE employee_trackerDB;

-- for department table
INSERT INTO department (dept_name)
VALUES ("Management"), ("HR"), ("Medical"), ("Outreach");

-- for roles table
INSERT INTO roles (title, salary, department_id)
VALUES ("Executive Director", "85000", 1), ("HR lead", "28000", 2), ("Veterinarian", "60000", 3), ("Technician", "25000", 3), ("Outreach Coordinator", "30000", 4);

-- for employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES("Wendy", "Heckman", 1, NULL), ("Kelly", "Thorpe", 2, 1), ("Angie", "Duhr", 4, 1), ("Kat", "Manion", 4, 3);
// require db-connection.js
const connection = require('../config/db-connection');

// class constructor for all SQL quieries
class Queries {
    constructor (connection) {
        this.connection = connection
    };

    // SHOW QUERIES
    showDept() {
        // BONUS! > show total utilized budget
        return this.connection.query(
            'SELECT department.id, department.dept_name, SUM(roles.salary) AS budget FROM department LEFT JOIN roles ON department.id = roles.department_id GROUP BY department.id'
        );
    }

    showRole() {
        return this.connection.query(
            'SELECT roles.id, roles.title, roles.salary, department.dept_name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id;'
        );
    }

    showEmp() {
        return this.connection.query(
            'SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name AS department, roles.salary, CONCAT(manager.first_name, \' \', manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id'
        );

    }

    // CREATE QUERIES
    createDept() {
        return this.connection.query(
            'INSERT INTO department SET ?'
        );
    }

    createRole() {
        return this.connection.query(
            'INSERT INTO roles SET ?'
        );
    }

    createEmp() {
        return this.connection.query(
            'INSERT INTO employee SET ?'
        );
    }

    // REMOVE QUERIES

    removeDept() {
        return this.connection.query(
            'DELETE FROM department WHERE id = ?'
        );
    }

    removeRole() {
        return this.connection.query(
            'DELETE FROM roles WHERE id = ?'
        );
    }

    removeEmp() {
        return this.connection.query(
            'DELETE FROM employee WHERE id = ?'
        );
    }
}


module.exports = new Queries(connection)
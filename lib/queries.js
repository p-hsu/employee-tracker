// require db-connection.js
const connection = require('../config/db-connection');

// class constructor for all SQL quieries
class Query {
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
            'SELECT roles.id, roles.title, roles.salary, department.dept_name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id'
        );
    }

    showEmp() {
        return this.connection.query(
            'SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name AS department, roles.salary, CONCAT(manager.first_name, \' \', manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id'
        );

    }

    showFullName() {
        return this.connection.query(
            'SELECT employee.id, employee.first_name, employee.last_name, CONCAT(employee.first_name, \' \', employee.last_name) AS full_name FROM employee'
        );
    }

    showOnlyManagers() {
        return this.connection.query(
            'SELECT DISTINCT employee.manager_id, CONCAT(manager.first_name, \' \', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE employee.manager_id IS NOT NULL'
        );
    }

    // CREATE QUERIES
    createDept(department) {
        return this.connection.query(
            'INSERT INTO department SET ?', department
        );
    }

    createRole(role) {
        return this.connection.query(
            'INSERT INTO roles SET ?', role
        );
    }

    createEmp(employee) {
        return this.connection.query(
            'INSERT INTO employee SET ?', employee
        );
    }

    // UPDATE QUERIES

    updateEmpRole(updateRole) {
        return this.connection.query(
            'UPDATE employee SET ? WHERE ?', updateRole
        );
    }

    updateEmpMng(updateMngId) {
        return this.connection.query(
            'UPDATE employee SET manager_id WHERE id = ?', updateMngId
        )
    }

    // DELETE QUERIES

    deleteDept(deptId) {
        return this.connection.query(
            'DELETE FROM department WHERE id = ?', deptId
        );
    }

    deleteRole(roleId) {
        return this.connection.query(
            'DELETE FROM roles WHERE id = ?', roleId
        );
    }

    deleteEmp(employeeId) {
        return this.connection.query(
            'DELETE FROM employee WHERE id = ?', employeeId
        );
    }
}


module.exports = new Query(connection)
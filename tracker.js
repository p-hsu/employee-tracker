// require Dependencies
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./config/db-connection');
const query = require('./lib/queries');

// async function init()
    // await prompt()
const init = async () => {
    await inquirer.prompt ({
        name: 'choice',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View by employees',
            'View by roles',
            'View by departments',
            'Update employee',
            'Add new employee',
            'Add new role',
            'Add new department',
            'Remove employee',
            'Remove role',
            'Remove department',
            'Quit'
        ],
    })
    .then ((todo) => {
        switch (todo.choice) {
            case 'View by employees':
                viewEmp();
                break;
            case 'View by roles':
                viewRoles();
                break;
            case 'View by departments':
                viewDept();
                break;
            case 'Update employee':
                updateEmp();
                break;
            case 'Add new employee':
                addEmp();
                break;
            case 'Add new role':
                addRole();
                break
            case 'Add new department':
                addDept();
                break
            case 'Remove employee':
                removeEmp();
                break
            case 'Remove role':
                removeRole();
                break
            case 'Remove department':
                removeDept();
                break
            case 'Quit':
                exitApp();
        }
    });
};


// >>>> FUNCTIONS TO VIEW <<<<

const viewEmp = async () => {
    const empTable = await query.showEmp();

    console.table(empTable);
    console.log(`\n=============================\n`)
    returnInit();
}

const viewRoles = async () => {
    const roleTable = await query.showRole();

    console.table(roleTable);
    console.log(`\n=============================\n`)
    returnInit();
}

const viewDept = async () => {
    const deptTable = await query.showDept();

    console.table(deptTable);
    console.log(`\n=============================\n`)
    returnInit();
}

// >>>> FUNCTIONS TO ADD <<<<

const addEmp  = async () => {
    const roles = await query.showRole();
    const rolesChoices = roles.map(({title, id}) => ({
        name: title,
        value: id
    }))
    const newEmp = await inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'What is this employee\'s first name?',
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'What is this employee\'s last name?',
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'What is this employee\'s role?',
            choices: rolesChoices
        },
    ]);
    await query.createEmp(newEmp);
    console.log(`\nThe new employee ${newEmp.first_name} ${newEmp.last_name}has been added to the database.\n` )
    hasManager();
}

const addRole  = async () => {
    const department = await query.showDept();
    const departmentChoices = department.map(({dept_name, id}) => ({
        name: dept_name,
        value: id
    }))
    const newRole= await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of the new role?',
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of this new role?',
        },
        {
            name: 'department_id',
            type: 'list',
            message: 'Which department does this new role belong in?',
            choices: departmentChoices
        },
    ]);
    await query.createRole(newRole);
    console.log(`\nA new role ${newRole.title} of the ${newRole.deparment_id} department added.\n` )
    returnInit();
}

const addDept  = async () => {
    const newDept= await inquirer.prompt([
        {
            name: 'dept_name',
            type: 'input',
            message: 'What is the name of the new department?',
        }
    ]);
    await query.createDept(newDept);
    console.log(`\nA new ${newDept.dept_name} department added.\n` )
    returnInit();
}

// >>>> FUNCTION FOR MANAGER <<<<

const hasManager = async () => {
    await inquirer.prompt ({
        name: 'has_manager',
        type: 'confirm',
        message: 'Does this employee have a direct manager?',
        when: (answer) => answer
    })
    .then ((confirm) => {
        if (confirm.has_manager === true) {
            updateManager();
        } else {
            console.log(`\nExiting application...goodbye!\n`)
            connection.end
        };
    });
}

// >>>> FUNCTIONS TO UPDATE <<<<

const updateEmp = async () => {
    await inquirer.prompt ({
        name: 'update',
        type: 'list',
        message: 'Do you want to update a employee\'s role or manager?',
        choices: [
            'Update employee role',
            'Update employee manager',
            'Oops, take me back to prompts!',
        ],
    })
    .then ((choice) => {
        switch (choice.update) {
            case 'Update employee role':
                updateRole();
                break;
            case 'Update employee manager':
                updateManager();
                break;
            case 'Oops, take me back to prompts!':
                console.log(`\nPrompts will show shortly...\n`)
                setTimeout(init, 1000);
                break;
        }
    });
};

const updateRole = async () => {
    const employee = await query.showFullName();
    const employeeChoices = employee.map(({full_name, id}) => ({
        name: full_name,
        value: id
    }))

    const roles = await query.showRole();
    const rolesChoices = roles.map(({title, id}) => ({
        name: title,
        value: id
    }))

   const changeRole =  await inquirer.prompt([
        {
            name: 'employee_id',
            type: 'list',
            message: 'Which employee are you updating?',
            choices: employeeChoices
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'What is this employee\'s new role?',
            choices: rolesChoices
        }
    ]);
    await connection.query(
        'UPDATE employee SET ? WHERE ?',
        [
          {
            role_id: changeRole.role_id,
          },
          {
            id: changeRole.employee_id,
          },
        ],
        (err, res) => {
          if (err) throw err;
          console.log(`\nThis employee is now updated to a new role!}\n` )
          returnInit();
        }
    )
}

const updateManager = async () => {
    const employee = await query.showFullName();
    const employeeChoices = employee.map(({full_name, id}) => ({
        name: full_name,
        value: id
    }))

    const manager = await query.showOnlyManagers();
    const managerChoices = manager.map(({manager, manager_id}) => ({
        name: manager,
        value: manager_id,
    }))
    const changeManager = await inquirer.prompt([
        {
            name: 'employee_id',
            type: 'list',
            message: 'Which employee are you updating?',
            choices: employeeChoices
        },
        {
            name: 'manager_id',
            type: 'list',
            message: 'Who does this employee report to?',
            choices: managerChoices
        }
    ]);
    await connection.query(
        'UPDATE employee SET manager_id = ? WHERE ?',
        [
          {
            manager_id: changeManager.manager_id,
          },
          {
            id: changeManager.employee_id,
          },
        ],
        (err, res) => {
          if (err) throw err;
          console.log(`\nThis employee is now updated with a new Manager!}\n` )
          returnInit();
        }
    )
}

// >>>> FUNCTIONS TO REMOVE <<<<

const removeEmp  = async () => {
    const employee = await query.showFullName();
    const employeeChoices = employee.map(({full_name, id}) => ({
        name: full_name,
        value: id
    }))
    const oldEmp = await inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            message: 'Which employee needs to be removed?',
            choices: employeeChoices
        }
    ]);
    await query.deleteEmp(oldEmp);
    console.log(`\nEmployee removed from database.\n` )
    returnInit();
}

const removeRole  = async () => {
    const role = await query.showRole();
    const roleChoices = role.map(({title, id}) => ({
        name: title,
        value: id
    }))
    const oldRole = await inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            message: 'Which role needs to be removed?',
            choices: roleChoices
        }
    ]);
    await query.deleteRole(oldRole);

    console.log(`\nRole removed from database.\n` )
    returnInit();
}

const removeDept  = async () => {
    const department = await query.showDept();
    const departmentChoices = department.map(({dept_name, id}) => ({
        name: dept_name,
        value: id
    }))
    const oldDept = await inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            message: 'Which department needs to be removed?',
            choices: departmentChoices
        }
    ]);
    await query.deleteDept(oldDept);

    console.log(`\nDepartment removed from database.\n` )
    returnInit();
}


// >>>> CONNECT TO DB AND RUN init() TO START APP <<<<
connection.connect((err) => {
    if (err) throw err;
    console.log('  •˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•  ')
    console.log('                                                                                                                                                             ')
    console.log('    ####### ##        ## #######  ##      ####### ##    ## ####### #######      #######       #    ########     #     ######      #      ####### #######     ')
    console.log('    ###     ####    #### ##    ## ##      ##   ##  ##  ##  ###     ###          ##    ##     ###      ##       ###    ##    #    ###    ##       ##          ')
    console.log('    #####   ## ##  ## ## #######  ##      ##   ##   ####   #####   #####        ##     ##   ## ##     ##      ## ##   ######    ## ##    #####   #####       ')
    console.log('    ##      ##  ####  ## ##       ##      ##   ##    ##    ###     ###          ##    ##   #######    ##     #######  ##    #  #######        ## ##          ')
    console.log('    ####### ##   ##   ## ##       ####### #######    ##    ####### #######      #######   ##     ##   ##    ##     ## ######  ##     ## #######  #######     ')
    console.log('                                                                                                                                                             ')
    console.log('  •˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•˚•  \n')
    setTimeout(init, 1000);
});

// >>>> FUNCTION TO RETURN TO PROMPT <<<<

const returnInit = async () => {
    await inquirer.prompt ({
        name: 'return',
        type: 'confirm',
        message: 'Do you want to return to prompts?',
        when: (answer) => answer
    })
    .then ((confirm) => {
        if (confirm.return === true) {
            console.log(`\nPrompts will show shortly...\n`)
            setTimeout(init, 1000);
        } else {
            console.log(`\nExiting application...goodbye!\n`)
            connection.end
        };
    });
}

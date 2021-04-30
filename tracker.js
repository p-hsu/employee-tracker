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
            'View databases',
            'Add to database',
            'Remove from database',
            'Update employee database',
            'Quit'
        ],
    })
    .then ((todo) => {
        switch (todo.choice) {
            case 'View databases':
                viewDb();
                break;
            case 'Add to database':
                addDb();
                break;
            case 'Remove from database':
                removeDb();
                break;
            case 'Update employee database':
                updateEmp();
                break;
            case 'Quit':
                console.log(`\nDisconnecting from database...\n`)
                connection.end
                console.log('...press control C to exit the app, goodbye!\n')
        }
    });
};

// >>>> VIEW DATABASE <<<<

const viewDb = async () => {
    await inquirer.prompt ({
        name: 'choice',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View employee database',
            'View roles database',
            'View departments database',
            'View employees by manager',
            'Main menu'
        ],
    })
    .then ((todo) => {
        switch (todo.choice) {
            case 'View employee database':
                viewEmp();
                break;
            case 'View roles database':
                viewRoles();
                break;
            case 'View departments database':
                viewDept();
                break;
            case 'View employees by manager':
                viewByManager();
                break;
            case 'Main menu':
                returnMain();
                break;
        }
    });
};

const viewEmp = async () => {
    const empTable = await query.showEmp();

    console.log(`\n\n`)
    console.table(empTable);
    console.log(`\n========================= >>>\n`)
    returnView();
}

const viewRoles = async () => {
    const roleTable = await query.showRole();

    console.log(`\n\n`)
    console.table(roleTable);
    console.log(`\n========================= >>>\n`)
    returnView();
}

const viewDept = async () => {
    const deptTable = await query.showDept();

    console.log(`\n\n`)
    console.table(deptTable);
    console.log(`\n========================= >>>\n`)
    returnView();
}

const viewByManager = async () => {
    const managerTable = await query.showByManager();

    console.log(`\n\n`)
    console.table(managerTable);
    console.log(`\n========================= >>>\n`)
    returnView();
}

// >>>> ADD TO DATABASE <<<<

const addDb = async () => {
    await inquirer.prompt ({
        name: 'choice',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'Add to employee database',
            'Add to role database',
            'Add to department database',
            'Main menu'
        ],
    })
    .then ((todo) => {
        switch (todo.choice) {
            case 'Add to employee database':
                addEmp();
                break;
            case 'Add to role database':
                addRole();
                break;
            case 'Add to department database':
                addDept();
                break;
            case 'Main menu':
                returnMain();
                break;
        }
    });
};

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
    const empTable = await query.showEmp();

    console.table(empTable);
    console.log(`\n========================= >>>\n`)
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
    console.log(`\nA new role ${newRole.title} added to database.\n` )
    const roleTable = await query.showRole();

    console.table(roleTable);
    console.log(`\n========================= >>>\n`)
    returnAdd();
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
    console.log(`\nA new ${newDept.dept_name} department added to database.\n` )
    const deptTable = await query.showDept();

    console.table(deptTable);
    console.log(`\n========================= >>>\n`)
    returnAdd();
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
            returnAdd();
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
            'Main menu',
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
            case 'Main menu':
                returnMain();
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
          returnMain();
        }
    )
}

const updateManager = async () => {
    const employee = await query.showFullName();
    const employeeChoices = employee.map(({full_name, id}) => ({
        name: full_name,
        value: id
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
            message: 'To whom does this employee report to?',
            choices: employeeChoices
        }
    ]);
    await connection.query(
        'UPDATE employee SET ? WHERE ?',
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
          console.log(`\nThis employee is now updated with a new Manager!\n` )
          returnMain();
        }
    )
}

// >>>> REMOVE FROM DATABASE <<<<

const removeDb = async () => {
    await inquirer.prompt ({
        name: 'choice',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'Remove from employee database',
            'Remove from roles database',
            'Remove from departments database',
            'Main menu'
        ],
    })
    .then ((todo) => {
        switch (todo.choice) {
            case 'Remove from employee database':
                removeEmp();
                break;
            case 'Remove from roles database':
                removeRole();
                break;
            case 'Remove from departments database':
                removeDept();
                break;
            case 'Main menu':
                returnMain();
                break;
        }
    });
};

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
    const empTable = await query.showEmp();

    console.table(empTable);
    console.log(`\n========================= >>>\n`)
    returnRemove();
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
    const roleTable = await query.showRole();
    console.log(`\n========================= >>>\n`)
    returnRemove();
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
    const deptTable = await query.showDept();

    console.table(deptTable);
    console.log(`\n========================= >>>\n`)
    returnRemove();
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
    setTimeout(init, 800);
});

// >>>> RETURN VS EXIT <<<<

const returnMain = async () => {
    await inquirer.prompt ({
        name: 'return',
        type: 'confirm',
        message: 'Confirm "y" to go back to MAIN menu, otherwise application will exit.',
        when: (answer) => answer
    })
    .then ((confirm) => {
        if (confirm.return === true) {
            console.log(`\nReturning to MAIN menu...\n`)
            setTimeout(init, 800);
        } else {
            console.log(`\nDisconnecting from database...\n`)
            connection.end
            console.log(`...press control C to exit the app, goodbye!\n`)
        };
    });
}

const returnView = async () => {
    await inquirer.prompt ({
        name: 'return',
        type: 'confirm',
        message: 'Confirm "y" to go back to VIEW menu, otherwise application will exit.',
        when: (answer) => answer
    })
    .then ((confirm) => {
        if (confirm.return === true) {
            console.log(`\nReturning to VIEW menu...\n`)
            setTimeout(viewDb, 800);
        } else {
            console.log(`\nDisconnecting from database...\n`)
            connection.end
            console.log(`...press control C to exit the app, goodbye!\n`)
        };
    });
}

const returnAdd = async () => {
    await inquirer.prompt ({
        name: 'return',
        type: 'confirm',
        message: 'Confirm "y" to go back to ADD menu, otherwise application will exit.',
        when: (answer) => answer
    })
    .then ((confirm) => {
        if (confirm.return === true) {
            console.log(`\nReturning to ADD menu...\n`)
            setTimeout(addDb, 800);
        } else {
            console.log(`\nDisconnecting from database...\n`)
            connection.end
            console.log(`...press control C to exit the app, goodbye!\n`)
        };
    });
}

const returnRemove = async () => {
    await inquirer.prompt ({
        name: 'return',
        type: 'confirm',
        message: 'Confirm "y" to go back to REMOVE menu, otherwise application will exit.',
        when: (answer) => answer
    })
    .then ((confirm) => {
        if (confirm.return === true) {
            console.log(`\nReturning to REMOVE menu...\n`)
            setTimeout(removeDb, 800);
        } else {
            console.log(`\nDisconnecting from database...\n`)
            connection.end
            console.log(`...press control C to exit the app, goodbye!\n`)
        };
    });
}
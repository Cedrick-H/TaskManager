document.addEventListener('DOMContentLoaded', function() {
    const myTasksBtn = document.getElementById('myTasksBtn');
    const completedTasksBtn = document.getElementById('completedTasksBtn');
    const myTasksPage = document.getElementById('myTasksPage');
    const completedTasksPage = document.getElementById('completedTasksPage');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTaskModal = document.getElementById('addTaskModal');
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const myTasksTable = document.getElementById('myTasksTable');
    const completedTasksTable = document.getElementById('completedTasksTable');
    const deleteCompletedBtn = document.getElementById('deleteCompletedBtn');

    let tasks = [];
    let completedTasks = [];

    // Load tasks from localStorage on page load
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        displayTasks();
    }

    // Load completed tasks from localStorage on page load
    if (localStorage.getItem('completedTasks')) {
        completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
        displayCompletedTasks();
    }

    // Switch to My Tasks page
    myTasksBtn.addEventListener('click', function() {
        myTasksPage.style.display = 'block';
        completedTasksPage.style.display = 'none';
        myTasksBtn.classList.add('active');
        completedTasksBtn.classList.remove('active');
    });

    // Switch to Completed Tasks page
    completedTasksBtn.addEventListener('click', function() {
        completedTasksPage.style.display = 'block';
        myTasksPage.style.display = 'none';
        completedTasksBtn.classList.add('active');
        myTasksBtn.classList.remove('active');
    });

    // Show add task modal
    addTaskBtn.addEventListener('click', function() {
        addTaskModal.style.display = 'block';
    });

    // Close add task modal when close button is clicked
    document.getElementsByClassName('close')[0].addEventListener('click', function() {
        addTaskModal.style.display = 'none';
        clearAddTaskInputs();
    });

    // Save task when save button is clicked
    saveTaskBtn.addEventListener('click', function() {
        const task = {
            taskName: taskInput.value,
            date: dateInput.value
        };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
        addTaskModal.style.display = 'none';
        clearAddTaskInputs();
    });

    // Display tasks in My Tasks page
    function displayTasks() {
        myTasksTable.innerHTML = '';
        tasks.forEach((task, index) => {
            const row = myTasksTable.insertRow();
            row.insertCell(0).textContent = task.taskName;
            row.insertCell(1).textContent = task.date;
            const actionsCell = row.insertCell(2);
            const completedBtn = document.createElement('button');
            completedBtn.textContent = 'Completed';
            completedBtn.classList.add('completed-btn');
            completedBtn.addEventListener('click', function() {
                completeTask(index);
            });
            actionsCell.appendChild(completedBtn);
            const awaitingBtn = document.createElement('button');
            awaitingBtn.textContent = 'Awaiting';
            awaitingBtn.classList.add('awaiting-btn');
            awaitingBtn.addEventListener('click', function() {
                highlightTask(index);
            });
            actionsCell.appendChild(awaitingBtn);
        });
    }

    // Complete task and move to Completed Tasks page
    function completeTask(index) {
        const completedTask = tasks.splice(index, 1)[0];
        completedTasks.push(completedTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        displayTasks();
        displayCompletedTasks();
    }

    // Highlight task as awaiting
    function highlightTask(index) {
        tasks[index].awaiting = !tasks[index].awaiting;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }

    // Display completed tasks in Completed Tasks page
    function displayCompletedTasks() {
        completedTasksTable.innerHTML = '';
        completedTasks.forEach((task, index) => {
            const row = completedTasksTable.insertRow();
            row.insertCell(0).textContent = task.taskName;
            row.insertCell(1).textContent = task.date;
            const checkboxCell = row.insertCell(2);
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkboxCell.appendChild(checkbox);
        });
    }

    // Delete selected completed tasks
    deleteCompletedBtn.addEventListener('click', function() {
        for (let i = completedTasksTable.rows.length - 1; i >= 0; i--) {
            const checkbox = completedTasksTable.rows[i].getElementsByTagName('input')[0];
            if (checkbox.checked) {
                completedTasks.splice(i, 1);
            }
        }
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        displayCompletedTasks();
    });

    // Clear add task inputs
    function clearAddTaskInputs() {
        taskInput.value = '';
        dateInput.value = '';
    }
});
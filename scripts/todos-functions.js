'use strict'

// Fetching existing todos from local storage
const getSavedTodos = () => {
    const todosJSON = localStorage.getItem('todos');

    try {
        return todosJSON ? JSON.parse(todosJSON) : [];
    } catch (e) {
        return [];
    }
}

// Save todos to local storage
const saveTodos = todos => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

// Remove todo Id
const removeTodo = id => {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1);
    }
}

// Toggle the completed value for a given todo 
const toggleTodo = id => {
    const todo = todos.find(todo => todo.id === id)

    if (todo) {
        todo.completed = !todo.completed;
    }
}


// Render application todos based on filter
const renderTodos = (todos, filters) => {
    const todoEl = document.querySelector('#todos');
    const filteredTodos = todos.filter((todo) => {
        const searchTextMatch = todo.text.toLowerCase().includes(filters.searchText.toLowerCase())
        const hideCompletedMatch = !filters.hideCompleted || !todo.completed;

        return searchTextMatch && hideCompletedMatch;
    })

    const incompleteTodos = filteredTodos.filter(todo => !todo.completed);
    // clear the div before rendering things
    todoEl.innerHTML = '';
    todoEl.appendChild(generateSummaryDOM(incompleteTodos));


    if (filteredTodos.length > 0) {
        filteredTodos.forEach((todo) => {
            todoEl.appendChild(generateTodoDOM(todo));
        })
    } else {
        const messageEle = document.createElement('p');
        messageEle.classList.add('empty-message');
        messageEle.textContent = "No todos to show.";
        todoEl.appendChild(messageEle);
    }
}

// Get the DOM element for individual note
const generateTodoDOM = todo => {
    const todoEl = document.createElement('level');
    const containerEle = document.createElement('div')
    const checkbox = document.createElement('input');
    const todoText = document.createElement('span');
    const removeButton = document.createElement('button');

    // Setup todo checkbox
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = todo.completed;
    containerEle.appendChild(checkbox);
    // Event handler for checkbox
    checkbox.addEventListener('change', () => {
        toggleTodo(todo.id);
        saveTodos(todos);
        renderTodos(todos, filters);
    });

    // Setup a  `the todo text;
    todoText.textContent = todo.text;
    containerEle.appendChild(todoText);

    // set up container
    todoEl.classList.add('list-item');
    containerEle.classList.add('list-item__container');
    todoEl.appendChild(containerEle)

    // Setup the remove button
    removeButton.textContent = 'remove';
    removeButton.classList.add('button', 'button--text');
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', () => {
        removeTodo(todo.id);
        saveTodos(todos);
        renderTodos(todos, filters);
    });
    return todoEl;
}

// Get the DOM elements for list summary
const generateSummaryDOM = incompleteTodos => {
    const summary = document.createElement('h2');
    const plural = incompleteTodos.length === 1 ? '' : 's';
    summary.classList.add('list-title');

    summary.textContent = `you have ${incompleteTodos.length} todo${plural} left.`;
    return summary
}
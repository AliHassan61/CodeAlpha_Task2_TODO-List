const $todoForm = document.querySelector('#js-todo-form'),
    $todoBody = document.querySelector('.js-todo-body'),
    $count = document.querySelector('.js-count'),
    $clear = document.querySelector('.js-clear')

// Global data for todos
let todos = []

// Set the event listener 
window.addEventListener('load', handleWindowLoad)
$todoForm.addEventListener('submit', handleFormSubmit)
$todoBody.addEventListener('click', handleFormAction)
$clear.addEventListener('click', handleClearTodos)

function handleWindowLoad() {
    // Get the local storage data
    // Don't forget to parse it because by default it's string
    const localStorageTodos = JSON.parse(localStorage.getItem('todos'))

    // if there's no value set empty array by default
    todos = localStorageTodos || []

    // show the empty state if there's no value
    // if it have, use it's data to render the list
    if(todos.length === 0) {
        renderEmptyState()
    } else{
        // Create the ul element of the list item
        renderTodoList()
        // Create each list item
        todos.map((todo) => {
            renderTodo(todo)
        })
    }

    // Show how many items in the list
    updateListCount()
}

function renderEmptyState() {
    // Create HTML for empty state
    $todoBody.innerHTML = `<div class="empty">
    <img src="./images/Empty.jpg" alt="empty_Image" />
    <p class="title">It's lonely here....</p>
    </div>`
}

function renderTodoList() {
    // Create HTML ul tag for the list
    $todoBody.innerHTML = `<ul class="todo_list js-todo-list"></ul>`
}

function renderTodo(todo) {
    // Create the todo list using the passed todo object
    let todoList = `<li data-id="${todo.id}" data-status="${todo.status}">
    <label for="${todo.id}">
    <input type="checkbox" id="${todo.id}" value="${todo.id}" ${
    todo.status === 'completed' ? 'checked' : null} />
    <input type="text" value="${todo.task}" readonly />
    </label>
    <div class="actions">
    <button class="js-edit">
        <i class="ri-pencil-fill"></i>
    </button>
    <button class="js-delete">
        <i class="ri-delete-bin-fill"></i>
    </button>
    </div>
    </li>`

    // Append each list to its parent ul tag container
    $todoBody.querySelector('.js-todo-list').innerHTML += todoList
}

function updateListCount() {
    // Update the current count of the todo list
    $count.innerHTML = `${todos.length} items left`
}

function handleFormSubmit(e) {
    // Prevent form refreshing the page on submit
    e.preventDefault()

    // Get the value of the form input
    // Create the todo Object
    const $input = this.querySelector('input'),
    todo = $input.value,
    myTodo = {id: Date.now(), task: todo, status: 'pending'}

    // Add the object to the global todos variable
    todos.push(myTodo)
    // To persists  we need localStorage to save the date
    localStorage.setItem('todos', JSON.stringify(todos))
    // Reset the input value
    $input.value = ''

    // Create HTML ul tag if the first todo is create by form submit
    if(todos.length === 1) renderTodoList()

    // Pass the todo object to create the list item
    renderTodo(myTodo)

    // Update the current count of the todo list
    updateListCount()
}

function handleFormAction(e) {
    // I attached the click event to the todoBody element because the todo list elements are create dynamically
    // Create a function to update the todo item status
    updateStatus(e)

    // Create a function to delete the todo item
    deleteTodo(e)

    // Create a function to toggle and update the todo item
    toggleInputState(e)
}

function updateStatus(e) {
    // Target the checkbox element
    const $status = e.target.closest('input[type="checkbox"]')

    // Check if the current element is the checkbox
    // if not it should not proceed

    if(!$status) return

    // Find the ID that is attached the HTML li tag
    // Check the current state of the checkbox
    // With the use of the ID we can know the array index that we need to update
    const $li = $status.closest('li'),
        id = $li.dataset.id,
        status = $status.checked ? 'completed' : 'pending',
        currentIndex = todos.findIndex((todo) => todo.id == id)

        // Apply the updated status to the date attribute
        $li.dataset.status = status
        // Apply the updated status to the todo global array
        todos[currentIndex].status = status

        // Save the data to the localStorage
        // Stringify it because localStorage only accepts string
        localStorage.setItem('todos', JSON.stringify(todos))
}

function deleteTodo(e) {
    // Target the delete icon
    const $delete = e.target.closest('.js-delete')

    // Check the current element if it's delete icon
    // if not it should not proceed
    
    if(!$delete) return

    // Find the ID that is attached at the HTML li tag
    const id = $delete.closest('li').dataset.id
    // Get the list of todo except to the item that will be deleted 

    todos = todos.filter((todo) => todo.id != id)
    // Remove the HTML li tag
    $delete.closest('li').remove()
    // Save the data to localStorage
    localStorage.setItem('todos', JSON.stringify(todos))

    // Show empty State if there's no todo item
    if(todos.length === 0) renderEmptyState()

    // Update the count since we remove it to the todo array
    updateListCount()
}

function toggleInputState(e) {
    // Target the edit icon
    const $edit = e.target.closest('.js-edit')
    // Check if the current element is edit icon
    // if  not it should not proceed

    if(!$edit) return

    // Find the ID that is attached at the HTML li tag
    // Find the input field
    const id = $edit.closest('li').dataset.id,
        $input = $edit.closest('li').querySelector('input[type="text"]')
    
    // Toggle the input state to edittable to readonly
    if($input.hasAttribute('readonly')) $input.removeAttribute('readonly')
    else $input.setAttribute('readonly', '')

    // Create keyup event listener to update the todo
    $input.addEventListener('keyup', updateTodo.bind(e, id))
}

function updateTodo(id, e) {
    // Get the input value
    // find the index of the current input
    let value = e.target.value,
        index = todos.findIndex((todo) => todo.id == id)
        
    // Update the todo task property using the index
    todos[index].task = value
    // Save the updated todo to localStorage
    localStorage.setItem('todos', JSON.stringify(todos))
}

function handleClearTodos() {
    // Reset the global todos value
    todos = []
    // Update the localStorage value
    localStorage.setItem('todos', JSON.stringify(todos))

    // Reset thd HTML, todo count and show the empty state 
    $todoBody.innerHTML = ''
    updateListCount()
    renderEmptyState()
}
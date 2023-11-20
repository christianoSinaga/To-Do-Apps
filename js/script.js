const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS'

document.addEventListener('DOMContentLoaded', function(){   
    document.getElementById('submit').addEventListener('click', function(event){
        event.preventDefault;
        addTodo();
    });

    document.addEventListener(RENDER_EVENT, function () {
      const uncompletedTODOList = document.getElementById('todos');
      uncompletedTODOList.innerHTML = '';
     
      const completedTODOList = document.getElementById('completed-todos');
      completedTODOList.innerHTML = '';

      for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted) {
          uncompletedTODOList.append(todoElement);
        } else {
          completedTODOList.append(todoElement);
        }
      }
    });
    
    document.addEventListener(SAVED_EVENT, function(){
      const savedEvent = localStorage.getItem(STORAGE_KEY);
      let events = JSON.parse(savedEvent);
      
      if(events !== null){
        for(const event of events){
          let task = "Nama Task : "+ event.task;
          let date = "Tanggal : "+ event.timestamp;
          let status = "Status : "+ event.isCompleted;
          console.log(`${getObject.satu} ${getObject.dua} ${getObject.tiga}`);
        }
      }
    });

    if(isStorageExist){
      loadDataFromStorage();
    }
});

//Menambah ToDo
function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;
   
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
function generateId() {
    return +new Date();
  }
   
  function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted
    }
  }

  function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;
   
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);
   
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);
   
    if(todoObject.isCompleted){
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');

      undoButton.addEventListener('click', function(){
        undoTaskFromCompleted(todoObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');

      trashButton.addEventListener('click', function(){
        removeTaskFromCompleted(todoObject.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');

      checkButton.addEventListener('click', function(){
        addTaskToCompleted(todoObject.id);
      });

      container.append(checkButton);
    }

    return container;
  }
  
function addTaskToCompleted(todoId){
  const todoTarget = findTodo(todoId);

  if(todoTarget==null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));  
  saveData();
}

function removeTaskFromCompleted(todoId){
  const todoTarget = findTodoIndex(todoId);
  
  if(todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId){
  const todoTarget = findTodo(todoId);

  if(todoTarget==null) return;

  todoTarget.isCompleted=false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//MENCARI TODO
function findTodo(todoId){
  for(const todoItem of todos){
    if(todoItem.id == todoId){
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId){
  for(const index in todos){
    if(todos[index].id === todoId){
      return index;
    }    
  }

  return -1;
}

//MENYIMPAN TODO DALAM WEB STORAGE
function isStorageExist(){
  if(typeof(Storage)===null){
    alert("Browser tidak mendukung web storage");
    return false;
  } else {
    return true;
  }
}

function saveData(){
  if(isStorageExist()){
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

//LOAD TODO DARI WEB STORAGE
function loadDataFromStorage(){
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if(data !== null){
    for(const todo of data){
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
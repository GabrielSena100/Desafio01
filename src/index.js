const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());


const users = [];

const errorUserAlreadyExistsJSON = {error: 'User already exists'};
const errorUserDoesntExistJSON = {error: "User doesn't exist"};
const errorTodoDoesntExist = {error: "To Do doesn't exist"};
/*
users[] = {
  id: uuid,
  name: ,
  username: ,
  todos: []
}
*/

/*
todos:[
  {
    id: uuid,
    title: ,
    done: ,
    deadline:,
    created_at: 
  }
]
*/

// middlewares
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  console.log(users);

  const user = users.find((user) => {
    return user.username === username;
  });

  //console.log(user);

  if(!user){
    return response.status(404).json(errorUserDoesntExistJSON)
  }

  request.user = user;

  return next();
}


//Methods
app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.find((user) => {
    return user.username === username;
  });

  if(userAlreadyExists){
    return response.status(400).json(errorUserAlreadyExistsJSON);
  }

  users.push({
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  });

  const user = users.find((user) => {
    return user.username === username;
  });

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { username } = request.headers;
  const { user } = request;

  //const user = users.find((user) => {
  //  if (user.username === username){
  //    return user;
  //  }
  //});

  console.log(user.todos);
  return response.status(200).send(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const { title, deadline } = request.body;
  const { username } = request.headers;
  const { user } = request;

  newTodo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    create_at: new Date()
  };

  //const user = users.find((user) => {
  //  return user.username === username;
  //});

  user.todos.push(newTodo);

  //const todoCreated = user.todos.find((todos) => {
  //  return todos.deadline === new Date(deadline).ToDateString();
  //});

  return response.status(201).send(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  
  const { title, deadline } = request.body;
  const { username } = request.headers;
  const { id }  = request.params;
  const { user } = request;

  const todoToChange = user.todos.find((todos) => {
    return todos.id === id;
  });

  if (todoToChange === undefined){
    return response.status(404).json(errorTodoDoesntExist);
  }

  const indexTodoToChange = user.todos.findIndex((todos) => {
    return todos.id === id;  
  });

  todoToChange.title = title;
  todoToChange.deadline = new Date(deadline);

  user.todos.splice(indexTodoToChange,1);

  user.todos.push(todoToChange);

  return response.status(201).json(todoToChange);


});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const { username } = request.headers;
  const { id }  = request.params;
  const { user } = request;

  const todoToChange = user.todos.find((todos) => {
    return todos.id === id;
  });

  if (todoToChange === undefined){
    return response.status(404).json(errorTodoDoesntExist);
  }

  const indexTodoToChange = user.todos.findIndex((todos) => {
    return todos.id === id;  
  });

  todoToChange.done = true;

  user.todos.splice(indexTodoToChange,1);
  user.todos.push(todoToChange);

  return response.status(201).json(todoToChange);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { username } = request.headers;
  const { id }  = request.params;
  const { user } = request;

  const indexTodoToDelete = user.todos.findIndex((todos) => {
    return todos.id === id;  
  });

  const todoToDelete = user.todos.find((todos) => {
    return todos.id === id;
  });

  if (todoToDelete === undefined){
    return response.status(404).json(errorTodoDoesntExist);
  }

  user.todos.splice(indexTodoToDelete, 1);

  return response.status(204).json(user.todos);

});

module.exports = app;
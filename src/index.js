const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());


const users = [];

const errorUserAlreadyExistsJSON = {error: 'User already exists'};
const errorUserDoesntExistJSON = {error: "User doesn't exist"};
/*
users[] = {
  id: uuid,
  name: ,
  username: ,
  todos: []
}
*/

// middlewares
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  console.log(users);

  const user = users.find((user) => {
    return user.username === username;
  });

  console.log(user);

  if(!user){
    return response.status(400).json(errorUserDoesntExistJSON)
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
    return response.status(401).json(errorUserAlreadyExistsJSON);
  }

  users.push({
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  });

  console.log(users);

  return response.status(201).json(users);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { username } = request.headers;

  const user = users.find((user) => {
    if (user.username === username){
      return user;
    }
  });
  console.log(user.todos);
  return response.status(200).send(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
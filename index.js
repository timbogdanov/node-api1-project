const express = require('express');
const shortid = require('shortid');

const server = express();
server.use(express.json());

let users = [
  {
    id: shortid.generate(),
    name: 'Timosha',
    bio: 'i like to do code',
  },
  {
    id: shortid.generate(),
    name: 'Markusha',
    bio: 'eto plohaya popa',
  },
  {
    id: shortid.generate(),
    name: 'Trampusha',
    bio: 'orange lives matter',
  },
];

// handle request to the root of the api '/'
server.get('/', (req, res) => {
  res.send('hello from express');
});

// POST: creat e a user using the information sent inside the req.body
server.post('/api/users', (req, res) => {
  try {
    const user = req.body;
    if (user.name && user.bio) {
      user.id = shortid.generate();
      users.push(user);
      res.status(201).json(users);
    } else {
      res.status(400).json({
        message: `Please provide name and bio for the user.`,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: `There was an error while saving the user to the database: ${error}`,
    });
  }
});

// GET: return an array of users
server.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// GET: return a user object with a specified id
server.get('/api/users/:id', (req, res) => {
  try {
    const id = req.params.id;
    let user = users.find((user) => user.id === id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: `The user with the specified ID does not exist.`,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: `There was an error while saving the user to the database: ${error}`,
    });
  }
});

// DELETE: removes the user with a speified id and returns the deleted user object
server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id.toLocaleLowerCase();

  users = users.filter((user) => user.id.toLocaleLowerCase() !== id);

  res.status(204).end();
});

// PUT: update the user with a specified id using data from the request body. Returns the modified user
server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  let found = users.find((user) => user.id === id);

  console.log(found);

  if (found) {
    Object.assign(found, changes);

    res.status(200).json(users);
  } else {
    res
      .status(404)
      .json({ message: `There is no account with id ${id}` });
  }
});

// Watch for connections on port 8000
const port = 8000;
server.listen(port, () => {
  console.log(`server is running at port ${port}`);
});

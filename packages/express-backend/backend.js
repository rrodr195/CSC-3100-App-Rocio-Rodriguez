// backend.js

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

import cors from "cors";
import express from "express";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});



const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const findUserByNameAndJob = (name, job) => {
  return findUserByName(name).filter((user) => user["job"] === job);
}


app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; 
  let result = findUserById(id)

  if(result === undefined) {
    res.status(404).send("Resources not found"); 
  } else {
      users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
      res.status(204).send();
  }
});

function generateId() {
  return Math.floor(Math.random() * 101000000).toString();
}

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateId();
  addUser(userToAdd);
  res.status(201).send(userToAdd);
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job; 

  if(name != undefined && job != undefined) {
     let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



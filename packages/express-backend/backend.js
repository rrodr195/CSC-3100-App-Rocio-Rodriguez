// backend.js


import cors from "cors";
import express from "express";

import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "./services/user-services.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));


/* const users = {
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
}; */

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});



/* const findUserByName = (name) => {
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
} */


app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id

  userService
	.findUserById(id)
	.then((result) => {
	  if (!result) {
            res.status(404).send("Resource not found.");
	  } else {
	      res.send(result);
	  }
	}) 
	.catch((error) => res.status(500).send(error));
	
});


app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; 
 
    userService
	.removeUser(id)
	.then((result) => {
	  if(!result) {
            res.status(404).send("Resources not found"); 
          } else {
               res.status(204).send();
	    }
	})
	.catch((error) => res.status(500).send(error));
});



app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
	.addUser(userToAdd)
	.then((newUser) => {
          res.status(201).send(newUser);
	})
	.catch((error) => res.status(500).send(error));
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job; 

  userService 
	.getUsers(name, job)
	.then((result) => {
    	  res.send({users_list: result});
  	})
	.catch((error) => res.status(500).send(error));
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



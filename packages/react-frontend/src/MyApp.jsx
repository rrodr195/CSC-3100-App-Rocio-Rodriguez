// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function updateList(person) {
    postUser(person)
      .then((newUser) => {
        setCharacters([...characters, newUser]);
      })
      .catch((error) => console.log(error));
  }

  function removeOneCharacter(id) {
    deleteUser(id)
      .then(() => {
        const updated = characters.filter(
          (character) => character.id !== id
        );
        setCharacters(updated);
      })
      .catch((error) => console.log(error));
  }

  function fetchUsers() {
    return fetch("http://localhost:8000/users");
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => console.log(error));
  }, []);

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    }).then((res) => {
      if (res.status === 201) {
        return res.json();
      } else {
        throw new Error("Failed to create user");
      }
    });
  }

  function deleteUser(id) {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 204) {
        return;
      } else if (res.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error("Failed to delete user");
      }
    });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;

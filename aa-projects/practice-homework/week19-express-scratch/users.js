const express = require("express");

const app = express();

const users = {};
let nextId = 1;
const sampleNames = ["jon", "Mikey", "Ron", "joey"];

app.get("/users", (req, res) => {
    res.send(users);
})

app.post("/users", (req, res) => {
    const newUser = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    users[nextId] = {
        id: nextId,
        name: newUser
    };
    nextId++;
    res.send({
        status: "Success",
        message: `New user ${newUser} added with an ID of ${nextId - 1}`
    });
});

app.delete("/users/:id", (req, res) => {
    const deletedUser = users[req.params.id];
    if (deletedUser) {
        delete users[req.params.id];
        res.send({
            status: "Success",
            message: `Successfully deleted ${deletedUser.id}, name: ${deletedUser.name}`
        })
    } else {
        res.status(404).send({
            status: "failure",
            message: `User ID ${req.params.id} not found.`
        })
    }
})

const port = 5000;

app.listen(port, () => console.log(`Server is listening on port: ${port}.`))

const express = require('express');

const app = express();

    // Below are two different route handlers that send the same
    // response to the client using two different route methods

// app.get("/welcome", (req, res) => {
//     res.send("Welcome to the app!");
// });

// app.get("/hello", (req, res) => {
//     res.send("Welcome to the app!");
// })

    // Below is an example of creating a route handler
    // that sends the same response to whichever endpoint
    // the client is trying to access or "GET"

app.get(["/welcome", "/hello"], (req, res) => {
    res.send("welcome to the app!");
})

    // Below is an example of handling a wildcard endpoint and how
    // to respond if the page does not exist however the "*" includes
    // any and all endpoints so the order and location in code where
    // this handler is written is important so it does not interfere
    // with the handlers above

    app.get("*", (req, res) => {
        res.status(404).send("That page wasn\'t found. Try a different path.")
    })

const port = 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}.`))

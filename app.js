const express = require("express");

const app = express();

//this is a get request
//req is request. res is respond
app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>")

});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
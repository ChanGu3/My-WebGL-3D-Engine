const express = require("express");
const app = express();
const domain = "localhost";
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
})

app.listen(port, () => {
    console.log("Server started on port " + `http://${domain}:${port}/`);
})

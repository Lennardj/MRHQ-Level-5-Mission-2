// Module imports
const express = require("express");
require("dotenv").config();
const cors = require("cors");
//Enable Express
const app = express();
//Middlewares
app.use(cors());
app.use(express.json());
const data = {};
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});
app.post("/image", (req, res) => {
  console.log(req.body);
});

const PORT = 4000;
// error value is the first value of this callback function
app.listen(PORT, function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log(`Listening on http://localhost:${PORT}`);
  }
});

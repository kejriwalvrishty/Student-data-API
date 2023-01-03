const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const path = require("path");
// const session = require("express-session");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const router = require("./Routes");
app.use(router);

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});

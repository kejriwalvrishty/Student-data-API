const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@1234",
  database: "test",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Mysql Connected with App...");
});

router.get("/", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

router.post("/auth", function (req, res) {
  let username = req.body.Username;
  let password = req.body.Password;
  // let role = req.body.Role;
  if (username && password) {
    conn.query(
      "SELECT * FROM admin WHERE Username = ? AND Password = ?",
      [username, password],
      (err, results, fields) => {
        if (err) throw err;
        if (results.length > 0) {
          let jwtSecretKey = process.env.JWT_SECRET_KEY;
          console.log(results[0].Role);
          let data = { role: results[0].Role };
          const token = jwt.sign(data, jwtSecretKey);

          //   res.send(token);
          // req.session.loggedin = true;
          // req.session.username = username;
          // res.redirect(`/main?token=${token}`);
          res.redirect(`/main/${token}`);
        } else {
          res.send("Incorrect Username and/or Password!");
        }
        res.end();
      }
    );
  } else {
    res.send("Please enter Username and Password!");
    res.end();
  }
});

function validateToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    if (err) throw err;
    return decoded;
  });
}

router.get("/main/:token", function (request, response) {
  //  console.log(request.params);
  console.log("token:", request.params.token);
  if (
    validateToken(request.params.token).role == "prim_admin" ||
    validateToken(request.params.token).role == "sec_admin"
  ) {
    response.sendFile(__dirname + "/dashboardA.html");
  } else {
    response.sendFile(__dirname + "/dashboardU.html");
  }
  // response.end();
});

// router.get("/api/student/primary", (req, res) => {
//   let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
//   console.log(req.header(tokenHeaderKey));
//   if (
//     req.header(tokenHeaderKey) != undefined &&
//     (validateToken(req.header(tokenHeaderKey)).role == "prim_admin" ||
//       validateToken(req.header(tokenHeaderKey)).role == "user" ||
//       validateToken(req.header(tokenHeaderKey)).role == "sec_admin")
//   ) {
//     let sqlQuery = "SELECT * FROM student WHERE Soft_delete=0";

//     let query = conn.query(sqlQuery, (err, results) => {
//       if (err) throw err;
//       res.send(JSON.parse(apiResponse(results)).response);
//     });
//   } else {
//     res.send("Invalid role or token!!");
//   }
// });

router.get("/api/student", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  // console.log(req.header(tokenHeaderKey));
  if (
    req.header(tokenHeaderKey) != undefined &&
    (validateToken(req.header(tokenHeaderKey)).role == "prim_admin" ||
      validateToken(req.header(tokenHeaderKey)).role == "user" ||
      validateToken(req.header(tokenHeaderKey)).role == "sec_admin")
  ) {
    let sqlQuery = "SELECT * FROM student WHERE Soft_delete=0";

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(JSON.parse(apiResponse(results)).response);
    });
  } else {
    res.send("Invalid role or token!!");
  }
});

router.get("/api/student/:ID", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  // console.log(req.header(tokenHeaderKey));
  if (
    req.header(tokenHeaderKey) != undefined &&
    (validateToken(req.header(tokenHeaderKey)).role == "prim_admin" ||
      validateToken(req.header(tokenHeaderKey)).role == "user" ||
      validateToken(req.header(tokenHeaderKey)).role == "sec_admin")
  ) {
    let sqlQuery =
      "SELECT * FROM student WHERE Soft_delete=0 AND id=" + req.params.ID;
    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(JSON.parse(apiResponse(results)).response);
    });
  } else {
    res.send("Invalid role or token!!");
  }
});

router.get("/api/student/class/:Class", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  // console.log(req.header(tokenHeaderKey));
  if (
    req.header(tokenHeaderKey) != undefined &&
    (validateToken(req.header(tokenHeaderKey)).role == "prim_admin" ||
      validateToken(req.header(tokenHeaderKey)).role == "user" ||
      validateToken(req.header(tokenHeaderKey)).role == "sec_admin")
  ) {
    let sqlQuery =
      "SELECT * FROM student WHERE Soft_delete=0 AND Class=" + req.params.Class;

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(JSON.parse(apiResponse(results)).response);
    });
  } else {
    res.send("Invalid role or token!!");
  }
});

router.get("/api/student/section/:Section", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  // console.log(req.header(tokenHeaderKey));
  if (
    req.header(tokenHeaderKey) != undefined &&
    (validateToken(req.header(tokenHeaderKey)).role == "prim_admin" ||
      validateToken(req.header(tokenHeaderKey)).role == "user" ||
      validateToken(req.header(tokenHeaderKey)).role == "sec_admin")
  ) {
    let sqlQuery =
      "SELECT * FROM student WHERE Soft_delete=0 AND Section='" +
      req.params.Section +
      "'";

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(JSON.parse(apiResponse(results)).response);
    });
  } else {
    res.send("Invalid role or token!!");
  }
});

router.get("/api/student/fee/:Fee_status", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  // console.log(req.header(tokenHeaderKey));
  if (
    (req.header(tokenHeaderKey) != undefined &&
      validateToken(req.header(tokenHeaderKey)).role == "admin") ||
    validateToken(req.header(tokenHeaderKey)).role == "user"
  ) {
    let sqlQuery =
      "SELECT S.ID, S.Name, S.Class, S.DOB, A.Amount, A.Fee_status FROM student S, accounts A WHERE S.ID=A.ID AND S.Soft_delete=0 AND A.Fee_status=" +
      '"' +
      req.params.Fee_status +
      '"';

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(apiResponse(results));
    });
  } else {
    res.send("Invalid role or token!!");
  }
});

router.post("/api/student", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  // console.log(req.header(tokenHeaderKey));
  if (
    (req.header(tokenHeaderKey) != undefined &&
      validateToken(req.header(tokenHeaderKey)).role == "prim_admin") ||
    validateToken(req.header(tokenHeaderKey)).role == "sec_admin"
  ) {
    let data = {
      Name: req.body.Name,
      Class: req.body.Class,
      Section: req.body.Section,
      DOB: req.body.DOB,
    };
    console.log(data);
    let sqlQuery = "INSERT INTO student SET ?";

    let query = conn.query(sqlQuery, data, (err, results) => {
      if (err) throw err;
      res.send(apiResponse(data));
    });
  } else {
    res.send("Invalid role or token!!");
  }
});

router.put("/api/student/:ID", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  // console.log(req.header(tokenHeaderKey));
  if (
    (req.header(tokenHeaderKey) != undefined &&
      validateToken(req.header(tokenHeaderKey)).role == "prim_admin") ||
    validateToken(req.header(tokenHeaderKey)).role == "sec_admin"
  ) {
    let sqlQuery =
      "UPDATE student SET Name='" +
      req.body.Name +
      "', Class=" +
      req.body.Class +
      ", Section='" +
      req.body.Section +
      "', DOB='" +
      req.body.DOB +
      "' WHERE id=" +
      req.params.ID;

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(apiResponse(results));
    });
  } else {
    res.send("Invalid role or token!!");
  }
});

router.delete("/api/student/:ID", (req, res) => {
  console.log("Deleting", req.params.ID);
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  // console.log("Token header: ", req.header(tokenHeaderKey));
  if (
    (req.header(tokenHeaderKey) != undefined &&
      validateToken(req.header(tokenHeaderKey)).role == "prim_admin") ||
    validateToken(req.header(tokenHeaderKey)).role == "sec_admin"
  ) {
    let sqlQuery = "UPDATE student SET Soft_delete=1 WHERE id=" + req.params.ID;

    let query = conn.query(sqlQuery, (err, results) => {
      if (err) throw err;
      res.send(JSON.parse(apiResponse(results)).response);
    });
  } else {
    res.send("Invalid role or token!!");
  }
});

function apiResponse(results) {
  return JSON.stringify({
    status: 200,
    error: null,
    response: results,
  });
}

module.exports = router;

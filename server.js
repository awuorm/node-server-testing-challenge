const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const db = require("./data/userModels");
const jwt = require("jsonwebtoken");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
    res.status(200).json("Hallo from testing server!");
  });
server.post("/register", handleRegistration);
server.post("/login", handleLogin);

server.get("/users", handleAllUsersGet);
server.get("/users/:id", handleUsersGetById);

function handleUsersGetById(req, res) {
  db.findById(req.params.id, req.decodedToken.roles)
    .then(data => {
      if (data === undefined) {
        res.status(404).json({ errorMessaga: "Please provide a valid ID!" });
      } else {
        res.status(200).json(data);
        console.table(data);
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error });
    });
}

function handleAllUsersGet(req, res) {
  db.find(req.decodedToken.roles)
    .then(data => {
      res.status(200).json(data);
      console.table(data);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error });
    });
}

function handleLogin(req, res) {
  const { username, password } = req.body;
  db.findBy(username)
    .then(data => {
      if (data && bcrypt.compareSync(password, data.password)) {
        const token = generateToken(data);
        console.log(token);
        res
          .status(200)
          .json({ message: `Welcome ${data.username}`, token: token });
        console.table(data);
      } else {
        res
          .status(401)
          .json({ errorMessage: "Please provide valid credentials" });
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error });
    });
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    roles: user.department
  };

  const options = {
    expiresIn: "1d"
  };

  const result = jwt.sign(payload, process.env.SECRET, options);

  return result;
}

function handleRegistration(req, res) {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password);
  user.password = hash;
  db.add(user)
    .then(data => {
      res.status(201).json({ created: "User created" });
      console.table(data);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: error.message });
      console.log(error);
    });
}

module.exports = server;

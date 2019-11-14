const db = require("./db-config");

module.exports = {
  add,
  find,
  findById,
  findBy
};

function findBy(username) {
  return db("users")
    .where({ username })
    .first();
}

function add(user) {
  return db("users")
    .insert(user)
    .then(ids => findById(ids[0]));
}

function find() {
  return db("users");
}

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}

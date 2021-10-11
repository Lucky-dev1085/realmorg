var db = connect("mongodb://root:Punjab484@localhost:27017/admin");

db = db.getSiblingDB('rets_db'); // we can not use "use" statement here to switch db

db.createUser(
  {
    user: "alvaro",
    pwd: "alvaro",
    roles: [ { role: "readWrite", db: "rets_db"} ],
    passwordDigestor: "server",
  }
)
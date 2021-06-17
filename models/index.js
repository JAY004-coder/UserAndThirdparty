var db = {};

db.mongoose = require("./connection");
db.users =  require("./users");
db.user_role =  require("./user_role");

module.exports = db
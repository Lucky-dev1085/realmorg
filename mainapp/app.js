const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const Role = db.role;

let dbConfig = require('./config/db.config');

let conMsg = "message";

// Connecting mongoDB Database
db.mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database sucessfully connected!');
  conMsg = 'Database sucessfully connected!';
})
.catch(err => {
  console.error("Connection error", err);
  conMsg = "Connection error" + err;
  process.exit();
});

const app = express();

var corsOptions = {
  // origin: dbConfig.corsOptions
  origin: '*'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to real estate application." });
});

// checkDB
app.get("/checkDB", (req, res) => {
  res.json({ message: conMsg });
});

// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/property.routes')(app);
require('./routes/basicLookup.routes')(app);
require('./routes/leads.routes')(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));


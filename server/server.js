require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const db = require("./db");
const pgSession = require("connect-pg-simple")(session);
const cors = require("cors");
const routes = require("./routes");

require("./config/passport");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(
  session({
    store: new pgSession({
      pool: db,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

// Passport Authentication

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//   console.log(req.session); // created by express session
//   console.log(req.user); // created by passport middleware
//   next();
// });

// Routes

app.use(routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

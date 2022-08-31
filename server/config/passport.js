const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../db");
const bcrypt = require("bcrypt");

const verifyCallback = async (email, password, done) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return done(null, false);
    }

    const verifyPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (verifyPassword) {
      return done(null, user.rows[0]);
    } else {
      return done(null, false);
    }
  } catch (err) {
    done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  db.query("SELECT * FROM users WHERE id = $1", [userId])
    .then((user) => {
      done(null, user.rows[0]);
    })
    .catch((err) => done(err));
});

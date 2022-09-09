const router = require("express").Router();
const passport = require("passport");
const db = require("../db");
const bcrypt = require("bcrypt");
const { isAuth, isAdmin } = require("./authMiddleware");

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.post("/register", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    const lowerCaseEmail = email.toLowerCase();

    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      lowerCaseEmail,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      "INSERT INTO users (first_name, last_name, email, password, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [firstName, lastName, lowerCaseEmail, bcryptPassword, phoneNumber]
    );

    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

router.get("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json("Not authenticated");
  }
});

router.get("/categories", async (req, res, next) => {
  try {
    const categories = await db.query("SELECT * FROM categories");

    if (categories.rows.length === 0) res.json(false);
    else res.json(categories.rows);
  } catch (err) {
    console.error(err.message);
    res.json(false);
  }
});

router.get("/shops", async (req, res, next) => {
  try {
    const shops = await db.query("SELECT * FROM shops");

    if (shops.rows.length === 0) res.json(false);
    else res.json(shops.rows);
  } catch (err) {
    console.error(err.message);
    res.json(false);
  }
});

router.get("/shops/:categoryId", async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const query = await db.query("SELECT * FROM shops WHERE category = $1", [
      categoryId,
    ]);

    if (query.rows.length === 0) res.json([]);
    else res.json(query.rows);
  } catch (error) {
    console.log(error.message);
    res.json(false);
  }
});

router.get("/userShops", async (req, res) => {
  try {
    const query = await db.query("SELECT * FROM shops WHERE owner_id = $1", [
      req.user.id,
    ]);

    if (query.rows.length === 0) res.json(false);
    else res.json(query.rows);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/createShop", async (req, res) => {
  try {
    const {
      area,
      block,
      building,
      category,
      cr,
      description,
      email,
      latitude,
      longitude,
      phoneNumber,
      road,
      shopName,
      owner,
      logo,
      cover,
      status,
    } = req.body;

    const address = {
      area,
      road,
      block,
      building,
      longitude,
      latitude,
    };

    const query = await db.query(
      "INSERT INTO shops (address, category, cr, description, email, phone, name, owner_id, logo, cover, status, delivery, subcategories ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;",
      [
        address,
        category,
        cr,
        description,
        email,
        phoneNumber,
        shopName,
        owner,
        logo,
        cover,
        status,
        true,
        ["TEST"],
      ]
    );

    if (query.rows.length === 0) res.json(false);
    else res.json(true);
  } catch (err) {
    console.log(err.message);
    res.json(false);
  }
});

router.post("/editUserInfo", async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    const result = await db.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4 WHERE id = $5 RETURNING *;",
      [firstName, lastName, email, phoneNumber * 1, req.user.id]
    );

    req.user = result.rows[0];

    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.json(false);
  }
});

router.get("/addresses", async (req, res, next) => {
  try {
    const addresses = await db.query(
      "SELECT address FROM users WHERE id = $1;",
      [req.user.id]
    );

    if (addresses.rows.length === 0) res.json(false);
    else res.json(addresses.rows[0].address);
  } catch (err) {
    console.error(err.message);
    res.json(false);
  }
});

router.put("/updateAddress", async (req, res, next) => {
  try {
    const { name, area, road, block, building, flat, location, index } =
      req.body;

    const newAddress = {
      name,
      area,
      road,
      block,
      building,
      flat,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const addresses = await db.query(
      "SELECT address FROM users WHERE id = $1;",
      [req.user.id]
    );

    addresses.rows[0].address[index] = newAddress;

    const updatedAddress = await db.query(
      "UPDATE users SET address = $1 WHERE id = $2 RETURNING *;",
      [addresses.rows[0].address, req.user.id]
    );

    req.user = updatedAddress.rows[0];

    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.json(false);
  }
});

router.post("/addAddress", async (req, res, next) => {
  try {
    const { name, area, road, block, building, flat, longitude, latitude } =
      req.body;

    const newAddress = {
      name,
      area: area,
      road: road * 1,
      block: block * 1,
      building: building * 1,
      flat,
      latitude,
      longitude,
    };

    const addresses = await db.query(
      "SELECT address FROM users WHERE id = $1;",
      [req.user.id]
    );

    if (addresses.rows[0].address === null) {
      addresses.rows[0].address = [newAddress];
    } else {
      addresses.rows[0].address.push(newAddress);
    }

    const updatedAddress = await db.query(
      "UPDATE users SET address = $1 WHERE id = $2 RETURNING *;",
      [addresses.rows[0].address, req.user.id]
    );

    req.user = updatedAddress.rows[0];

    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.json(false);
  }
});

router.put("/deleteAddress", async (req, res) => {
  try {
    console.log(req.user);
    const { id } = req.body;

    const addresses = await db.query(
      "SELECT address FROM users WHERE id = $1;",
      [req.user.id]
    );

    if (addresses.rows[0].address.length === 0) res.json(false);

    addresses.rows[0].address.splice(id, 1);

    const updatedAddress = await db.query(
      "UPDATE users SET address = $1 WHERE id = $2 RETURNING *;",
      [addresses.rows[0].address, req.user.id]
    );

    req.user = updatedAddress.rows[0];

    res.json(req.user);
  } catch (err) {
    console.log(err.message);
  }
});

router.put("/changePassword", async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const valid = await bcrypt.compare(password, req.user.password);

    if (!valid) {
      res.json("Wrong Password");
    } else {
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(newPassword, salt);

      const updatedUser = await db.query(
        "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
        [bcryptPassword, req.user.id]
      );

      req.user = updatedUser.rows[0];
      res.json(true);
    }
  } catch (err) {
    console.error(err.message);
    res.json(false);
  }
});

router.get("/products/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;
    const query = await db.query("SELECT * FROM products WHERE shop_id = $1;", [
      shopId,
    ]);

    if (query.rows.length === 0) res.json(false);
    else res.json(query.rows);
  } catch (e) {
    console.log(e.message);
  }
});

// router.get("/protected-route", isAuth, (req, res, next) => {
//   res.send("You made it to the route");
// });

// router.get("/admin-route", isAdmin, (req, res, next) => {
//   res.send("You made it to the admin route");
// });

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json(true);
  });
});

router.get("/is-authenticated", async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const user = await db.query("SELECT * FROM users WHERE id = $1;", [
        req.user.id,
      ]);

      if (user.rows.length === 0) {
        res.json(false);
      }

      res.json(user.rows[0]);
    } catch (err) {
      console.error(err);
    }
  } else {
    res.json(false);
  }
});

router.get("/login-success", (req, res, next) => {
  res.json(req.user);
});

router.get("/login-failure", (req, res, next) => {
  res.json(false);
});

module.exports = router;

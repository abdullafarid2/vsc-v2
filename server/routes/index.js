const router = require("express").Router();
const passport = require("passport");
const db = require("../db");
const bcrypt = require("bcrypt");
const { isAuth, isAdmin } = require("./authMiddleware");
const { pool } = require("../db");
const { promise } = require("bcrypt/promises");

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

router.get("/users", async (req, res) => {
  try {
    const query = await db.query("SELECT * FROM users");

    if (query.rows.length === 0) return res.json([]);

    res.json(query.rows);
  } catch (err) {
    console.log(err.message);
    res.json([]);
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const query = await db.query(
      "SELECT id, first_name, last_name, phone_number FROM users WHERE id = $1;",
      [userId]
    );

    if (query.rows.length === 0) return res.json({});

    res.json(query.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.json({});
  }
});

router.get("/categories", async (req, res, next) => {
  try {
    const categories = await db.query("SELECT * FROM categories");

    if (categories.rows.length === 0) return res.json(false);
    else res.json(categories.rows);
  } catch (err) {
    console.error(err.message);
    res.json(false);
  }
});

router.get("/shops", async (req, res, next) => {
  try {
    const shops = await db.query(
      "SELECT shops.*, categories.name as category_name FROM shops INNER JOIN categories ON shops.category = categories.id;"
    );

    if (shops.rows.length === 0) return res.json(false);
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

    if (query.rows.length === 0) return res.json([]);
    else res.json(query.rows);
  } catch (error) {
    console.log(error.message);
    res.json(false);
  }
});

router.get("/shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;
    const query = await db.query("SELECT * FROM shops WHERE id = $1;", [
      shopId,
    ]);

    if (query.rows.length === 0) return res.json(false);

    res.json(query.rows[0]);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/userShops", async (req, res) => {
  try {
    const query = await db.query("SELECT * FROM shops WHERE owner_id = $1", [
      req.user.id,
    ]);

    if (query.rows.length === 0) return res.json(false);
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
      "INSERT INTO shops (address, category, cr, description, email, phone, name, owner_id, logo, status ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;",
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
        status,
      ]
    );

    if (query.rows.length === 0) return res.json(false);
    else res.json(query.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.json(false);
  }
});

router.put("/updateShop", async (req, res) => {
  try {
    const { shopId, name, email, phone, description, category, logo } =
      req.body;

    const updatedShop = await db.query(
      "UPDATE shops SET name = $1, email = $2, phone = $3, description = $4, category = $5, logo = $6 WHERE id = $7 RETURNING *",
      [name, email, phone, description, category, logo, shopId]
    );

    if (updatedShop.rows.length === 0) return res.json(false);
    else res.json(true);
  } catch (e) {
    console.log(e.message);
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

    if (addresses.rows.length === 0) return res.json(false);
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
    else {
      addresses.rows[0].address.splice(id, 1);

      const updatedAddress = await db.query(
        "UPDATE users SET address = $1 WHERE id = $2 RETURNING *;",
        [addresses.rows[0].address, req.user.id]
      );

      req.user = updatedAddress.rows[0];

      res.json(req.user);
    }
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/newProduct", async (req, res) => {
  try {
    const { name, description, category, sizes, photo, shopId } = req.body;

    const q = await db.query(
      "INSERT INTO products (shop_id, name, category, description, photo) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [shopId, name, category, description, photo]
    );

    if (q.rows.length === 0) return res.status(500).json(false);

    sizes.forEach(async (s) => {
      const q2 = await db.query(
        "INSERT INTO inventory (pid, price, quantity, size) VALUES ($1, $2, $3, $4)",
        [q.rows[0].id, s.price, s.quantity, s.size]
      );
    });

    const q3 = await db.query(
      "SELECT * FROM products FULL JOIN inventory ON products.id = inventory.pid WHERE products.shop_id = $1;",
      [shopId]
    );

    if (q3.rows.length === 0) return res.json(false);
    else res.json(q3.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/productCategories/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    const q = await db.query(
      "SELECT * FROM productcategories WHERE shop_id = $1",
      [shopId]
    );

    if (q.rows.length === 0) return res.json([]);
    else res.json(q.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.post("/newProductCategory", async (req, res) => {
  try {
    const { newCategory, shopId } = req.body;

    const q = await db.query(
      "INSERT INTO productcategories (shop_id, name) VALUES ($1, $2) RETURNING *",
      [shopId, newCategory]
    );

    if (q.rows.length === 0) return res.json(false);
    else res.json(q.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
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

    const q = await db.query(
      "SELECT * FROM products WHERE shop_id = $1 AND deleted IS NOT TRUE ORDER BY id ASC;",
      [shopId]
    );

    if (q.rows.length === 0) return res.status(500).json(false);

    const query = await db.query(
      "SELECT * FROM products FULL JOIN inventory ON products.id = inventory.pid WHERE products.shop_id = $1 AND products.deleted IS NOT TRUE ORDER BY inventory.id ASC;",
      [shopId]
    );

    if (query.rows.length === 0) return res.status(500).json(false);

    let products = [];

    q.rows.map((product) => {
      products.push({
        ...product,
        sizes: query.rows.filter((s) => s.pid === product.id),
      });
    });

    res.json(products);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await db.query(
      "SELECT * FROM products WHERE id = $1 AND deleted IS NOT TRUE",
      [productId]
    );

    if (product.rows.length === 0) return res.json(null);

    const inventory = await db.query(
      "SELECT * FROM inventory WHERE pid = $1 ORDER BY id ASC",
      [productId]
    );

    product.rows[0].sizes = inventory.rows;

    res.json(product.rows);
  } catch (e) {
    console.log(e.message);
    res.json(null);
  }
});

router.put("/product", async (req, res) => {
  try {
    const { product } = req.body;

    const updateProduct = await db.query(
      "UPDATE products SET name = $1, description = $2, photo = $3 WHERE id = $4 RETURNING *",
      [product.name, product.description, product.photo, product.id]
    );

    let sizes = [];

    await Promise.all(
      product.sizes.map(async (size) => {
        const updateInventory = await db.query(
          "UPDATE inventory SET price = $1, quantity = $2 WHERE id = $3 RETURNING *;",
          [size.price, size.quantity, size.id]
        );

        sizes.push(updateInventory.rows[0]);
      })
    );

    const newProduct = {
      ...updateProduct.rows[0],
      sizes,
    };

    res.json(newProduct);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.put("/product/delete", async (req, res) => {
  try {
    const { productId } = req.body;

    console.log(productId);

    const product = await db.query(
      "UPDATE products SET deleted = true WHERE id = $1 RETURNING *;",
      [productId]
    );

    if (product.rows.length === 0) return res.json(false);

    res.json(true);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/offers/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    const date = new Date();

    const offers = await db.query(
      "SELECT * FROM offers WHERE sid = $1 AND start_date < $2 AND end_date > $2;",
      [shopId, date]
    );

    res.json(offers.rows);
  } catch (e) {
    console.log(e.message);
    res.json([]);
  }
});

router.get("/offers/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const date = new Date();

    const offers = await db.query(
      "SELECT * FROM offers WHERE pid = $1 AND start_date < $2 AND end_date > $2;",
      [productId, date]
    );

    if (offers.rows.length === 0) return res.json(null);
    else return res.json(offers.rows[0]);
  } catch (e) {
    console.log(e.message);
    res.json([]);
  }
});

router.post("/offer/add", async (req, res) => {
  try {
    const { shopId, productId, discount_value, startDate, endDate } = req.body;

    const offer = await db.query(
      "INSERT INTO offers (sid, pid, discount_value, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [shopId, productId, discount_value, startDate, endDate]
    );

    if (offer.rows.length === 0) return res.json(false);
    else return res.json(true);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.post("/offer/delete", async (req, res) => {
  try {
    const { date, offerId } = req.body;

    const offer = await db.query(
      "UPDATE offers SET end_date = $1 WHERE id = $2 RETURNING *;",
      [date, offerId]
    );

    if (offer.rows.length === 0) return res.json(false);

    res.json(true);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await db.query("SELECT * FROM cart WHERE uid = $1", [userId]);

    if (cart.rows.length === 0) return res.json([]);
    else res.json(cart.rows);
  } catch (e) {
    console.log(e.message);
    res.json([]);
  }
});

router.get("/cartItems/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await db.query("SELECT * FROM cart WHERE uid = $1", [userId]);

    if (cart.rows.length === 0) return res.json([]);
    else {
      let cartItems = [];
      await Promise.all(
        cart.rows.map(async (c) => {
          try {
            const iid = c.iid;
            const shopId = c.sid;

            const product = await db.query(
              "SELECT * FROM products FULL JOIN inventory ON products.id = inventory.pid WHERE inventory.id = $1 AND products.shop_id = $2;",
              [iid, shopId]
            );

            const date = new Date();

            const offer = await db.query(
              "SELECT * FROM offers WHERE pid = $1 AND start_date < $2 AND end_date > $2",
              [c.pid, date]
            );

            offer.rows.length === 1
              ? cartItems.push({
                  ...product.rows[0],
                  discount_value: offer.rows[0].discount_value,
                  valid_until: offer.rows[0].end_date,
                  quantity: c.quantity,
                  cartId: c.id,
                  note: c.note,
                })
              : cartItems.push({
                  ...product.rows[0],
                  discount_value: null,
                  valid_until: null,
                  quantity: c.quantity,
                  cartId: c.id,
                  note: c.note,
                });
          } catch (e) {
            console.log(e.message);
          }
        })
      );

      return res.json(cartItems);
    }
  } catch (e) {
    console.log(e.message);
    res.json([]);
  }
});

router.post("/addToCart", async (req, res) => {
  try {
    const { userId, product, size, quantity, note } = req.body;

    const query = await db.query(
      "SELECT * FROM cart WHERE pid = $1 AND iid = $2 AND note = $3;",
      [product.id, size.id, note]
    );

    if (query.rows.length === 1 && note === query.rows[0].note) {
      const newQuantity = query.rows[0].quantity + quantity;
      const q = await db.query(
        "UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *;",
        [newQuantity, query.rows[0].id]
      );

      const cart = await db.query("SELECT * FROM cart WHERE uid = $1", [
        userId,
      ]);

      if (cart.rows.length === 0) return res.json([]);
      else res.json(cart.rows);
    } else {
      const q = await db.query(
        "INSERT INTO cart (uid, sid, pid, iid, quantity, note) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
        [userId, product.shop_id, product.id, size.id, quantity, note]
      );

      const cart = await db.query("SELECT * FROM cart WHERE uid = $1", [
        userId,
      ]);

      if (cart.rows.length === 0) return res.json([]);
      else res.json(cart.rows);
    }
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.put("/updateQuantity", async (req, res) => {
  try {
    const { cartId, q } = req.body;

    const cartItem = await db.query("SELECT * FROM cart WHERE id = $1;", [
      cartId,
    ]);

    const newQuantity = cartItem.rows[0].quantity + q;

    if (newQuantity <= 0) {
      const deletedItem = await db.query(
        "DELETE FROM cart WHERE id = $1 RETURNING *;",
        [cartId]
      );

      return res.json({ cartItem: cartItem.rows[0], updatedItem: null });
    } else {
      const updatedItem = await db.query(
        "UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *;",
        [newQuantity, cartId]
      );

      return res.json({
        cartItem: cartItem.rows[0],
        updatedItem: updatedItem.rows[0],
      });
    }
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.delete("/clearCart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const q = await db.query("DELETE FROM cart WHERE uid = $1 RETURNING *;", [
      userId,
    ]);

    if (q.rows.length === 0) return res.json(false);
    else return res.json(true);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.post("/placeOrder", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { userId, cart, address, total, date } = req.body;

    let shops = [];
    let orders = [];

    cart.map((c) => {
      if (shops.indexOf(c.sid) === -1) {
        shops.push(c.sid);
      }
    });

    const inventory = await client.query("SELECT * FROM inventory");

    await Promise.all(
      shops.map(async (shopId) => {
        const newOrder = await client.query(
          "INSERT INTO orders (uid, sid, address, total, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
          [userId, shopId, address, total, date, "Pending"]
        );

        orders.push(newOrder.rows[0].id);

        const items = cart.filter((c) => c.sid === shopId);

        items.map(async (item) => {
          const inv = inventory.rows.filter((i) => item.iid === i.id);
          const newQuantity = inv[0].quantity - item.quantity;

          const date = new Date();
          const offer = await client.query(
            "SELECT * FROM offers WHERE pid = $1 AND start_date < $2 AND end_date > $2",
            [item.pid, date]
          );

          if (newQuantity < 0) {
            throw Error(item.id);
          } else {
            if (offer.rows.length === 1) {
              await client.query(
                "INSERT INTO orderitems (oid, iid, quantity, offer_id) VALUES ($1, $2, $3, $4) RETURNING *;",
                [newOrder.rows[0].id, item.iid, item.quantity, offer.rows[0].id]
              );
            } else {
              await client.query(
                "INSERT INTO orderitems (oid, iid, quantity, offer_id) VALUES ($1, $2, $3, $4) RETURNING *;",
                [newOrder.rows[0].id, item.iid, item.quantity, null]
              );
            }

            await client.query(
              "UPDATE inventory SET quantity = $1 WHERE id = $2;",
              [newQuantity, inv[0].id]
            );
          }
        });
      })
    );

    const data = await client.query(
      "SELECT shops.id AS shopId, shops.name AS shop_name, shops.owner_id, oid, orders.timestamp FROM shops INNER JOIN orders ON shops.id = orders.sid INNER JOIN orderItems ON orders.id = orderItems.oid AND orderItems.oid =ANY ($1) GROUP BY(shops.id, oid, timestamp);",
      [orders]
    );

    await client.query("DELETE FROM cart WHERE uid = $1;", [userId]);

    await client.query("COMMIT");

    res.json(data.rows);
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e.message);
    res.json({ error: "Invalid Quantity", cart: e.message });
  }
});

router.get("/shops/pendingOrders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const ordersQuery = await db.query(
      "SELECT orders.* FROM orders INNER JOIN shops ON (orders.sid = shops.id AND shops.owner_id = $1 AND orders.status = 'Pending') ORDER BY orders.timestamp DESC;",
      [userId]
    );

    res.json(ordersQuery.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/shops/ongoingOrders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const ordersQuery = await db.query(
      "SELECT orders.* FROM orders INNER JOIN shops ON (orders.sid = shops.id AND shops.owner_id = $1 AND orders.status = 'Ongoing') ORDER BY orders.expected_date ASC;",
      [userId]
    );

    res.json(ordersQuery.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/shops/deliveredOrders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const ordersQuery = await db.query(
      "SELECT orders.* FROM orders INNER JOIN shops ON (orders.sid = shops.id AND shops.owner_id = $1 AND orders.status = 'Delivered') ORDER BY orders.timestamp DESC;",
      [userId]
    );

    res.json(ordersQuery.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/shops/cancelledOrders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const ordersQuery = await db.query(
      "SELECT orders.* FROM orders INNER JOIN shops ON (orders.sid = shops.id AND shops.owner_id = $1 AND orders.status = 'Cancelled') ORDER BY orders.timestamp DESC;",
      [userId]
    );

    res.json(ordersQuery.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/user/pendingOrders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const ordersQuery = await db.query(
      "SELECT orders.* FROM orders INNER JOIN shops ON (orders.sid = shops.id AND orders.uid = $1 AND orders.status = 'Pending') ORDER BY orders.timestamp DESC;",
      [userId]
    );

    res.json(ordersQuery.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/user/ongoingOrders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const ordersQuery = await db.query(
      "SELECT orders.* FROM orders INNER JOIN shops ON (orders.sid = shops.id AND orders.uid = $1 AND orders.status = 'Ongoing') ORDER BY orders.timestamp DESC;",
      [userId]
    );

    res.json(ordersQuery.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/user/deliveredOrders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const ordersQuery = await db.query(
      "SELECT orders.* FROM orders INNER JOIN shops ON (orders.sid = shops.id AND orders.uid = $1 AND orders.status = 'Delivered') ORDER BY orders.timestamp DESC;",
      [userId]
    );

    res.json(ordersQuery.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/user/cancelledOrders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const ordersQuery = await db.query(
      "SELECT orders.* FROM orders INNER JOIN shops ON (orders.sid = shops.id AND orders.uid = $1 AND orders.status = 'Cancelled') ORDER BY orders.timestamp DESC;",
      [userId]
    );

    res.json(ordersQuery.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/orderItems/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const items = await db.query(
      "SELECT orderItems.oid AS orderId, orderItems.quantity as quantity, inventory.pid AS pid, inventory.id AS iid, inventory.size AS size, inventory.price AS price, products.name, offers.discount_value AS discount_value FROM orderItems INNER JOIN inventory ON orderItems.iid = inventory.id AND orderItems.oid = $1 INNER JOIN products ON inventory.pid = products.id LEFT JOIN offers ON orderItems.offer_id = offers.id",
      [orderId]
    );

    res.json(items.rows);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.put("/confirmOrder", async (req, res) => {
  try {
    const { orderId, accepted, expected_date } = req.body;

    const queryText = `UPDATE orders SET status = $1, expected_date = $2 WHERE id = $3;`;
    const updateOrder = await db.query(queryText, [
      accepted ? "Ongoing" : "Cancelled",
      accepted ? expected_date : null,
      orderId,
    ]);

    res.json(true);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.put("/updateDeliveryDate", async (req, res) => {
  try {
    const { oid, expected_date } = req.body;

    const updateQuery = await db.query(
      "UPDATE orders SET expected_date = $1 WHERE id = $2",
      [expected_date, oid]
    );

    res.json(true);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.put("/deliverOrder", async (req, res) => {
  try {
    const { oid } = req.body;
    const updateQuery = await db.query(
      "UPDATE orders SET status = 'Delivered' WHERE id = $1 RETURNING *;",
      [oid]
    );

    if (updateQuery.rows.length === 0) return res.json(false);
    res.json(true);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.put("/cancelOrder", async (req, res) => {
  try {
    const { oid } = req.body;
    const updateQuery = await db.query(
      "UPDATE orders SET status = 'Cancelled' WHERE id = $1 RETURNING *;",
      [oid]
    );

    if (updateQuery.rows.length === 0) return res.json(false);
    res.json(true);
  } catch (e) {
    console.log(e.message);
    res.json(false);
  }
});

router.get("/reviews/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    const reviews = await db.query(
      "SELECT * FROM reviews WHERE shop_id = $1;",
      [shopId]
    );

    res.json(reviews.rows);
  } catch (e) {
    console.log(e.message);
    res.json([]);
  }
});

router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("You made it to the route");
});

router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send("You made it to the admin route");
});

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
        return res.json(false);
      }

      return res.json(user.rows[0]);
    } catch (err) {
      console.error(err);
    }
  } else {
    return res.json(false);
  }
});

router.get("/login-success", (req, res, next) => {
  return res.json(req.user);
});

router.get("/login-failure", (req, res, next) => {
  return res.json(false);
});

module.exports = router;

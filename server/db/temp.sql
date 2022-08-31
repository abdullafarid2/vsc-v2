CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cpr INT UNIQUE,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(40) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone_number INT NOT NULL,
    photo TEXT,
    address JSON []
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL,
    subcategories VARCHAR(255) []
);

CREATE TABLE shops (
    id SERIAL NOT NULL,
    owner_id uuid NOT NULL,
    name VARCHAR(40) UNIQUE NOT NULL,
    email VARCHAR(40) UNIQUE NOT NULL,
    phone INT NOT NULL,
    rating INT,
    logo TEXT NOT NULL,
    description TEXT NOT NULL,
    address JSON NOT NULL,
    category INT NOT NULL,
    subcategories VARCHAR(255) [],
    sections TEXT,
    url TEXT,
    status TEXT NOT NULL,
    delivery boolean NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_owner FOREIGN KEY(owner_id) REFERENCES users(id),
    CONSTRAINT fk_category FOREIGN KEY(category) REFERENCES categories(id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY NOT NULL,
    shop_id INT NOT NULL,
    user_id uuid NOT NULL,
    review TEXT,
    rating INT NOT NULL,
    CONSTRAINT fk_shop FOREIGN KEY(shop_id) REFERENCES shops(id),
    CONSTRAINT fk_user FOREIGN KEY(user_id)REFERENCES users(id)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY NOT NULL,
    shop_id INT NOT NULL,
    name VARCHAR(30) NOT NULL,
    price float(4) NOT NULL,
    quantity INT NOT NULL,
    photos TEXT NOT NULL,
    url TEXT NOT NULL,
    category VARCHAR NOT NULL,
    CONSTRAINT fk_shop
        FOREIGN KEY(shop_id)
            REFERENCES shops(id)
);

CREATE TABLE offers (
    id SERIAL PRIMARY KEY NOT NULL,
    shop_id INT NOT NULL,
    product_id INT NOT NULL,
    startDate TIMESTAMPTZ NOT NULL,
    endDate TIMESTAMPTZ NOT NULL,
    newPrice float(4) NOT NULL,
    
    CONSTRAINT fk_shop FOREIGN KEY(shop_id) REFERENCES shops(id),
    CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES products(id)

);

SET timezone = 'America/Los_Angeles';

CREATE TABLE cart (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id uuid NOT NULL,
    cart_items JSON [] NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id)REFERENCES users(id)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    user_id uuid NOT NULL,
    shop_id INT NOT NULL,
    items JSON [] NOT NULL,
    CONSTRAINT fk_shop FOREIGN KEY(shop_id) REFERENCES shops(id),
    CONSTRAINT fk_user FOREIGN KEY(user_id)REFERENCES users(id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    shop_id INT NOT NULL,
    message TEXT NOT NULL,
    CONSTRAINT fk_receiver FOREIGN KEY(receiver_id) REFERENCES users(id),
    CONSTRAINT fk_sender FOREIGN KEY(sender_id)REFERENCES users(id),
    CONSTRAINT fk_shop FOREIGN KEY(shop_id) REFERENCES shops(id)
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    user_id uuid NOT NULL,
    message TEXT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id)REFERENCES users(id)
);


CREATE TABLE admins (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(40) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

insert into shops (owner_id, name, email, phone, rating, logo, description, address, category, subcategories, status, delivery) values('1f1cae56-6e9e-404e-8c78-a8ea68dc79d6', 'Krispy Kreme', 'krispeykreme@mail.com', 17172727, 4.5, 'https://1000logos.net/wp-content/uploads/2017/12/krispy-kreme-Emblem.jpg', 'Best donuts in the world!', '{"area":"Busaiteen", "road":123, "block":456}', 1, '{1,2}', 'ok', true);
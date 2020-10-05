DROP DATABASE IF EXISTS launchstore;
CREATE DATABASE launchstore;


CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int NOT NULL,
  "user_id" int ,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

insert into CATEGORIES(name) values ('Comida');
insert into CATEGORIES(name) values ('Eletrônicos');
insert into CATEGORIES(name) values ('Automóveis');

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL,
  "product_id" int 
);

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "cpf_cnpj" text UNIQUE NOT NULL,
  "cep" text,
  "address" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

-- FOREIGN KEY
ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- CREATE PROCEDURE
CREATE FUNCTION trigger_set_timestamp()
RETURNS trigger AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

--AUTO UPDATED_AT PRODUCTS
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
for each ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--AUTO UPDATED_AT USERS
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
for each ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--CONNECT PG SIMPLE TABLE
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--TOKEN PASSWORD RECOVERY
ALTER TABLE "users" ADD COLUMN reset_token text;
ALTER TABLE "users" ADD COLUMN reset_token_EXPIRES text;

--CASCADE REMOVE
ALTER TABLE "products" 
DROP CONSTRAINT products_user_id_fkey,
ADD CONSTRAINT products_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "files"
DROP CONSTRAINT files_product_id_fkey,
ADD CONSTRAINT files_product_id_fkey
FOREIGN KEY ("product_id")
REFERENCES "products" ("id")
ON DELETE CASCADE;

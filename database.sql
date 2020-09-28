CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int NOT NULL,
  "user_id" int ,
  "name" text [not null],
  "description" text [not null],
  "old_price" int,
  "price" int [not null],
  "quantity" int [default: 0],
  "status" int [default: 1],
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text [not null]
);

CREATE TABLE "files" (
  "in" SERIAL PRIMARY KEY,
  "name" text,
  "path" text [not null],
  "product_id" int 
);

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

create function trigger_set_timestamp()
returns trigger as $$
begin
	new.updated_at = NOW();
	return new;
END
$$ language plpgsql;

create trigger set_timestamp
before update on products
for each row
execute procedure trigger_set_timestamp();
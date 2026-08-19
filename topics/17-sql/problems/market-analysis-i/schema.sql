CREATE TABLE Users (
  user_id INT PRIMARY KEY,
  join_date DATE,
  favorite_brand VARCHAR(10)
);

CREATE TABLE Orders (
  order_id INT PRIMARY KEY,
  order_date DATE,
  item_id INT,
  buyer_id INT,
  seller_id INT
);

CREATE TABLE Items (
  item_id INT PRIMARY KEY,
  item_brand VARCHAR(10)
);

CREATE TABLE Customer (
  customer_id INT,
  name VARCHAR(20),
  visited_on DATE,
  amount INT,
  PRIMARY KEY (customer_id, visited_on)
);

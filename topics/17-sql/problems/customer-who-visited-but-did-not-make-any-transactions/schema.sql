CREATE TABLE Visits (
  visit_id INT PRIMARY KEY,
  customer_id INT
);

CREATE TABLE Transactions (
  transaction_id INT PRIMARY KEY,
  visit_id INT,
  amount INT
);

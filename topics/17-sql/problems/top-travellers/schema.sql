CREATE TABLE Users (
  id INT PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE Rides (
  id INT PRIMARY KEY,
  user_id INT,
  distance INT
);

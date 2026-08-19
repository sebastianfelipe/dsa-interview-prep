CREATE TABLE Activity (
  player_id INT,
  device_id INT,
  event_date DATE,
  games_played INT,
  PRIMARY KEY (player_id, event_date)
);

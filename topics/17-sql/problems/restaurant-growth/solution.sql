WITH daily AS (
  SELECT visited_on, SUM(amount) AS amount
  FROM Customer
  GROUP BY visited_on
)
SELECT visited_on, amount, average_amount
FROM (
  SELECT
    visited_on,
    SUM(amount) OVER w AS amount,
    ROUND(SUM(amount) OVER w / 7.0, 2) AS average_amount
  FROM daily
  WINDOW w AS (
    ORDER BY visited_on
    RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW
  )
) windowed
WHERE visited_on >= (SELECT MIN(visited_on) + 6 FROM daily)
ORDER BY visited_on;

SELECT
  u.user_id AS buyer_id,
  u.join_date,
  COUNT(o.order_id) AS orders_in_2019
FROM Users u
LEFT JOIN Orders o
  ON o.buyer_id = u.user_id
 AND o.order_date BETWEEN DATE '2019-01-01' AND DATE '2019-12-31'
GROUP BY u.user_id, u.join_date;

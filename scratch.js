const pool = require('./src/db');
pool.query(`SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name)
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY o.id ORDER BY o.created_at DESC`)
  .then(res => console.dir(res.rows, {depth: null}))
  .catch(console.error)
  .finally(() => pool.end());

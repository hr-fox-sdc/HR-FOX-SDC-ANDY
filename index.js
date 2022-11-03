const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3003;

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'andy',
  host: 'localhost',
  database: 'qa',
  port: 5432,
});

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'Basic setup need to change get / route' });
});

app.get('/qa/questions/', (req, res) => {
  let count = req.query.count || 5;
  pool.query(`SELECT * FROM questions WHERE product_id = ${req.query.product_id} ORDER BY id LIMIT ${count}`, (err, data) => {
    if (err) {
      throw error;
    }
    res.send(data.rows);
  });
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  let count = req.query.count || 5;
  pool.query(`SELECT * FROM answers WHERE question_id = ${req.params.question_id} ORDER BY id LIMIT ${count}`, (err, data) => {
    if (err) {
      throw error;
    }
    res.send(data.rows);
  });
});



// app.get('/qa/questions/', (req, res) => {
//   let count = req.query.count || 5;
//   pool.query(`SELECT * FROM questions WHERE product_id = ${req.query.product_id} ORDER BY id LIMIT ${count}`, (err, data) => {
//     if (err) {
//       throw error;
//     }
//     res.send(data.rows);
//   });
// });

app.put('/qa/questions/:question_id/report', (req, res) => {
  let count = req.query.count || 5;        // should probably change if wanted to track # of reports but goint for simplicity first
  pool.query('UPDATE questions SET reported = $1 WHERE id = $2', [true, req.params.question_id ],  (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data.rows);
  });
});


app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
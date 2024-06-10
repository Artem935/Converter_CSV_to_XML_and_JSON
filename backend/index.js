const express = require('express')

const PORT = process.env.PORT || 3001

const app = express()
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'hope';
app.use(bodyParser.json());
const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'root', 
    database: 'gamestat'
  });

app.post('/api',(req,res) => 
{
    connection.query('SELECT * FROM users', (error, results, fields) => {
        if (error) {
          console.error('Ошибка выполнения запроса:', error);
          res.status(500).send('Произошла ошибка при получении пользователей');
          return;
        }
        res.json({
            massage: "Hello from backend",
            results: results
        })
      });
})
 
app.post('/compareRegistration',(req,res) => 
{
  console.log(req.body)
  const { username, email} = req.body;
  const request = `SELECT * FROM gamestat.users WHERE username = '${username}' OR email = '${email}'`;
    connection.query(request, (error, results, fields) => {
      console.log(results.length)
        if (error) {
          console.error('Ошибка выполнения запроса:', error);
          res.status(500).send('Произошла ошибка при получении пользователей');
          return;
        }
        let isUnick = false
        if (results.length == 0)
        {
          isUnick = true
        }
        res.json({
            massage: isUnick,
        })
      });
})
app.post('/insertRegistration',(req,res) => 
{
  console.log(req.body)
  const { username, email, password } = req.body;
  const request = `INSERT INTO users (username, email, password) VALUES 
  ('${username}', '${email}', '${password}')`;
    connection.query(request, (error, results, fields) => {
        if (error) {
          console.error('Ошибка выполнения запроса:', error);
          res.status(500).send('Произошла ошибка при получении пользователей');
          return;
        }
        console.log(results);
        console.log("Insert complete");
      });
})
app.post('/compareLogin',(req,res) => 
{
  console.log(req.body)
  const {username} = req.body;
  const request = `SELECT * FROM gamestat.users WHERE username = '${username}'`;
    connection.query(request, (error, results, fields) => {
      console.log(results.length)
        if (error) {
          console.error('Ошибка выполнения запроса:', error);
          res.status(500).send('Произошла ошибка при получении пользователей');
          return;
        }
        if (results.length == 1)
        {
          console.log(results[0].password);
          const token = jwt.sign({ username: results[0].username,password: results[0].password }, SECRET_KEY, { expiresIn: '1h' });
          res.json({
              password: results[0].password,
              token: token
          })
        }
        else
        {
          res.json({
            password: "empty",
        })
        }
      });
})
app.post('/takeProfile',(req,res) => 
{
  console.log(req.body)
  const {username} = req.body;
  const request = `SELECT * FROM onlyplants.users WHERE username = '${username}'`;
    connection.query(request, (error, results, fields) => {
      console.log(results.length)
        if (error) {
          console.error('Ошибка выполнения запроса:', error);
          res.status(500).send('Произошла ошибка при получении пользователей');
          return;
        }
        if (results.length == 1)
        {
          console.log(results);
          res.json({
              id: results[0].id,
              username: results[0].username,
              password: results[0].password,
              email: results[0].email
          })
        }
        else
        {
          res.json({
            password: "empty",
          })
        }

      });
})
app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`)
})
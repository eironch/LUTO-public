import express from "express"
import mysql from "mysql"

const PORT = 8080
const app = express()

const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"LUTO"
})

    app.post('/signup', (req, res) => {
        const { username, email, password } = req.body;
        const registration_date = new Date();
        const query = 'INSERT INTO users (username, password, registration_date,email) VALUES (?, ?, ?, ?)'

        db.query(query, [username, password, registration_date,email], (err, result) => {
            if (err) {
              res.status(500).send('Error creating user');
            } else {
              res.status(200).send('User created successfully');
            }

          });
        });    

        app.post('/signin', (req, res) => {
            const { username, password } = req.body;
            const query = 'SELECT * FROM users WHERE username = ? AND password = ?'
          
            db.query(query, [username, password], (err, result) => {
                if (err) {
                  res.status(500).send('Error retrieving user');
                } else {
                  if (result.length > 0) {
                    res.status(200).send('Sign in successful');
                  } else {
                    res.status(401).send('Incorrect username or password');
                  }
                }
              });
            });     
app.listen(PORT, () => {
    console.log("Connected to backend!");



})


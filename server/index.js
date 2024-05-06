import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import bcrypt from 'bcrypt'

const PORT = 8080
const app = express()

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'LUTO'
})

app.use(express.json())
app.use(cors(
    // {origin: 'https://checklist-app-client.vercel.app',
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization']}
))

app.get('/', (req, res) => {
    res.json("good mourning.")
})

app.post('/create-account', (req, res) => {
    const { username, password } = req.body
    const query = `SELECT * FROM USERS WHERE username = ?`

    db.query(query, username, (err, data) => {        
        if (err) {
            return res.status(500).json(err)
        } else if (data.length > 0) {
            return res.status(202).json({ success: false, message: "Username exists." })
        }

        return createAccount(res, username, password)
    })
})

async function createAccount(res, username, password) {
    const registration_date = new Date();
    const hashedPassword = await bcrypt.hash(password, 8)
    const query = `INSERT INTO USERS (username, password, registration_date) VALUES (?, ?, ?)`

    db.query(query, [username, hashedPassword, registration_date], (err) => {
        if (err) {
            return res.status(500).json(err)
        }
        return res.status(201).json({ success: true, message: "User account created." })
    })
}

app.post('/sign-in', async (req, res) => {
    const {username, password} = req.body

    let query = `SELECT * FROM USERS WHERE username = ?`
    
    db.query(query, [username, password], async (err, data) => {
        if (err) {
            return res.status(500).json(err)
        } else if (data.length > 0) {
            const match = await bcrypt.compare(password, data[0].password)
            if (match) {
                return res.status(200).json({ success: true, message: "User signed in." })
            }
        }
        return res.status(202).json({ success: false, message: "Incorrect username or password." })
    })
})

app.listen(PORT, () => {
    console.log("Connected to backend.")
})
import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

const PORT = 8080
const secretKey = "luto-app"
const app = express()

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'LUTO'
})

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser())

function generateToken(userId, username) {
    return jwt.sign({ userId, username}, secretKey, { expiresIn: '1h' })
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey)
    } catch(err) {
        return null
    }
}

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
    const query = `INSERT INTO USERS (username, password, registrationDate) VALUES (?, ?, ?)`

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
                res.cookie(
                    'authToken',  generateToken(data[0].userId, data[0].username), {
                        httpOnly: true,
                        secure: false,
                        maxAge: 3600000,
                    }
                )
                return res.status(200).json({ success: true, message: "User signed in." })
            }
        }
        return res.status(202).json({ success: false, message: "Incorrect username or password." })
    })
})

app.get('/check-auth', (req, res) => {
    const token = req.cookies.authToken
    const decoded = verifyToken(token)
    if (token && decoded) {
        return res.status(200).json({ isAuthenticated: true, data: decoded.username})
    } else {
        return res.status(202).json({ isAuthenticated: false })
    }
})

app.listen(PORT, () => {

    let query = `SELECT * FROM USERS WHERE username = "ficuno"`

    db.query(query, (err, data) => {
        console.log(data[0].userId)
        console.log({  'authToken':  generateToken(data[0].userId), 
            httpOnly: true,
            secure: true, // change this in production
            maxAge: 3600000,
        })
        if (err) {

        } else if (data.length > 0) {

        }
    })
    console.log("Connected to backend.")
})
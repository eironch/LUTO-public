import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from './models/user.js'

const PORT = 8080

// jwst secret key
const secretKey = "luto-app"

// express app
const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

// cookie for login
app.use(cookieParser())

function generateAccessToken(userId, username) {
    return jwt.sign({ userId, username}, secretKey, { expiresIn: '1h' })
}

function generateRefreshToken(userId, username) {
    return jwt.sign({ userId, username}, secretKey, { expiresIn: '30d' })
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey)
    } catch(err) {
        return null
    }
}

// connect to mongodb
const dbURI = 'mongodb+srv://test:f2qWY9k3dxnsqj9T@luto.tihpifs.mongodb.net/luto?retryWrites=true&w=majority&appName=LUTO'
mongoose.connect(dbURI)
    .then(() => { 
        app.listen(PORT, () => {
            console.log("Connected to backend.")
        }) 
    })
    .catch(err => { 
        console.log("Connection error: ", err) 
    })

// mongoose and mongo sandbox routes
app.get('/', (req, res) => {
    res.json("good mourning.")
})

app.post('/create-account', (req, res) => {
    const { username, password } = req.body
    const user = new User({
        username,
        password,
        bio: '',
        refreshToken: '',
    })

    user.save()
        .then(() => {
            return res.status(201).json({ success: true, message: "Account created." })
        })
        .catch(err => {
            return res.status(202).json({ success: false, message: "Username exists." })
        })
})

app.post('/sign-in', async (req, res) => {
    const { username, password } = req.body
    
    try {
        const user = await User.findOne({ username })

        if(!user) {
            return res.status(202).json({ success: false, message: "User not found." })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(202).json({ success: false, message: "Incorrect username or password." })
        }

        res.cookie(
            'accessToken',
            generateAccessToken(user.userId, user.username), 
            {
                httpOnly: true,
                secure: true,
                maxAge: 3600000,
            }
        )

        res.cookie(
            'refreshToken',
            generateRefreshToken(user.userId, user.username), 
            {
                httpOnly: true,
                secure: true,
                maxAge: 2592000000,
            }
        )
        
        return res.status(200).json({ success: true, message: "User signed in." })
    } catch (err) {
        console.error('Login error:', err)
        return res.status(500).json({ message: 'Internal server error.' })
    }
})

app.get('/check-auth', (req, res) => {
    const accessToken = req.cookies.authToken
    const decodedAccessToken = verifyToken(accessToken)

    if (accessToken && decodedAccessToken) {
        return res.status(200).json({ isAuthenticated: true, payload: { username: decodedAccessToken.username, userId: decodedAccessToken.userId }})
    }
    
    const refreshToken = req.cookies.refreshToken
    const decodedRefreshToken = verifyToken(refreshToken)

    if (refreshToken && decodedRefreshToken) {
        res.cookie(
            'accessToken',
            generateAccessToken(decodedRefreshToken.userId, decodedRefreshToken.username), 
            {
                httpOnly: true,
                secure: true,
                maxAge: 3600000,
            }
        )

        return res.status(200).json({ isAuthenticated: true, payload: { username: decodedRefreshToken.username, userId: decodedRefreshToken.userId }})
    }

    return res.status(202).json({ isAuthenticated: false })
})
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from './models/user.js'
import Recipe from './models/recipe.js'
import RecipeOverview from './models/recipeOverview.js'
import Approve from './models/approve.js'

const PORT = 8080

// jwst secret key
const secretKey = 'luto-app'

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
    return jwt.sign({ userId, username }, secretKey, { expiresIn: '1h' })
}

function generateRefreshToken(userId, username) {
    return jwt.sign({ userId, username }, secretKey, { expiresIn: '30d' })
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
            console.log('Connected to backend.')
        }) 
    })
    .catch(err => { 
        console.log('Connection error') 
    })

// mongoose and mongo sandbox routes
app.get('/', (req, res) => {
    res.json('good mourning.')
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
            return res.status(201).json({ success: true, message: 'Account created.' })
        })
        .catch(() => {
            return res.status(202).json({ success: false, message: 'Username exists.' })
        })
})

app.post('/sign-in', (req, res) => {
    const { username, password } = req.body

    User.findOne({ username })
        .then(user => {
            if(!user) {
                return res.status(202).json({ success: false, message: 'User not found.' })
            }
            
            bcrypt.compare(password, user.password)
                .then(isPasswordValid => {
                    if (!isPasswordValid) {
                        return res.status(202).json({ success: false, message: 'Incorrect username or password.'})
                    }

                    res.cookie(
                        'accessToken',
                        generateAccessToken(user._id, user.username), 
                        {
                            httpOnly: true,
                            secure: true,
                            maxAge: 3600000,
                        }
                    )
            
                    res.cookie(
                        'refreshToken',
                        generateRefreshToken(user._id, user.username), 
                        {
                            httpOnly: true,
                            secure: true,
                            maxAge: 2592000000,
                        }
                    )

                    return res.status(200).json({ success: true, message: 'User signed in.' })
                })
                .catch(err => {
                    console.error('Password comparison error')
                    return res.status(500).json({ message: 'Internal server error.', err })
                })
        })
        .catch(err => {
            return res.status(500).json({ message: 'Internal server error.', err })
        })
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


app.post('/publish-recipe', (req, res) => {
    const { 
        userId,
        categories,
        tags,
        recipeImage,
        title,
        summary,
        ingredients,
        recipeElements
    } = req.body

    const recipe = new Recipe({
        userId: new mongoose.Types.ObjectId('6649c35c8a14388c3a09bc4a'),
        categories,
        tags,
        recipeImage: 'none', 
        title: 'A new delicious recipe made in ten minutes',
        summary: 'This new and easy to do recipe is good for home cooking',
        ingredients,
        recipeContents: [
            {
                contentType: 'Headline',
                contents: [
                    'Step 1'
                ]
            }
        ]
    })

    recipe.save()
        .then(savedRecipe => {
            const recipeOverview = new RecipeOverview({
                recipeId: savedRecipe._id,
                userId: savedRecipe.userId,
                categories: savedRecipe.categories,
                tags: savedRecipe.tags,
                recipeImage: savedRecipe.recipeImage, 
                title: savedRecipe.title,
                summary: savedRecipe.summary,
            })

            return recipeOverview.save()
        })
        .then(() => {
            return res.status(201).json({ success: true, message:'Recipe published.'})
        })
        .catch(err => {
            return res.status(500).json({ message:'Internal server error.', err})
        })
})

app.post('/approve-recipe', (req, res) => {
    const { userId, recipeId } = req.body

    const approve = new Approve({
        userId,
        recipeId,
    })

    Approve.find({ userId, recipeId })
        .then(async isApproved => {
            if (isApproved.length) {
                return await Approve.deleteOne({ userId, recipeId })
                    .then(() => {
                        return res.status(200).json({ success: true, message:'Recipe unapproved.'})
                    })
            }

            return await approve.save()
                .then(() => {
                    return res.status(201).json({ success: true, message:'Recipe approved.'})
                })
        })
        .catch(err => {
            return res.status(500).json({ success: true, message:'Internal server error.', err})
        })
})

app.get('/feed-recipes', (req, res) => {
    const { userId } = req.query

    RecipeOverview.find()
        .populate({
            path: 'userId',
            model: 'User',
            select: 'username'
        })
        .then(async recipes => {
            if (!recipes.length) {
                return res.status(400).json({ message: 'No recipes found.' });
            }

            const approvalPromises = recipes.map(async recipe => {
                const isApproved = await Approve.find({ userId, recipeId: recipe.recipeId })
                    .then(isApproved => isApproved.length > 0)
                    .catch(err => {
                        throw err
                    });
            
                return { ...recipe.toObject(), isApproved }
            })
            
            return Promise.all(approvalPromises)
                .then(recipes => {
                    return res.status(200).json({ success: true, payload: recipes })
                })
        })
        .catch(err => {
            return res.status(500).json({ message: 'Internal server error.', err });
        });
});
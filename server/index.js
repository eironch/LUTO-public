import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import multer from 'multer'
import { db, bucket } from './firebaseAdmin.js'
import { v4 as uuidv4 } from 'uuid' 

import User from './models/user.js'
import Recipe from './models/recipe.js'
import RecipeOverview from './models/recipeOverview.js'
import Approval from './models/approval.js'

const PORT = 8080

// jwst secret key
const secretKey = 'luto-app'

// express app
const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

// cookie for logging in
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


app.post('/publish-recipe', upload.any(), (req, res) => {
    const { 
        userId,
        categories,
        tags,
        title,
        summary,
    } = req.body

    const recipeFiles = req.files

    // const file = req.files
    console.log(req.body)
    console.log(req.files)
    // uploadFileToStorage(req.files[0])
    const ingredients = JSON.parse(req.body.ingredients)
    const recipeElements = JSON.parse(req.body.recipeElements)

    const recipe = new Recipe({
        userId,
        categories,
        tags,
        recipeImage,
        title,
        summary,
        ingredients,
        recipeElements,
    })
    console.log('new recipe')
    console.log(recipe)
    uploadFile(recipeFiles)
        .then(fileLinks => {
            recipe.recipeImage = fileLinks.recipeImage
            
            for (let i = 0; i < fileLinks.elementFiles.length; i++) {
                if (recipe.recipeElements[i].contentType === 'Images' ||
                    recipe.recipeElements[i].contentType === 'Image and Text' ||
                    recipe.recipeElements[i].contentType === 'Video') {
                    recipe.recipeElements[i].contents[0] = fileLinks.elementFiles[i]
                }
            }
            
            return recipe
        })
        .then(recipe => {
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
                    throw err
                })
        })
        .catch(err => {
            return res.status(500).json({ message:'File upload error.', err})
        })
})

async function uploadFile(files){
    const recipeImage = files.find(file => file.fieldname === 'recipeImage')
    const elementFiles = files.filter(file => file.fieldname !== 'recipeImage')
    const fileLinks = { recipeImage: '', elementFiles: [] }
    console.log('1')
    return await uploadFileToStorage(recipeImage)
            .then(async publicUrl => {
                fileLinks.recipeImage = publicUrl

                // if (!elementFiles.some(element => 
                //     element.contentType === 'Images' || 
                //     element.contentType === 'Image and Text' || 
                //     element.contentType === 'Video')) {
                //     // log
                //     console.log('Returned')
                //     return
                // }

                const uploadPromises = elementFiles.map(async file => {
                    return uploadFileToStorage(file.contents[0])
                            .then(publicUrl => {
                                fileLinks.elementFiles.push(publicUrl)
                            })
                            .catch(err => {
                                throw err
                            })
                })

                await Promise.all(uploadPromises)

                return fileLinks
            })
            .catch(err => {
                return res.status(500).json({ message:'Storage upload error.', err})
            })
}

function uploadFileToStorage(file) {
    console.log('2')
    return new Promise((resolve, reject) => {
        console.log('3')
        const blob = bucket.file(`media/${uuidv4()}_${uuidv4()}`)
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        })
        
        console.log(file)
        console.log('4')
        
        blobStream.on('error', err => {
            reject(err)
        })

        console.log('5')
        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            console.log(publicUrl)
            resolve(publicUrl)
        })

        console.log('6')
        // uploads file to the space in the cloud
        blobStream.end(file.buffer)
    })
}

app.post('/approve-recipe', (req, res) => {
    const { userId, recipeId } = req.body

    const approval = new Approval({
        userId,
        recipeId,
    })

    Approval.find({ userId, recipeId })
        .then(async isApproved => {
            if (isApproved.length) {
                return await Approve.deleteOne({ userId, recipeId })
                    .then(() => {
                        return res.status(200).json({ success: true, message:'Recipe unapproved.'})
                    })
            }

            return await approval.save()
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
                const isApproved = await Approval.find({ userId, recipeId: recipe.recipeId })
                    .then(isApproved => isApproved.length > 0)
                    .catch(err => {
                        throw err
                    })
            
                return { ...recipe.toObject(), isApproved }
            })
            
            return Promise.all(approvalPromises)
                .then(recipes => {
                    return res.status(200).json({ success: true, payload: recipes })
                })
        })
        .catch(err => {
            return res.status(500).json({ message: 'Internal server error.', err })
        })
})

app.get('/recipe', (req, res) => {
    const { recipeId, userId } = req.query

    Recipe.findById( recipeId )
        .then(async recipe => {
            if (!recipe) {
                return res.status(400).json({ message: 'No such recipe found.' })
            }

            return new Promise(async () => {
                    const isApproved = await Approve.find({ userId, recipeId: recipe.recipeId })
                        .then(isApproved => isApproved.length > 0)
                        .catch(err => {
                            throw err
                        })
                    
                    return { recipeContents: { ...recipe.toObject()}, appprovalStatus: {isApproved} }
                })
                .then(recipe => {
                    return res.status(200).json({ success: true, payload: recipe })
                })
        })
 
})
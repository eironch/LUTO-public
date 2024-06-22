import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Types } from 'mongoose'
import multer from 'multer'
import { db, bucket } from './firebaseAdmin.js'
import { v4 as uuidv4 } from 'uuid' 

import User from './models/user.js'
import Recipe from './models/recipe.js'
import RecipeOverview from './models/recipeOverview.js'
import Approval from './models/approval.js'
import Feedback from './models/feedback.js'

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

app.get('/sign-in', (req, res) => {
    const { username, password } = req.query

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

                    return res.status(200).json({ success: true, payload: { username: user.username, userId: user._id }, message: 'User signed in.' })
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
    console.log("here")
    const refreshToken = req.cookies.refreshToken
    const decodedRefreshToken = verifyToken(refreshToken)
    console.log("here")
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
        console.log("her3123e")
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

    const recipe = {
        userId,
        categories,
        tags: JSON.parse(tags),
        recipeImage: '',
        title,
        summary,
        ingredients,
        recipeElements,
    }
    console.log('recipe')
    console.log(recipe)
    console.log(recipeFiles)
    try {
        uploadFile(recipeFiles)
            .then(fileLinks => {
                const elementLinks = fileLinks.elementFiles

                recipe.recipeImage = fileLinks.recipeImage

                recipeElements.forEach((element) => {
                    for (let x = 0; x < element.filesLength; x++) {
                        element.files.push(elementLinks[x])
                    }

                    elementLinks.splice(0, element.filesLength)
                })

                console.log('new recipe')
                console.log(recipe)
                return recipe
            })
            .then(recipeValues => {
                const recipe = new Recipe(recipeValues)

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
            })
    } catch (err) {
        return res.status(500).json({ message:'File upload error.', err})
    }
})

async function uploadFile(files){
    const recipeImage = files.find(file => file.fieldname === 'recipeImage')
    const elementFiles = files.filter(file => file.fieldname !== 'recipeImage')
    const fileLinks = { recipeImage: '', elementFiles: [] }
   
    console.log('1')
    return await uploadFileToStorage(recipeImage)
        .then(async recipeUrl => {
            fileLinks.recipeImage = recipeUrl
        })
        .then(async () => {
            console.log('here!')
            const uploadPromises = elementFiles.map(async file => {
                try {
                    const fileUrl = await uploadFileToStorage(file)

                    // const [signedUrl] = await bucket.file(fileUrl).getSignedUrl(options)
                    console.log('url download:', fileUrl)
                    return fileUrl
                } catch (error) {
                    console.error('Error uploading element file:', error)
                }
            })

            fileLinks.elementFiles = await Promise.all(uploadPromises)
            console.log('fileLinks')
            console.log(fileLinks)
            return fileLinks
        })
}

function uploadFileToStorage(file) {
    return new Promise((resolve, reject) => {
        if (!file.size) {
            return resolve('')
        }
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
        blobStream.on('finish', async () => {
            try {
                await blob.makePublic()
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                console.log('url')
                console.log(publicUrl)
                resolve(publicUrl)
            } catch (err) {
                reject(err)
            }
        })

        console.log('6')
        // uploads file to the space in the cloud
        blobStream.end(file.buffer)
    })
}

app.post('/approve-recipe', async (req, res) => {
    const { userId, recipeId } = req.body

    try {
        const existingLike = await Approval.findOne({ userId, recipeId })

        if (existingLike) {
            await Approval.deleteOne({ userId, recipeId })

            await Recipe.findByIdAndUpdate(recipeId, { $inc: { approvalCount: -1 } })

            const approvalCount = await Recipe.findById(recipeId).select('approvalCount')

            return res.status(200).json({ success: true, message:'Recipe unapproved.', payload: { isApproved: false, approvalCount } })
        }

        await Approval.updateOne(
            { userId, recipeId },
            { $setOnInsert: { userId, recipeId } },
            { upsert: true }
        )

        await Recipe.findByIdAndUpdate(recipeId, { $inc: { approvalCount: 1 } })

        const approvalCount = await Recipe.findById(recipeId).select('approvalCount')
        console.log(approvalCount)
        return res.status(201).json({ success: true, message:'Recipe approved.', payload: { isApproved: true, approvalCount } })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: true, message:'Internal server error.', err})
    }
})

app.get('/feed-recipes', async (req, res) => {
    const { userId, filters } = req.query
    const pipeline = []
    
    try {
        if (filters) {
            pipeline.push(
                { 
                    $match: { tags: { $in: filters } }
                },
                {
                    $addFields: {
                        matchCount: {
                            $size: {
                                $filter: {
                                    input: "$tags",
                                    as: "tag",
                                    cond: { $in: ["$$tag", filters] }
                                }
                            }
                        }
                    }
                },
            )
        }

        pipeline.push({ $sort: { createdAt: -1 } })

        const aggregatedResults = await RecipeOverview.aggregate(pipeline)
        const results = aggregatedResults.map(result => new RecipeOverview(result))

        const recipes = await RecipeOverview.populate(results, [
                    { path: 'userId', select: 'username' },
                    { path: 'recipeId', select: ['approvalCount', 'feedbackCount']}
                ])


        if (!recipes.length) {
            return res.status(400).json({ message: 'No recipes found.' })
        }

        const approvalPromises = recipes.map(async recipe => {
            const isApproved = await Approval.findOne({ userId, recipeId: recipe.recipeId }) !== null
    
            return { ...recipe.toObject(), isApproved }
        })
        
        return Promise.all(approvalPromises)
            .then(recipes => {
                console.log(recipes)
                return res.status(200).json({ success: true, payload: recipes })
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.get('/recipe', async (req, res) => {
    const { recipeId, userId } = req.query
    console.log(req.query)
    try {
        const recipe = await Recipe.findById( recipeId )
            .populate({
                path: 'userId',
                model: 'User',
                select: 'username'
            })
            .lean()
        
        if (!recipe) {
            return res.status(400).json({ message: 'No such recipe found.' })
        }

        const isApproved = await Approval.findOne({ userId, recipeId: recipe.recipeId }).lean() !== null

        const response = {
            userInfo: { username: recipe.userId.username },
            recipeContents: { ...recipe },
            approvalStatus: { isApproved }
        }

        return res.status(200).json({ success: true, payload: response })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.get('/user-recipes', async (req, res) => {
    const { authorName } = req.query
    
    try {
        const user = await User.find({ username: authorName })

        if (!user.length) {
            return res.status(400).json({ message: 'No such user found.' })
        }
        console.log(user[0]._id)
        const recipes = await RecipeOverview.find({ userId: user[0]._id }).populate({
                path: 'userId',
                select: 'username'
            }).populate({
                path: 'recipeId',
                select: 'approvalCount',
            }).sort({ createdAt: -1 })
        console.log(recipes)
        if (!recipes) {
            return res.status(400).json({ message: 'No recipes found.' })
        }

        const approvalPromises = recipes.map(async recipe => {
            const isApproved = await Approval.findOne({ userId: user[0]._id, recipeId: recipe.recipeId }) !== null
  
            return { ...recipe.toObject(), isApproved }
        })

        return Promise.all(approvalPromises)
            .then(recipes => {
                return res.status(200).json({ success: true, payload: recipes })
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.post('/submit-feedback', async (req, res) => {
    const { userId, recipeId, text } = req.body
    console.log(req)
    const feedback = new Feedback({
        userId,
        recipeId,
        text,
        flag: 0,
    })
    
    try {
        await Recipe.findByIdAndUpdate(recipeId, { $inc: { feedbackCount: 1 } })

        feedback.save()
            .then(() => {
                return res.status(201).json({ success: true, message: 'Feedback created.' })
            })
            .catch(() => {
                return res.status(202).json({ success: false, message: 'Error creating feedback.' })
            })
            
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.get('/feedbacks', async (req, res) => {
    const { recipeId } = req.query
    console.log(recipeId)
    console.log("hererereererr")
    const pipeline = [
        { 
            $match: { recipeId: new Types.ObjectId(recipeId) }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]

    try {
        const aggregatedResults = await Feedback.aggregate(pipeline)

        const feedbacks = await User.populate(aggregatedResults, {
            path: 'userId',
            select: 'username'
        })

        const feedbackCount = await Recipe.findById(recipeId).select('feedbackCount')

        return res.status(200).json({ success: true, payload: { feedbacks, feedbackCount } })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})
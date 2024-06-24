import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Types } from 'mongoose'
import multer from 'multer'
import { bucket } from './firebaseAdmin.js'
import { v4 as uuidv4 } from 'uuid' 

import User from './models/user.js'
import Recipe from './models/recipe.js'
import RecipeOverview from './models/recipeOverview.js'
import Point from './models/point.js'
import Feedback from './models/feedback.js'
import Save from './models/save.js'
import Flag from './models/flag.js'

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
mongoose.connect(dbURI, { autoIndex: false })
    .then(() => { 
        app.listen(PORT, () => {
            console.log('Connected to backend.')
        }) 
    })
    .catch(err => { 
        console.log('Connection error') 
    })

// mongoose.connection.once('open', async () => {
//     try {
//         await Recipe.createIndexes()
//         await RecipeOverview.createIndexes()
//         await Approval.createIndexes()

//         console.log('Indexes created successfully.')
//     } catch (error) {
//         console.error('Error creating indexes:', error)
//     }
// })

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
        userType,
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
    console.log('here')
    const refreshToken = req.cookies.refreshToken
    const decodedRefreshToken = verifyToken(refreshToken)
    console.log('here')
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
        console.log('her3123e')
        return res.status(200).json({ isAuthenticated: true, payload: { username: decodedRefreshToken.username, userId: decodedRefreshToken.userId }})
    }

    return res.status(202).json({ isAuthenticated: false })
})

app.post('/publish-recipe', upload.any(), async (req, res) => {
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

    const recipeFormat = {
        userId,
        categories,
        tags: JSON.parse(tags),
        recipeImage: '',
        title,
        summary,
        ingredients,
        recipeElements,
    }

    try {
        const fileLinks = await uploadFile(recipeFiles)
        const elementLinks = fileLinks.elementFiles
        recipeFormat.recipeImage = fileLinks.recipeImage

        recipeElements.forEach((element) => {
            for (let x = 0; x < element.filesLength; x++) {
                element.files.push(elementLinks[x])
            }

            elementLinks.splice(0, element.filesLength)
        })

        const recipe = new Recipe(recipeFormat)
        const savedRecipe = await recipe.save()

        const recipeOverview = new RecipeOverview({
            recipeId: savedRecipe._id,
            userId: savedRecipe.userId,
            categories: savedRecipe.categories,
            tags: savedRecipe.tags,
            recipeImage: savedRecipe.recipeImage, 
            title: savedRecipe.title,
            summary: savedRecipe.summary,
        })        
        await recipeOverview.save()

        return res.status(201).json({ success: true, message:'Recipe published.'})
    } catch (err) {
        console.log(err)
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

app.post('/give-point', async (req, res) => {
    const { userId, recipeId, pointStatus } = req.body
    console.log(req.body)
    try {
        const isGivenPoint = await Point.findOne({ userId, recipeId })

        if (isGivenPoint) {
            const prevStatus = await Point.findOne({ userId, recipeId }).select('pointStatus')

            if (pointStatus === '') {
                await Point.deleteOne({ userId, recipeId })

                if (prevStatus.pointStatus === 'negative') {
                    await Recipe.findByIdAndUpdate(recipeId, { $inc: { points: 1 } })
                } else if (prevStatus.pointStatus === 'positive') {
                    await Recipe.findByIdAndUpdate(recipeId, { $inc: { points: -1 } })
                }
                
                const points = await Recipe.findById(recipeId).select('points')
                
                return res.status(203).json({ success: true, message:'Recipe point ungiven.', payload: { pointStatus, points } })
            }

            await Point.updateOne(
                { userId, recipeId },
                {
                    $set: {
                        pointStatus
                    },
                    $currentDate: { updatedAAt: true }
                }
            )
            console.log(prevStatus.pointStatus)
            if (prevStatus.pointStatus === 'positive') {
                await Recipe.findByIdAndUpdate(recipeId, { $inc: { points: -2 } })
            } else if (prevStatus.pointStatus === 'negative') {
                await Recipe.findByIdAndUpdate(recipeId, { $inc: { points: 2 } })
            }

            const points = await Recipe.findById(recipeId).select('points')
            console.log('changed')
            return res.status(200).json({ success: true, message:'Recipe point status changed.', payload: { pointStatus, points } })
        }
        console.log('not changed')
        const point = new Point({
            userId,
            recipeId,
            pointStatus
        })

        await point.save()

        if (pointStatus === 'positive') {
            await Recipe.findByIdAndUpdate(recipeId, { $inc: { points: 1 } })
        } else if (pointStatus === 'negative') {
            await Recipe.findByIdAndUpdate(recipeId, { $inc: { points: -1 } })
        }
  
        const points = await Recipe.findById(recipeId).select('points')

        return res.status(201).json({ success: true, message:'Recipe point given.', payload: { pointStatus, points } })
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
                                    input: '$tags',
                                    as: 'tag',
                                    cond: { $in: ['$$tag', filters] }
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
                    { path: 'recipeId', select: ['points', 'feedbackCount']}
                ])

        if (!recipes.length) {
            return res.status(400).json({ message: 'No recipes found.' })
        }

        const pointPromises = recipes.map(async recipe => {
            const status = await Point.findOne({ userId, recipeId: recipe.recipeId }).select('pointStatus') 
            console.log(status)
            return { ...recipe.toObject(), pointStatus: status && status.pointStatus }
        })
        
        return Promise.all(pointPromises)
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

        const status = await Point.findOne({ userId, recipeId }).select('pointStatus')

        const isSaved = await Save.findOne({ userId, recipeId }) !== null
    
        const response = {
            userInfo: { username: recipe.userId.username },
            recipeContents: { ...recipe },
            recipeStatus: { pointStatus: status && status.pointStatus, isSaved }
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

        const recipes = await RecipeOverview.find({ userId: user[0]._id }).populate({
                path: 'userId',
                select: 'username'
            }).populate({
                path: 'recipeId',
                select: 'points',
            }).sort({ createdAt: -1 })
        console.log(recipes)
        if (!recipes) {
            return res.status(400).json({ message: 'No recipes found.' })
        }

        const pointPromises = recipes.map(async recipe => {
            const status = await Point.findOne({ userId: user[0]._id, recipeId: recipe.recipeId }).select('pointStatus')
  
            return { ...recipe.toObject(), pointStatus: status && status.pointStatus }
        })

        return Promise.all(pointPromises)
            .then(recipes => {
                return res.status(200).json({ success: true, payload: recipes })
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.get('/find-recipes', async (req, res) => {
    const { userId, searchQuery, filters } = req.query
    console.log(req.query)
    const pipeline = [
        { 
            $match: {
                $and: [
                    filters ? { tags: { $in: filters } } : {},
                    {
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i' } },
                            { summary: { $regex: searchQuery, $options: 'i' } }
                        ]
                    }
                ]
            }
        },
        { $sort: { createdAt: -1 } }
    ]
    console.log(pipeline)
    try {
        const aggregatedResults = await RecipeOverview.aggregate(pipeline)
        const results = aggregatedResults.map(result => new RecipeOverview(result))

        const recipes = await RecipeOverview.populate(results, [
                    { path: 'userId', select: 'username' },
                    { path: 'recipeId', select: ['points', 'feedbackCount']}
                ])

        if (!recipes.length) {
            return res.status(400).json({ message: 'No recipes found.' })
        }

        const pointPromises = recipes.map(async recipe => {
            const status = await Point.findOne({ userId, recipeId: recipe.recipeId }).select('pointStatus')
    
            return { ...recipe.toObject(), pointStatus: status && status.pointStatus }
        })
        
        return Promise.all(pointPromises)
            .then(recipes => {
                console.log(recipes)
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
        await feedback.save()
        
        await Recipe.findByIdAndUpdate(recipeId, { $inc: { feedbackCount: 1 } })
        
        return res.status(201).json({ success: true, message: 'Feedback created.' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.get('/feedbacks', async (req, res) => {
    const { recipeId } = req.query
    console.log(recipeId)
    console.log('hererereererr')
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

app.post('/save-recipe', async (req, res) => {
    const { userId, recipeId } = req.body
    const save = new Save({
        userId,
        recipeId
    })

    try {
        const isSaved = await Save.findOne({ userId, recipeId }) !== null

        if (isSaved) {
            await Save.deleteOne({ userId, recipeId })

            return res.status(200).json({ success: true, message:'Recipe unsaved.', payload: { isSaved: false } })
        }

        await save.save()
            .then(() => {
                return res.status(201).json({ success: true, message: 'Recipe saved.', payload: { isSaved: true }})
            })
            .catch(() => {
                return res.status(202).json({ success: false, message: 'Error saving recipe.' })
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.post('/flag-recipe', async (req, res) => {
    const { userId, recipeId } = req.body
    const flag = new Flag({
        userId,
        recipeId
    })

    try {
        const isFlagged = await Flag.findOne({ userId, recipeId }) !== null

        if (isFlagged) {
            return res.status(400).json({ message: 'Recipe already flagged.' })
        }
        
        await flag.save()
        
        await Recipe.findByIdAndUpdate(recipeId, { $inc: { flagCount: 1 } })

        return res.status(200).json({ success: true, message: 'Recipe flagged.' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})
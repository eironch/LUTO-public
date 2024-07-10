import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongoose, { Types }  from 'mongoose'
import multer from 'multer'
import { bucket } from './firebaseAdmin.js'
import { v4 as uuidv4 } from 'uuid' 

import User from './models/user.js'
import Preference from './models/preference.js'
import Recipe from './models/recipe.js'
import RecipeOverview from './models/recipeOverview.js'
import Point from './models/point.js'
import Feedback from './models/feedback.js'
import Save from './models/save.js'
import Flag from './models/flag.js'
import Archive from './models/archive.js'
import Follow from './models/follow.js'

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

// mongoose and mongo sandbox routes
app.get('/', (req, res) => {
    res.json('good mourning.')
})

app.post('/create-account', (req, res) => {
    const { username, password } = req.body
    const user = new User({
        username,
        password
    })

    try {
        user.save()
            .then(async (user) => {
                const preference = new Preference({
                    userId: user._id
                })

                await preference.save()

                return res.status(201).json({ success: true, message: 'Account created.' })
            })
            .catch(() => {
                return res.status(202).json({ success: false, message: 'Username exists.' })
            })
    }  catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
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

                    return res.status(200).json({ success: true, payload: { username: user.username, userId: user._id, accountType: user.accountType, profilePicture: user.profilePicture, bio: user.bio }, message: 'User signed in.' })
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

app.get('/check-auth', async (req, res) => {
    const accessToken = req.cookies.authToken
    const decodedAccessToken = verifyToken(accessToken)
    
    try {
        if (accessToken && decodedAccessToken) {
            const user = await User.findById(decodedAccessToken.userId)

            return res.status(200).json({ isAuthenticated: true, payload: { username: user.username, userId: user._id, accountType: user.accountType, profilePicture: user.profilePicture, bio: user.bio }})
        }
    
        const refreshToken = req.cookies.refreshToken
        const decodedRefreshToken = verifyToken(refreshToken)
    
        if (refreshToken && decodedRefreshToken) {
            const user = await User.findById(decodedRefreshToken.userId)

            res.cookie(
                'accessToken',
                generateAccessToken(decodedRefreshToken.userId, decodedRefreshToken.username), 
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600000,
                }
            )
    
            return res.status(200).json({ isAuthenticated: true, payload: { username: user.username, userId: user._id, accountType: user.accountType, profilePicture: user.profilePicture, bio: user.bio }})
        }
    
        return res.status(202).json({ isAuthenticated: false })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
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

    const ingredients = JSON.parse(req.body.ingredients)
    const recipeElements = JSON.parse(req.body.recipeElements).filter(element => !!element)

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

        if (recipeElements && recipeElements.length > 0) {
            recipeElements.forEach((element) => {
                for (let x = 0; x < element.filesLength; x++) {
                    element.files.push(elementLinks[x])
                }
    
                elementLinks.splice(0, element.filesLength)
            })
        }
        
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
   
    return await uploadFileToStorage(recipeImage)
        .then(async recipeUrl => {
            fileLinks.recipeImage = recipeUrl
        })
        .then(async () => {
            const uploadPromises = elementFiles.map(async file => {
                try {
                    const fileUrl = await uploadFileToStorage(file)

                    return fileUrl
                } catch (error) {
                    console.error('Error uploading element file:', error)
                }
            })

            fileLinks.elementFiles = await Promise.all(uploadPromises)
 
            return fileLinks
        })
}

function uploadFileToStorage(file) {
    return new Promise((resolve, reject) => {
        if (!file.size) {
            return resolve('')
        }

        const blob = bucket.file(`media/${uuidv4()}_${uuidv4()}`)
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        })
        
        blobStream.on('error', err => {
            reject(err)
        })

        blobStream.on('finish', async () => {
            try {
                await blob.makePublic()
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

                resolve(publicUrl)
            } catch (err) {
                reject(err)
            }
        })

        // uploads file to the space in the cloud
        blobStream.end(file.buffer)
    })
}

app.post('/give-point', async (req, res) => {
    const { userId, recipeId, pointStatus } = req.body

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

            if (prevStatus.pointStatus === 'positive') {
                await Recipe.findByIdAndUpdate(recipeId, { $inc: { points: -2 } })
            } else if (prevStatus.pointStatus === 'negative') {
                await Recipe.findByIdAndUpdate(recipeId, { $inc: { points: 2 } })
            }

            const points = await Recipe.findById(recipeId).select('points')

            return res.status(200).json({ success: true, message:'Recipe point status changed.', payload: { pointStatus, points } })
        }

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
    const { userId, filters, sort, fetchedRecipeIds } = req.query
    let aggregatedResults, results, recipes
    const pipeline = []

    try {
        const isAdmin = await User.findById(userId).select('accountType')
        console.log(isAdmin)
        const flagCountSelected = isAdmin.accountType === "admin" && 'flagCount'

        if (fetchedRecipeIds && fetchedRecipeIds.length > 0) {
            pipeline.push({ $match: { recipeId: { $nin: fetchedRecipeIds.map(id => new Types.ObjectId(id)) } } })
        }
        
        if (filters && filters.length > 0) {
            pipeline.push({ $match: { tags: { $in: filters } } })
        }

        if (sort.createdAt) {
            pipeline.push({ $sort: { createdAt: -1 } })
        }

        pipeline.push({ $limit: 10 })

        aggregatedResults = await RecipeOverview.aggregate(pipeline)

        results = aggregatedResults.map(result => new RecipeOverview(result))
        recipes = await RecipeOverview.populate(
            results, [
                { path: 'userId', select: 'username' },
                { path: 'recipeId', select: ['points', 'feedbackCount', flagCountSelected]}
            ]
        )

        if (!recipes.length) {
            return res.status(202).json({ status: false, message: 'No recipes found.' })
        }
        
        const pointPromises = recipes.map(async recipe => {
            const recipeId = recipe.recipeId
            const status = await Point.findOne({ userId, recipeId: recipeId._id }).select('pointStatus') 

            const recipeStatsData = {
                recipeId: recipeId._id,
                points: recipeId.points, 
                feedbackCount: recipeId.feedbackCount,
                ...(flagCountSelected && { flagCount: recipeId.flagCount }),
            }

            return {
                ...recipe.toObject(),
                ...recipeStatsData,
                pointStatus: status && status.pointStatus
            }
        })
        
        return Promise.all(pointPromises)
            .then(recipes => {
                if (sort.flagCount) {
                    recipes.sort((a, b) => b.flagCount - a.flagCount)
                }

                return res.status(200).json({ success: true, payload: recipes })
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.get('/search-recipes', async (req, res) => {
    const { userId, searchQuery, filters, sort } = req.query
    let aggregatedResults, results, recipes
    const pipeline = []
    
    try {
        const isAdmin = await User.findById(userId).select('accountType')

        const flagCountSelected = isAdmin.accountType === "admin" && 'flagCount'

        if (filters && filters.length > 0) {
            pipeline.push({ $match: { tags: { $in: filters } } })
        }
        
        pipeline.push({ 
                $match: {
                    $or: [
                        { title: { $regex: searchQuery, $options: 'i' } },
                        { summary: { $regex: searchQuery, $options: 'i' } }
                    ]
                }
            }
        )

        if (sort.createdAt) {
            pipeline.push({ $sort: { createdAt: -1 } })
        }

        pipeline.push({ $limit: 10 })

        aggregatedResults = await RecipeOverview.aggregate(pipeline)
        results = aggregatedResults.map(result => new RecipeOverview(result))
        recipes = await RecipeOverview.populate(
            results, [
                { path: 'userId', select: 'username' },
                { path: 'recipeId', select: ['points', 'feedbackCount', flagCountSelected]}
            ]
        )

        if (!recipes.length) {
            return res.status(202).json({ status: false, message: 'No recipes found.' })
        }
        
        const pointPromises = recipes.map(async recipe => {
            const recipeId = recipe.recipeId
            const status = await Point.findOne({ userId, recipeId: recipeId._id }).select('pointStatus') 

            const recipeStatsData = {
                recipeId: recipeId._id,
                points: recipeId.points, 
                feedbackCount: recipeId.feedbackCount,
                ...(flagCountSelected && { flagCount: recipeId.flagCount }),
            }

            return {
                ...recipe.toObject(),
                ...recipeStatsData,
                pointStatus: status && status.pointStatus
            }
        })
        
        return Promise.all(pointPromises)
            .then(recipes => {
                if (sort.flagCount) {
                    recipes.sort((a, b) => b.flagCount - a.flagCount)
                } else {
                    recipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                }
                
                return res.status(200).json({ success: true, payload: recipes })
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.get('/saved-recipes', async (req, res) => {
    const { userId, filters, fetchedRecipeIds } = req.query

    try {
        const saves = await Save.find({ userId }).sort({ createdAt: -1 })

        if (saves.length === 0) {
            return res.status(202).json({ status: false, message: 'No recipes found.' })
        }

        const pointPromises = saves.map(async save => {
            const { _id, __v, ...recipe} = await RecipeOverview.findOne({ recipeId: save.recipeId })
                .populate([
                    { path: 'userId', select: 'username' },
                    { path: 'recipeId', select: ['points', 'feedbackCount']}
                ]).lean()

            if (filters) {
                if (!filters.some(tag => recipe.tags.includes(tag))) {
                    return
                }
            }

            if (fetchedRecipeIds) {
                if (fetchedRecipeIds.some(id => new Types.ObjectId(id).equals(save.recipeId))) {
                    return
                }
            }

            const status = await Point.findOne({ userId, recipeId: save.recipeId }).select('pointStatus') 

            const recipeStatsData = {
                recipeId: recipe.recipeId._id,
                points: recipe.recipeId.points, 
                feedbackCount: recipe.recipeId.feedbackCount,
            }
            
            return {
                ...recipe,
                ...recipeStatsData,
                pointStatus: status && status.pointStatus
            }
        })
        
        return Promise.all(pointPromises)
            .then(recipes => {
                recipes = recipes.filter(recipe => recipe)

                if (recipes.length === 0) {
                    return res.status(202).json({ status: false, message: 'No recipes found.' })
                }

                return res.status(200).json({ success: true, payload: recipes })
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.get('/popular-recipes', async (req, res) => {
    const { userId, filters } = req.query
    const pipeline = []

    try {
        if (filters) {
            pipeline.push(
                { 
                    $match: { tags: { $in: filters } }
                }
            )
        }

        pipeline.push({ $match: { points: { $gt : 0 } } })
        pipeline.push({ $sort: { points: -1 } })
        pipeline.push({ $limit: 10 })
        
        const popular = await Recipe.aggregate(pipeline)
        
        const pointPromises = popular.map(async popular => {
            const recipe = await RecipeOverview.findOne({ recipeId: popular._id })
                .populate([
                    { path: 'userId', select: 'username' },
                    { path: 'recipeId', select: ['points', 'feedbackCount']}
                ]).lean()
            
            const status = await Point.findOne({ userId, recipeId: popular._id }).select('pointStatus') 

            const recipeStatsData = {
                recipeId: recipe.recipeId._id,
                points: recipe.recipeId.points, 
                feedbackCount: recipe.recipeId.feedbackCount,
            }
            
            return {
                ...recipe,
                ...recipeStatsData,
                pointStatus: status && status.pointStatus
            }
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

app.get('/user-recipes', async (req, res) => {
    const { userId, authorName, sort, fetchedRecipeIds } = req.query
    console.log(fetchedRecipeIds)
    try {
        const user = await User.find({ username: authorName })

        if (!user.length) {
            return res.status(400).json({ message: 'No such user found.' })
        }

        const isAdmin = await User.findById(userId).select('accountType')

        const flagCountSelected = isAdmin.accountType === "admin" && 'flagCount'

        const recipes = await RecipeOverview.find({ userId: user[0]._id, recipeId: { $nin: fetchedRecipeIds } })
            .populate([
                { path: 'userId', select: 'username' },
                { path: 'recipeId', select: ['points', 'feedbackCount', flagCountSelected]}
            ]).sort({ createdAt: -1 }).limit(10)


        if (recipes.length === 0) {
            return res.status(202).json({ status: false, message: 'No recipes found.' })
        }

        const pointPromises = recipes.map(async recipe => {
            const recipeId = recipe.recipeId
            const status = await Point.findOne({ userId: user._id, recipeId: recipeId._id }).select('pointStatus') 

            const recipeStatsData = {
                recipeId: recipeId._id,
                points: recipeId.points, 
                feedbackCount: recipeId.feedbackCount,
                ...(flagCountSelected && { flagCount: recipeId.flagCount }),
            }

            return {
                ...recipe.toObject(),
                ...recipeStatsData,
                pointStatus: status && status.pointStatus
            }
        })
        
        return Promise.all(pointPromises)
            .then(recipes => {
                if (sort.flagCount) {
                    recipes.sort((a, b) => b.flagCount - a.flagCount)
                }
  
                return res.status(200).json({ success: true, payload: recipes })
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})



app.get('/get-recipe', async (req, res) => {
    const { recipeId, userId } = req.query

    try {
        const recipe = await Recipe.findById( recipeId )
            .populate({
                path: 'userId',
                model: 'User',
                select: ['username', 'profilePicture']
            })
            .lean()
        
        if (!recipe) {
            return res.status(400).json({ message: 'No such recipe found.' })
        }

        const status = await Point.findOne({ userId, recipeId }).select('pointStatus')

        const isSaved = await Save.findOne({ userId, recipeId }) !== null
    
        const response = {
            userInfo: { username: recipe.userId.username, profilePicture: recipe.userId.profilePicture },
            recipeContents: { ...recipe },
            recipeStatus: { pointStatus: status && status.pointStatus, isSaved }
        }

        return res.status(200).json({ success: true, payload: response })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.post('/submit-feedback', async (req, res) => {
    const { userId, recipeId, text } = req.body

    const feedback = new Feedback({
        userId,
        recipeId,
        text
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

app.get('/get-feedbacks', async (req, res) => {
    const { recipeId } = req.query

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
            select: ['username', 'profilePicture']
        })
        console.log(feedbacks)
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

app.post('/remove-recipe', async (req, res) => {
    const { removerUserId, recipeId } = req.body

    try {
        const recipeResult =  await Recipe.findById(recipeId).lean()

        if (!recipeResult) {
            return res.status(400).json({ message: 'Error removing recipe.', err })
        }

        const { _id, __v, ...recipe } = recipeResult

        const archive = new Archive({
            removerUserId,
            ...recipe
        })

        await archive.save()

        await Recipe.findByIdAndDelete(recipeId)
        
        await RecipeOverview.deleteOne({ recipeId })

        return res.status(200).json({ success: true, message: 'Recipe removed.' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.post('/allow-recipe', async (req, res) => {
    const { recipeId } = req.body

    try {
        await Recipe.findByIdAndUpdate(recipeId, { $set: { flagCount: 0 } })

        return res.status(200).json({ success: true, message: 'Recipe allowed.' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.', err })
    }
})

app.get('/get-preferences', async (req, res) => {
    const { userId } = req.query

    try {
        const preferences = await Preference.findOne({ userId })

        return res.status(201).json({ success: true, message: 'User preference found.', payload: { preferences } })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
})


app.post('/save-filters', async (req, res) => {
    const { userId, filters } = req.body

    try {
        await Preference.findOneAndUpdate({ userId }, { $set: { filters } }, { upsert: true })

        return res.status(201).json({ success: true, message: 'User filters updated.' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
})

app.get('/get-author-info', async (req, res) => {
    const { userId, authorName } = req.query

    try {
        const user = await User.findOne({ username: authorName })
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' })
        }

        const isFollowed = await Follow.findOne({ userId, followedId: user._id }) !== null

        const follows = await User.findById(user._id).select('followCount')

        const followerResults = await Follow.find({ followedId: user._id }).populate({
            path: 'userId',
            select: ['username', 'profilePicture']
        }).limit(10)
        console.log(user)
        const followers = followerResults.map(follower => { return { username: follower.userId.username, profilePicture: follower.userId.profilePicture } })
       
        if (!isFollowed) {
            return res.status(200).json({ status: true, payload: { isFollowed: false, followCount: follows.followCount, followers: followers, profilePicture: user.profilePicture, bio: user.bio } })
        }

        return res.status(200).json({ status: true, payload: { isFollowed: true, followCount: follows.followCount, followers: followers, profilePicture: user.profilePicture, bio: user.bio  } })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
})

app.post('/follow-user', async (req, res) => {
    const { userId, authorName } = req.body

    try {
        const user = await User.findOne({ username: authorName })
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' })
        }

        const isFollowed = await Follow.findOne({ userId, followedId: user._id }) !== null
        
        if (isFollowed) {
            await Follow.findOneAndDelete({ userId, followedId: user._id })

            await User.findByIdAndUpdate(user._id, { $inc: { followCount: -1 } })

            const followerResults = await Follow.find({ followedId: user._id }).populate({            path: 'userId',
                path: 'userId',
                select: ['username', 'profilePicture']
            }).limit(10)
    
            const followers = followerResults.map(follower => { return { username: follower.userId.username, profilePicture: follower.userId.profilePicture } })
    
            const follows = await User.findById(user._id).select('followCount')

            return res.status(200).json({ status: true, message: 'User unfollowed.', payload: { isFollowed: false, followCount: follows.followCount, followers } })
        }

        const follow = new Follow({
            userId,
            followedId: user._id
        })

        await follow.save()
            .then(async () => {
                await User.findByIdAndUpdate(user._id, { $inc: { followCount: 1 } })

                const followerResults = await Follow.find({ followedId: user._id }).populate({            path: 'userId',
                    path: 'userId',
                    select: ['username', 'profilePicture']
                }).limit(10)
        
                const followers = followerResults.map(follower => { return { username: follower.userId.username, profilePicture: follower.userId.userName } })
       
                const follows = await User.findById(user._id).select('followCount')
                
                return res.status(201).json({ success: true, message: 'User followed.', payload: { isFollowed: true, followCount: follows.followCount, followers }})
            })
            .catch(() => {
                return res.status(202).json({ success: false, message: 'Error following user.' })
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
})

app.post('/get-followers', async (req, res) => {
    const { authorName } = req.body

    try {
        const user = await User.findOne({ username: authorName })
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' })
        }

        const followers = await Follow.find({ followedId: user._id })

        return res.status(200).json({ success: true, message: 'Got user followers.', payload: { followers }})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
})

app.post('/change-password', async (req, res) => {
    const { userId, password } = req.body
console.log("dasdasd;sa")
    try {
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' })
        }

        user.password = password

        await user.save()

        return res.status(200).json({ success: true, message: 'Password changed.'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
})

app.post('/change-profile-picture', upload.any(), async (req, res) => {
    const { userId } = req.body
    const profilePicture = req.files

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' })
        }

        const profilePictureLink = await uploadFileToStorage(profilePicture[0])

        user.profilePicture = profilePictureLink

        await user.save()
        
        return res.status(201).json({ success: true, message: 'Profile picture changed.'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
})

app.post('/change-bio', async (req, res) => {
    const { userId, bio } = req.body

    try {
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' })
        }

        user.bio = bio

        await user.save()

        return res.status(200).json({ success: true, message: 'Bio changed.'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message:'Internal server error.', err})
    }
})

app.get('/log-out', (req, res) => {
    res.clearCookie('accessToken', { path: '/' })
    res.clearCookie('refreshToken', { path: '/' })

    return res.status(200).json({ success: true, message: 'Logged Out' })
})
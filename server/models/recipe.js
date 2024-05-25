import mongoose from 'mongoose'

const Schema = mongoose.Schema

const elementSchema = new Schema({
    contentType: {
        type: String,
        require: true,
    },
    contents: [String],
}, { _id: false })

const recipeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    categories: {
        type: [String],
    },
    tags: {
        type: [String],
    },
    recipeImage:{
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    summary: {
        type: String,
    },
    ingredients: {
        type: [String],
    },
    recipeElements: {
        type: [elementSchema]
    },
}, { timestamps: true })

const Recipe = mongoose.model('Recipe', recipeSchema)
export default Recipe
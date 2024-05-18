import mongoose from 'mongoose'

const Schema = mongoose.Schema

const recipeSchema = new Schema({
    userId: {
        type: String,
        ref: 'User',
        require: true
    },
    categories: {
        type: [String]
    },
    tags: {
        type: [String]
    },
    headline: {
        type: String,
        require: true
    },
    ingredients: {
        type: [String]
    },
}, { timestamps: true })

const Recipe = mongoose.model('Recipe', recipeSchema)
export default Recipe
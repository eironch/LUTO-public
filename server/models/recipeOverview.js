import mongoose from 'mongoose'

const Schema = mongoose.Schema

const recipeOverviewSchema = new Schema({
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
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
}, { timestamps: true })

const RecipeOverview = mongoose.model('RecipeOverview', recipeOverviewSchema)
export default RecipeOverview
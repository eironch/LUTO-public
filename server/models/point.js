import mongoose from 'mongoose'

const Schema = mongoose.Schema

const pointSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        require: true
    },
    pointStatus: {
        type: String,
        require: true
    }
}, { timestamps: true })

const Point = mongoose.model('Point', pointSchema)
export default Point
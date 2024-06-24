import mongoose from 'mongoose'

const Schema = mongoose.Schema

const feedbackSchema = new Schema({
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
    text: {
        type: String,
        require: true
    },
    flagCount: {
        type: Number,
        default: 0
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

const Feedback = mongoose.model('Feedback', feedbackSchema)
export default Feedback
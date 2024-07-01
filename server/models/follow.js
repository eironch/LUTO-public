import mongoose from 'mongoose'

const Schema = mongoose.Schema

const followSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
}, { timestamps: { createdAt: true, updatedAt: false } })

const Follow = mongoose.model('Follow', followSchema)
export default Follow
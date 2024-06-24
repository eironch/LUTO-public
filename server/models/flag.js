import mongoose from 'mongoose'

const Schema = mongoose.Schema

const flagSchema = new Schema({
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
}, { timestamps: { createdAt: true, updatedAt: false } })

const Flag = mongoose.model('Flag', flagSchema)
export default Flag
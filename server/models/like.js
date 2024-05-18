import mongoose from 'mongoose'

const Schema = mongoose.Schema

const approveSchema = new Schema({
    RecipeId: {
        type: String,
        ref: 'Recipe',
        require: true
    },
    userId: {
        type: String,
        ref: 'User',
        require: true
    },
}, { timestamps: { createdAt: true, updatedAt: false } })

const Aprrove = mongoose.model('Aprrove', approveSchema)
export default Aprrove
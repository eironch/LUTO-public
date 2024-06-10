import mongoose from 'mongoose'

const Schema = mongoose.Schema

const preferenceSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    filters: {
        type: [string]
    },
    darkMode: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { timestamps: { createdAt: true, updatedAt: false } })

const Preference = mongoose.model('Preference', preferenceSchema)
export default Preference
import mongoose from "mongoose";
const{Schema} = mongoose

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
    type: [String],
    enum: ['User', 'Admin', 'Editor'],
    default: ['User']  // Default role is 'User'
    },
    refresh_token: {
    type: String,
    required: false,
    default: "",
},
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

export const User =mongoose.model('User', UserSchema)

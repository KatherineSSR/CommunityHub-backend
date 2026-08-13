
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    username: {
        required: true,
        type: String,
        unique: true
    },

    password: {
        type: String,
        default: ''
    },

    googleId: {
        type: String,
        default: null
    },

    email: {
        required: true,
        type: String,
        unique: true
    },

    name: {
        required: true,
        type: String
    },

    profileImage: {
        type: String,
        default: ''
    },

    date: {
        type: Date,
        default: Date.now
    },

    role: {
        type: String,
        enum: ['admin', 'manager', 'user'],
        default: 'user'
    },

    //revisar luego
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Event',
        default: []
    }
});

UserSchema.statics.createUser = function (data) {
    return this.create(data);
};

module.exports = mongoose.model('User', UserSchema);


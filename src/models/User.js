
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    name: {
        required: true,
        type: String,
    },

    lastName: {
        required: true,
        type: String,
    },

    password: {
        type: String,
        default: ''
    },

    email: {
        required: true,
        type: String,
        unique: true
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
        enum: ['admin', 'organizer', 'user'],
        default: 'user'
    }


});

UserSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};

UserSchema.statics.createUser = function (data) {
    return this.create(data);
};

module.exports = mongoose.model('User', UserSchema);


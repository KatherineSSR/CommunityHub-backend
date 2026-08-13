const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    tittle: {
        required: true,
        type: String,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'Other'
    },
    date: {
        type: Date,
        default: Date.now
    },
    ubication: {
        type: String,
        default: ''
    },
    maxCapacity: {
        type: Number,
        default: 1
    },
    img: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    creationDate: {
        type: Date,
        default: Date.now
    }

});

module.export = mongoose.model('Event', UserSchema);
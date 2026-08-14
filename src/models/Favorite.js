const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can only favorite an event once
FavoriteSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);

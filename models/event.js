const mongoose = require('mongoose');
const eventSchema = {
    name: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
};

const Event = mongoose.model('event', eventSchema);

module.exports = Event;
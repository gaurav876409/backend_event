const Event = require('../models/event.js');
const Attendee = require("../models/attendee.js");
const createEvent = async (req, res) => {
    const eventBody = req.body;
    const event = new Event(eventBody);
    await event.save();
    res.json({
        success: true,
        message: "Event created successfully"
    })
}
const getEvents = async (req, res) => {
    const params = req.query;
    const queryObject = {
        name: {
            $regex: new RegExp(params.searchKey),
            $option: 'i'
        }
    }
    const events = await Event.find({ queryObject });
    res.json({
        success: true,
        results: events
    })
}

// const joinEvent = async (req, res) => {
//     try {
//         const { eventId, userId } = req.body;
//         const event = await Event.findById(eventId);
//         if (!event) {
//             return res.status(404).json({ message: 'Event not found' });
//         }
//         if (event.attendees.includes(userId)) {
//             return res.status(400).json({ message: 'User is already an attendee' });
//         }
//         event.attendees.push(userId);
//         await event.save();

//         res.json({ success: true, message: 'Successfully joined the event' });
//     } catch (error) {
//         console.error('Error joining event:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

const joinEvent = async (req, res) => {
    const alreadyJoined = await Attendee.findOne({
        eventId: req.body.eventId,
        userId: req.user._id
    });
    if (alreadyJoined) {
        return res.status(400).json({
            success: false,
            message: "User has already joined this event"
        })
    }
    const attendee = new Attendee({
        eventId: req.body.eventId,
        userId: req.user._id
    });
    await attendee.save();
    res.json({ success: true, message: "Event joined successfully" });
};


    module.exports = {
    createEvent,
    getEvents,
    joinEvent
}
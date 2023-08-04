const express = require('express');
const router = new express.Router();

const eventController = require("../controllers/event.js")

router.post("/create", eventController.createEvent);
router.get("/list", eventController.getEvents);
router.post("/join", eventController.joinEvent);

module.exports = router;
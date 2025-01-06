const express = require('express');
const router = express.Router();
const { getCalendarSettings, addDatesToCalendarSettings } = require('../controllers/settings');

router.get('/', getCalendarSettings);

router.put('/', addDatesToCalendarSettings);

module.exports = router;
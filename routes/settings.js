const express = require('express');
const router = express.Router();
const { getCalendarSettings, addDatesToCalendarSettings } = require('../controllers/settings');

router.get('/', getCalendarSettings);

router.put('/wax', addDatesToCalendarSettings);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getCalendarSettings, addDatesToCalendarSettings, removeDateFromCalendarSettings } = require('../controllers/settings');

router.get('/', getCalendarSettings);

router.put('/wax', addDatesToCalendarSettings);

router.delete('/wax', removeDateFromCalendarSettings);

module.exports = router;
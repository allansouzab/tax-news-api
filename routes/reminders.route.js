const express = require('express');
const router = express.Router();
const autenticator = require('../middleware/autenticator');
const RemindersController = require('../controllers/reminders.controllers');

router.get('/', autenticator.login, RemindersController.getReminders);
router.post('/', autenticator.login, RemindersController.postReminder);
router.delete('/:id_reminder', autenticator.login, RemindersController.deleteReminder);

module.exports = router;
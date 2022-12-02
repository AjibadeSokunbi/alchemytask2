const express = require('express');

const Controller = require('./alchemy');

const router = express.Router();

router.post('/savePost', Controller.savePost);
router.post('/highestSendersAddress', Controller.findAddress);

module.exports = router;
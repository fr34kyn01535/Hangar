"use strict";
const router = require('express').Router();
const db = require('../../../models/index');

router.get('/', function(req, res) {
    res.send('packageBaseAddress');
});

module.exports = router;
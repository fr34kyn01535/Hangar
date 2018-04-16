"use strict";
const router = require('express').Router();
const db = require('../../../models/index');

router.get('/:package/index.json', function(req, res) {
    res.send('registrationsBaseUrl');
});

module.exports = router;
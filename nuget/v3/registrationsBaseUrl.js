"use strict";
var router = require('express').Router();
var mysql  = require('mysql').createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_NAME
});

router.get('/', function(req, res) {
    res.send('registrationsBaseUrl');
});

module.exports = router;
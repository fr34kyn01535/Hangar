"use strict";
const router = require('express').Router();
const db = require('../../../models/index');

// https://docs.microsoft.com/en-us/nuget/api/package-publish-resource#push-a-package
router.put('/', function(req, res) {
    if(!req.authenticated) return res.status(401).end();
    res.status(201); //created
    res.end();
    //res.status(400); //invalid package
    //res.status(409); //already exists
});

// https://docs.microsoft.com/en-us/nuget/api/package-publish-resource#delete-a-package
router.delete('/:id/:version', function(req, res) {
    if(!req.authenticated) res.status(401).end();
  res.status(204); //deleted
  res.end();
  //res.status(404); //not found
});

// https://docs.microsoft.com/en-us/nuget/api/package-publish-resource#relist-a-package
router.post('/:id/:version', function(req, res) {
    if(!req.authenticated) res.status(401).end();
    res.status(200); //relisted
    res.end();
    //res.status(404); //not found
});

module.exports = router;
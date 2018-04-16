"use strict";
const router = require('express').Router();
const db = require('../../../models/index');

class SearchResultResponse{
    constructor(totalHits, data){
        this.totalHits = totalHits;
        this.data = data;
    }
}

class SearchResultResponseItem{
    constructor(id, version, versions){
        this.id = id;
        this.version = version;
        this.versions = versions;
    
        this.description = "";
        this.authors = [];
        this.iconUrl = "";
        this.licenseUrl = "";
        this.owners = [];
        this.projectUrl = "";
        this.registration = "";
        this.summary = "";
        this.tags = [];
        this.title = "";
        this.totalDownloads = 0;
        this.verified = false;
    }
}

class SearchResultResponseItemVersion{
    constructor(id, version, downloads){
        this.id = id;
        this.version = version;
        this.downloads = downloads;
    }
}

router.get('/', function(req, res) {
    var query = req.query.q = "";
    var skip = req.query.skip || 0;
    var take = req.query.skip || -1;
    var preRelease = req.query.prerelease || false;
    var semVerLevel = req.query.semVerLevel;

    res.send('searchQueryService');
});

module.exports = router;
"use strict";
const router = require('express').Router();
const semver = require('semver');
const db = require('../../../models/index');

class Catalog{
    constructor(commitId, commitTimeStamp,count, items){
        this.commitId = commitId;
        this.commitTimeStamp = commitTimeStamp;
        this.count = count;
        this.items = items;
    }
}

class Package{
    constructor(packageContent){
        this.commitId = packageContent.commitId;
        this.commitTimeStamp = packageContent.commitTimeStamp;
        this.packageContent = process.env.ADDRESS + '/packages/'+packageContent.id+'/'+packageContent.version+'/'+packageContent.id+'-'+packageContent.version+'.nupkg';
        this.registration = process.env.ADDRESS + '/registration/'+packageContent.id+'/index.json';

        this.catalogEntry = {
            authors : packageContent.authors,
            description : packageContent.description,
            iconUrl : packageContent.iconUrl,
            id: packageContent.id,
            language: packageContent.language,
            licenseUrl : packageContent.licenseUrl,
            listed : packageContent.listed,
            minClientVersion : packageContent.minClientVersion,
            packageContent: process.env.ADDRESS + '/packages/'+packageContent.id+'/'+packageContent.version+'/'+packageContent.id+'-'+packageContent.version+'.nupkg',
            projectUrl : packageContent.projectUrl,
            published : packageContent.published,
            requireLicenseAcceptance: packageContent.requireLicenseAcceptance,
            summary : packageContent.summary,
            tags : packageContent.tags ? packageContent.tags.split(",").map(m => m.trim()) : "",
            title : packageContent.title,
            version : packageContent.version
        }
    }
}



router.get('/:package/index.json', function(req, res) {
    let id = req.params.package;
    db.Package.findAll({
        where:{ 
            id : id
        }   
    }).then(allresults => {
        let versions = allresults;
        versions = versions.sort((a,b) => { return b.commitTimeStamp - a.commitTimeStamp });
        versions = versions.sort((a,b) => { return semver.gt(semver.coerce(a.version),semver.coerce(b.version)) });
    
        let commitId = versions[0].commitId;
        let commitTimeStamp = versions[0].commitTimeStamp;

        let packages = versions.map(v => new Package(v));
        let catalogPage = new Catalog(commitId, commitTimeStamp,packages.length,packages);
        let catalogRoot = new Catalog(commitId, commitTimeStamp, 1, [catalogPage]);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(catalogRoot,null,'\t'));
    })

    
});

module.exports = router;
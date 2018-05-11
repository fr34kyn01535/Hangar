"use strict";
const router = require('express').Router();
const semver = require('semver');
const fs = require('fs');
const db = require('../../../models/index');

class Catalog{
    constructor(count, items){
        this.count = count;
        this.items = items;
    }
}

class CatalogPage{
    constructor(count, items,lower,upper){
        this.count = count;
        this.items = items;
        this.lower = lower;
        this.upper = upper;
        this["@id"] = process.env.ADDRESS + '/registration/'+items[0].catalogEntry.id+'/index.json#page/'+lower+'/'+upper;
    }
}

class Package{
    constructor(packageContent){
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

class VersionPackage{
    constructor(packageContent){
        this.packageContent = process.env.ADDRESS + '/packages/'+packageContent.id+'/'+packageContent.version+'/'+packageContent.id+'-'+packageContent.version+'.nupkg';
        this.registration = process.env.ADDRESS + '/registration/'+packageContent.id+'/index.json';
        this.published = packageContent.published;
        this.listed = packageContent.listed;
        this["@id"] = this.registration;
    }
}


router.get('/:package/index.json', function(req, res) {
    let id = req.params.package;
    db.Package.findAll({
        where:{ 
            id : id
        }   
    }).then(allresults => {
        if(!allresults || allresults.length == 0){
            res.status(404).end();
            return;
        }
        let versions = allresults;
        versions = versions.sort((a,b) => { return b.published - a.published });
        versions = versions.sort((a,b) => { return semver.lt(semver.coerce(a.version),semver.coerce(b.version)) });
        let packages = versions.map(v => new Package(v));
        let catalogPage = new CatalogPage(packages.length,packages,versions[versions.length -1].version,versions[0].version);
        let catalogRoot = new Catalog( 1, [catalogPage]);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(catalogRoot,null,'\t'));
    })

    
});



router.get('/:package/:version.json', function(req, res) {
    let id = req.params.package;
    let version = req.params.version;
    db.Package.find({
        where:{ 
            id : id,
            version: version
        }   
    }).then(result => {
        if(result == null) res.status(404).end();
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(new VersionPackage(result),null,'\t'));
        }
    })

    
});
module.exports = router;
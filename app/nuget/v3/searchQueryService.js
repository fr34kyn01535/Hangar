"use strict";
const router = require('express').Router();
const db = require('../../../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const semver = require('semver');

class QueryResult{
    constructor(totalHits, packages){
        this.totalHits = totalHits;
        this.data = packages;
    }
}

class Package{
    constructor(packageContent,versions,totalDownloads){
        this.id = packageContent.id;
        this.version = packageContent.version;
        this.versions = versions;
        this.registration = process.env.ADDRESS + '/registration/'+packageContent.id+'/index.json',
        this["@id"] = this.registration;
        this["@type"] = "Package";
        this.description = packageContent.description;
        this.authors = packageContent.authors ? packageContent.authors.split(',').map(m => m.trim()) : '';
        this.iconUrl = packageContent.iconUrl;
        this.licenseUrl = packageContent.licenseUrl;
        this.projectUrl = packageContent.projectUrl;
        this.summary = packageContent.summary;
        this.tags = packageContent.tags ? packageContent.tags.split(",").map(m => m.trim()) : "";
        this.title = packageContent.title;
        this.totalDownloads = totalDownloads || 0;
        this.verified = packageContent.verified;
    }
}

class Version{
    constructor(id,version, downloads){
        this["@id"] = process.env.ADDRESS + '/registration/'+id+'/'+version+'.json'
        this.version = version;
        this.downloads = downloads || 0;
    }
}

router.get('/', function(req, res) {
    var query = req.query.q = "";
    var skip = req.query.skip ? parseInt(req.query.skip) : 0;
    var take = req.query.take ? parseInt(req.query.take) : 20;
    var preRelease = req.query.prerelease == true || req.query.prerelease == "true" || false;
    var semVerLevel = req.query.semVerLevel;


    db.Package.findAll({
        where: {
            [Op.and]:[
                {
                    [Op.or]: [
                        {
                            summary: {
                                [Op.like]: '%'+query+'%'
                            }
                        },
                        {
                            id: {
                                [Op.like]: '%'+query+'%'
                            }
                        },
                        {
                            title: {
                                [Op.like]: '%'+query+'%'
                            }
                        }
                    ]
                },{
                    verified: !preRelease
                }
            ]
            
        },
        attributes: ['id'],
        group: ['id'],
        offset: skip,
        limit: take
     })
     .then(result => {
        let ids = result.map(r => r.id);
        db.Package.findAll({
            where:{ 
                id :{
                    [Op.in]: ids
                }
            }   
        }).then(allresults => {
            let results = [];
            for(let id of ids){
                let versions = allresults.filter(result => result.id == id);
                versions = versions.sort((a,b) => { return b.published - a.published });
                versions = versions.sort((a,b) => { return semver.lt(semver.coerce(a.version),semver.coerce(b.version)) });
                let totalDownloads = versions.reduce((a, b) => a.downloads+b.downloads, 0);
                results.push(new Package(versions[0],versions.map(v => new Version(id,v.version,v.downloads)),totalDownloads));
            }

            let response = new QueryResult(results.length,results);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response,null,'\t'));
        })

      
     });

});

module.exports = router;
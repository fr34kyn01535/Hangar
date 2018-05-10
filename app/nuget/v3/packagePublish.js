"use strict";

const yauzl = require('yauzl');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'temp/' });
const xml2js = require('xml2js');
const semver = require('semver');
const uuid = require('uuid/v4');
const xmlParser = new xml2js.Parser({explicitArray : false});
const router = require('express').Router();
const db = require('../../../models/index');

// https://docs.microsoft.com/en-us/nuget/api/package-publish-resource#push-a-package
router.put('/', upload.single('package'),function(req, res) {
    if(!req.authenticated) return res.status(401).end();
    try {
        let files = [];
        let nuspecText = '';

        if(path.extname(req.file.originalname) != '.nupkg')
            throw "Unsupported file extension";

        yauzl.open(req.file.path, {lazyEntries: true}, function(err, zipfile) {
            if (err) throw err;
            
            zipfile.on("end", function() {
                xmlParser.parseString(nuspecText, function (err, nuspec) {
                    let metadata = nuspec.package.metadata;
                    
                    let properties = {
                        id: metadata.id,
                        version: metadata.version,
                        description: metadata.description,
                        authors: metadata.authors,

                        title: metadata.title || "",
                        projectUrl: metadata.projectUrl || "",
                        licenseUrl: metadata.licenseUrl || "",
                        iconUrl: metadata.iconUrl || "",
                        requireLicenseAcceptance: metadata.requireLicenseAcceptance || false,
                        developmentDependency: metadata.developmentDependency || false,
                        summary: metadata.summary || "",
                        releaseNotes: metadata.releaseNotes || "",
                        copyright: metadata.copyright || "",
                        language: metadata.language || "",
                        tags: metadata.tags || "",

                        verified: false,
                        published: new Date(),
                        commitTimeStamp: new Date(),
                        commitId: uuid(),
                        downloads: 0,
                        listed: true
                    }

                    if(!properties.id || !properties.version || !properties.description || !properties.authors){
                        fs.unlinkSync(req.file.path);
                        res.status(400);
                        res.end(); 
                        return;
                    }

                    function renameAndReturn(np){
                        !fs.existsSync('packages') && fs.mkdirSync('packages');
                        !fs.existsSync('packages/'+properties.id) && fs.mkdirSync('packages/'+properties.id);
                        fs.renameSync(req.file.path,'packages/'+properties.id+'/'+properties.id+'-'+properties.version+'.nupkg');
                        res.status(201);
                        res.end();
                    }

                    db.Package.findOne({ where: {id: properties.id, version: properties.version} }).then(p => {
                        if(p == null){
                            db.Package.create(properties).then(renameAndReturn).catch(e => {
                                throw e;
                            })
                        }else{
                            p.update(properties).then(renameAndReturn).catch(e => {
                                throw e;
                            })
                        }
                    });
                });
            });
            
            zipfile.on("entry", function(entry) {
                if (/\/$/.test(entry.fileName)) {
                    zipfile.readEntry();
                } else {
                    files.push(entry.fileName);
                    if(path.extname(entry.fileName) == '.nuspec'){
                        zipfile.openReadStream(entry, function(err, readStream) {
                            if (err) throw err;
                            readStream.on('data', data => {
                                nuspecText += data.toString();
                            });
                            readStream.on("end", function() {
                                zipfile.readEntry();
                            });
                        });
                    }
                    else
                        zipfile.readEntry();
                }
            });
            
            zipfile.readEntry();
        });

    }catch(e){
        console.error(e);
        res.status(400);
        res.end();
        fs.unlinkSync(req.file.path);
    }
});

// https://docs.microsoft.com/en-us/nuget/api/package-publish-resource#delete-a-package
router.delete('/:id/:version', function(req, res) {
    if(!req.authenticated) res.status(401).end();
    var file = './packages/' +req.params.id+ '/' + req.params.id + "-" + req.params.version +".nupkg";
    if(fs.existsSync(file)){

        db.Package.findOne({ where: {id: req.params.id, version: req.params.version} }).then(p => {
            if(p == null){
                res.status(404);
                res.end();
                return;
            }else{
                p.destroy();
                fs.unlinkSync(file);
                res.status(204); 
                res.end();
            }
        });
    }else{
        res.status(404);
        res.end();
    }
});

// https://docs.microsoft.com/en-us/nuget/api/package-publish-resource#relist-a-package
router.post('/:id/:version', function(req, res) {
    if(!req.authenticated) res.status(401).end();
    res.status(404); 
    res.end();
});

module.exports = router;
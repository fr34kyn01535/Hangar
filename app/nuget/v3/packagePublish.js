"use strict";

const yauzl = require('yauzl');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'temp/' });
const xml2js = require('xml2js');
const semver = require('semver');
const xmlParser = new xml2js.Parser({explicitArray : false});
const router = require('express').Router();
const db = require('../../../models/index');

// https://docs.microsoft.com/en-us/nuget/api/package-publish-resource#push-a-package
// This is just uploading the file right now. To-Do: Register the entry in db
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
                    
                    let valid = true;
                    if(valid){
                        fs.rename(req.file.path,'packages/'+metadata.id+'-'+metadata.version+'.nupkg');
                        res.status(201);
                        res.end();
                    }else{
                        fs.unlink();
                        res.status(400);
                        //res.status(409); //already exists
                        res.end();
                    }
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
// This is just deleting the file right now. To-Do: Just disable the entry in db instead
router.delete('/:id/:version', function(req, res) {
    if(!req.authenticated) res.status(401).end();
    var file = './packages/' + req.params.id + "-" + req.params.version +".nupkg";
    if(fs.existsSync(file)){
        fs.unlinkSync(file);
        res.status(204); 
        res.end();
    }else{
        res.status(404);
        res.end();
    }
});

// https://docs.microsoft.com/en-us/nuget/api/package-publish-resource#relist-a-package
router.post('/:id/:version', function(req, res) {
    if(!req.authenticated) res.status(401).end();
    res.status(200); //relisted
    res.end();
    //res.status(404); //not found
});

module.exports = router;
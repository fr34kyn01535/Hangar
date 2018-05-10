"use strict";
const router = require('express').Router();
const fs = require('fs');
const db = require('../../../models/index');

router.get('/:package/index.json', function(req, res) {
  let id = req.params.package;
    db.Package.findAll({
      where:{ 
          id : id
      },
      attributes: ['version']
  }).then(versions => {
      var response = {versions : versions.map(v => v.version)};
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(response,null,'\t'));
  })
});

// https://docs.microsoft.com/en-us/nuget/api/package-base-address-resource#download-package-content-nupkg
router.get('/:package/:version/*.nupkg', function(req, res) {
  let id = req.params.package;
  let version = req.params.version;
  var file = './packages/' +id+'/'+version+'/'+ id + "-" + version +".nupkg";
  if(fs.existsSync(file)){
    res.download(file);
  } else
    res.status(404);
});

// https://docs.microsoft.com/en-us/nuget/api/package-base-address-resource#download-package-manifest-nuspec
router.get('/:package/:version/*.nuspec', function(req, res) {
  let id = req.params.package;
  let version = req.params.version;
  var file = './packages/' +id+'/'+version+'/'+ id +".nuspec";
  if(fs.existsSync(file)){
    res.download(file);
  } else
    res.status(404);
});
module.exports = router;
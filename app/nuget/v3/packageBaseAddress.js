"use strict";
const router = require('express').Router();

router.get('/:package/index.json', function(req, res) {
    res.send({
      "versions": [
        "0.5.0",
        "0.7.0",
        "0.11.0",
        "0.12.0",
        "0.14.0",
        "1.0.0"
      ]
    });
});

// https://docs.microsoft.com/en-us/nuget/api/package-base-address-resource#download-package-content-nupkg
router.get('/:package/:version/:package.:version.nupkg', function(req, res) {
  res.status(200).send("test");
  //res.status(404);
});

// https://docs.microsoft.com/en-us/nuget/api/package-base-address-resource#download-package-manifest-nuspec
router.get('/:package/:version/:package.nuspec', function(req, res) {
  res.status(200).send("test");
  //res.status(404);
});
module.exports = router;
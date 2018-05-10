"use strict";
require('dotenv').config();

const db = require('./models/index');
db.sequelize.sync().then(() => {

    db.User.findOrCreate(
      {
        where: {
          id: 1
        },
      defaults: { 
        id: 1,
        userName: 'Admin',
        apiKey: "test123"
      }
    });

    console.log("Database up to date.");
}).catch(error => {
    console.log("Error syncing database:",error);
    process.exit(1);
});

const app = require('express')();
app.use(require('body-parser').json());

app.use(function (req, res, next) {
  var apiKey = req.headers["x-nuget-apikey"];
  if(!apiKey){
    req.authenticated = false;
    next();
  }
  else
  db.User.findOne({ where: {apiKey: apiKey} }).then(user => {
    req.authenticated = user != null;
    req.user = user;
    next();
  })
});


app.get('/', function(req, res){ 
    res.redirect('/index.json');
}); 

app.get('/index.json',function(req,res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify( {
        "version": "3.0.0",
        "resources": [
          {
            "@id": process.env.ADDRESS + "/query",
            "@type": "SearchQueryService",
            "comment": "Query endpoint of NuGet Search service"
          },
          {
            "@id": process.env.ADDRESS + "/query",
            "@type": "SearchQueryService/3.0.0-rc",
            "comment": "Query endpoint of NuGet Search service"
          },
          {
            "@id": process.env.ADDRESS + "/query",
            "@type": "SearchQueryService/3.0.0-beta",
            "comment": "Query endpoint of NuGet Search service"
          },
          {
            "@id": process.env.ADDRESS + "/registration",
            "@type": "RegistrationsBaseUrl",
            "comment": "Base URL of storage where NuGet package registration info is stored"
          },
          {
            "@id": process.env.ADDRESS + "/registration",
            "@type": "RegistrationsBaseUrl/3.4.0",
            "comment": "Base URL of storage where NuGet package registration info is stored"
          },
          {
            "@id": process.env.ADDRESS + "/registration",
            "@type": "RegistrationsBaseUrl/3.6.0",
            "comment": "Base URL of storage where NuGet package registration info is stored"
          },
          {
            "@id": process.env.ADDRESS + "/registration",
            "@type": "RegistrationsBaseUrl/Versioned",
            "comment": "Base URL of storage where NuGet package registration info is stored"
          },
          {
            "@id": process.env.ADDRESS + "/packages",
            "@type": "PackageBaseAddress/3.0.0",
            "comment": "Base URL of where NuGet packages are stored"
          },
          {
            "@id": process.env.ADDRESS +"/api/v2/package",
            "@type": "PackagePublish/2.0.0"
          }
        ],
        "@context": {
          "@vocab": "http://schema.nuget.org/services#",
          "comment": "http://www.w3.org/2000/01/rdf-schema#comment"
        }
      }));
});

//https://docs.microsoft.com/en-us/nuget/api/overview
app.use('/registration', require('./app/nuget/v3/registrationsBaseUrl'));
app.use('/query', require('./app/nuget/v3/searchQueryService'));
app.use('/api/v2/package', require('./app/nuget/v3/packagePublish'));
app.use('/packages', require('./app/nuget/v3/packageBaseAddress'));

app.listen(process.env.PORT,function(){
    console.log("Listening on "+process.env.PORT);
});
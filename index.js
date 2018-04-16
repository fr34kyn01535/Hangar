"use strict";
require('dotenv').config();
var app = require('express')();
app.use(require('body-parser').json());

app.get('/', function(req, res){ 
    res.send("Hello world");
}); 

//https://docs.microsoft.com/en-us/nuget/api/overview
app.use('/registration', require('./nuget/v3/registrationsBaseUrl.js'));
app.use('/search', require('./nuget/v3/searchQueryService.js'));
app.use('/package', require('./nuget/v3/packagePublish.js'));
app.use('/packages', require('./nuget/v3/packageBaseAddress.js'));

app.listen(process.env.PORT,function(){
    console.log("Listening on "+process.env.PORT);
});
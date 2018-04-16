"use strict";
require('dotenv').config();

const db = require('./models/index');

db.sequelize.sync().then(() => {
    console.log("Database up to date.");
}).catch(error => {
    console.log("Error syncing database:",error);
    process.exit(1);
});

const app = require('express')();
app.use(require('body-parser').json());

app.get('/', function(req, res){ 
    res.send("Hello world");
}); 

//https://docs.microsoft.com/en-us/nuget/api/overview
app.use('/registration', require('./app/nuget/v3/registrationsBaseUrl'));
app.use('/search', require('./app/nuget/v3/searchQueryService'));
app.use('/package', require('./app/nuget/v3/packagePublish'));
app.use('/packages', require('./app/nuget/v3/packageBaseAddress'));

app.listen(process.env.PORT,function(){
    console.log("Listening on "+process.env.PORT);
});
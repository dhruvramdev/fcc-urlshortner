const express = require('express');
const path = require('path');

const db = require('./db.js');
const port = process.env.PORT || 3000 ;

var app = express() ;

app.use(express.static('public'))
app.use(express.static(__dirname + '/views'));

app.get( '/' , (req , res) => {
    console.log("Index Page");
    res.sendFile("index.html" );
});

var isURL = (str) => {
     var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
     var url = new RegExp(urlRegex, 'i');
     return str.length < 2083 && url.test(str);
};

app.get( '/new/*' , (req , res) => {

    if(isURL(req.params["0"])){
        db.newURL( req.params["0"] , (err , result) => {
            if(err) {
                res.json({
                    "error" : err
                });
            } else {
                // console.log(result);
                res.json(result);
            }
        });

    } else {
        res.json({
            "error": "Wrong url format, make sure you have a valid protocol and real site."
        });
    }
});

app.get( '/*' , (req , res) => {
    var isnum = /^\d+$/.test(req.params["0"]);
    console.log(isnum);
    if  (isnum) {
        db.findURL(parseInt(req.params["0"]) , (err , url) => {
            if (err) {
                res.send(err);
            } else {
                console.log("URL" , url);
                res.redirect(url);
            }
        });

    } else {
        res.send("URL NOT FOUND");
    }

});



app.listen( port , () => {
    console.log(`Server is up on port ${port}!`);
});

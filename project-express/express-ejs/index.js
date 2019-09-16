var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));

app.get('/', function(req,res,next) {
    res.render('pages/index');
});

app.get('/about', function(req,res,next) {
    res.render('pages/about');
});

app.listen('3000',function(){
    console.log('server listening on port 8080');
});
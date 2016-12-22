var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')

var port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/api/favorites', function(req, res){
  var data = fs.readFileSync('./data.json');
  res.send(data);
});

app.post('/api/favorites', function(req, res){
  if(!req.body.name){
    res.send("Error");
  }else {
  var data = JSON.parse(fs.readFileSync('./data.json'));
  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
}
});

app.listen(port, function(){
  console.log("Listening on port 3000");
});
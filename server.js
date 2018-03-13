var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var dummyData = [];
var id =1;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// var ing1 = {
// 		name:'meat',
// 		amount:'20',
// 		unit: 'g'
// 	};
// var ing2 = {
// 		name:'bread',
// 		amount:'1',
// 		unit: '-'
// 	};	

// var dummyData = [{
// 		id: 1,
// 		name: 'mlokhiee',
// 		ing: [ing1,ing2],
// 		desc: 'lunch'
// 	},{
// 		id: 2,
// 		name: 'indomie',
// 		ing: ing1,
// 		desc: 'makes mom angry !'
// 	}];


app.get('/',function(req,res){
	res.send('API Root');
});

// GET /data
app.get('/dishs',function(req,res){
	res.json(dummyData);
});

// GET /data/:id
app.get('/dishs/:id',function(req,res){
	var id = parseInt(req.params.id);
	for (var i =0;i< dummyData.length;i++){
		if (dummyData[i].id === id){
			res.json(dummyData[i]);
		}
	}
	res.status(404).send();
});

app.post('/dishs',function(req,res){
	var body = req.body;
	console.log(body.name);
	dummyData.push(body);
	// console.log(dummyData);
	dummyData[dummyData.length-1].id = id;
	// console.log(dummyData);
	id++;
	// console.log(id);
	res.json(body.ing);
});

app.listen(PORT,function(){
	console.log('listening on port '+ PORT);
});
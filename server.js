var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var dummyData = [];
var id =1;
var _ = require('underscore');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

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
	var reqId = parseInt(req.params.id);
	var result = _.findWhere(dummyData,{id:reqId});
	if (result){
		res.json(result);
	} else {
		res.status(404).send();
	}
	// for (var i =0;i< dummyData.length;i++){
	// 	if (dummyData[i].id === id){
	// 		res.json(dummyData[i]);
	// 	}
	// }
	// res.status(404).send();
});
 function validation(argument) {
 	var ret = true;
 	argument.forEach(function(element) {
		if (_.isString(element) && element.trim().length===0){
			console.log("inside");
			ret =  false;
		}
	});
	return ret;
 }

app.post('/dishs',function(req,res){
	var body = _.pick(req.body,'name','desc');
	
	if (!validation(_.values(body))){
		console.log("1");
		return res.status(400).send();
	}
	body.ing = _.pick(req.body.ing,'name','amount','unit');
	if (!validation(_.values(body.ing))){
				console.log("2");

		return res.status(400).send();
	}
	
	dummyData.push(body);
	dummyData[dummyData.length-1].id = id;
	id++;
	return res.json(body);
});

app.listen(PORT,function(){
	console.log('listening on port '+ PORT);
});
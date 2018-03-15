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
	//var queryParams = req.query;
	if (_.has(req.query,'type')){
		return res.json(_.where(dummyData,{type:req.query.type}))
	}
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
			ret =  false;
		}
	});
	return ret;
 }

app.post('/dishs',function(req,res){
	var body = _.pick(req.body,'name','desc','type');
	if (!validation(_.values(body))){
		return res.status(400).send(); //Bad Request , invalid data
	}
	body.ing = _.pick(req.body.ing,'name','amount','unit');
	if (!validation(_.values(body.ing))){
		return res.status(400).send(); //Bad Request , invalid data
	}
	dummyData.push(body);
	dummyData[dummyData.length-1].id = id;
	id++;
	return res.json(body);
});

app.delete('/dishs/:id',function(req,res){
	var delId = parseInt(req.params.id);
	var delItem = _.findWhere(dummyData,{id:delId});
	if(!delItem){
		return res.status(404).send();
		// return res.status(404).json({"error":" error discription goes here"});
	}
	dummyData = _.without(dummyData,delItem);
	res.status(200).json(delItem);
});

function validStrUpdate(obj,prop,objDotProp,alternative) {
	if(_.has(obj,prop) && _.isString(objDotProp) && objDotProp.trim().length >0 ){
		return objDotProp;
	} else if(_.has(obj,prop) && ! _.isString(objDotProp)){
		return -1 ;
	}
	return alternative;
}

function validNumUpdate(obj,prop,objDotProp,alternative) {
	if (_.has(obj,prop) && _.isNumber(objDotProp) ){
		return objDotProp ;
	} else if(_.has(obj,prop)){
		return -1;
	}
	return alternative;
}

app.put('/dishs/:id',function(req,res){
	var upId = parseInt(req.params.id);
	var upItem = _.findWhere(dummyData,{id:upId});
	if (!upItem){
		return res.status(404).send();
	}
	var validAttributes = {};
		validAttributes.name = validStrUpdate(req.body,'name',req.body.name,upItem.name);
		validAttributes.desc = validStrUpdate(req.body,'desc',req.body.desc,upItem.desc);
		validAttributes.type = validStrUpdate(req.body,'type',req.body.type,upItem.type);
		
	if (_.has(req.body,"ing")){
		validAttributes.ing = {};
		validAttributes.ing.name = validStrUpdate(req.body.ing,'name',req.body.ing.name,upItem.ing.name);
		validAttributes.ing.amount = validNumUpdate(req.body.ing,'amount',req.body.ing.amount,upItem.ing.amount);
		validAttributes.ing.unit = validStrUpdate(req.body.ing,'unit',req.body.ing.unit,upItem.ing.unit);

	}
	_.extend(upItem,validAttributes);
	res.status(200).json(upItem);
});

app.listen(PORT,function(){
	console.log('listening on port '+ PORT);
});
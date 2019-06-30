var express=require('express')
var fs=require('fs')
var bodyParser = require('body-parser')
var path=require('path')
var router=require('./routers/router')
var users=require('./routers/users')
var cookieParser = require('cookie-parser')
// var users = require('./routes/users');
// var goods = require('./routes/goods')
var app=express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use(cookieParser())

app.use(function(req,res,next){
	if(req.cookies.userId){
		console.log("This is cookies")
		next()
	}else{
		console.log("The is prelogin")
		if(req.originalUrl=="/users/login"||req.originalUrl=="/users/logout"||req.path=="/api/goods"||req.originalUrl=="/checkLogin"){
			next()
		}else{
			res.json({
				status:'2',
				msg:"didn't login1",
				result:''
			})
		}
	}
})

app.use(router)
app.use(users)

app.use(function(req,res,next){
	res.send('404')
	next()
})

app.use(function(err,req,res,next){
	res.status(500).json({
			err_code:500,
			message:'server error'
		})
})

app.listen(9090,function(err){

	console.log('Running at port 9090')
})
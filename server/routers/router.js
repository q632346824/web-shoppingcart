var express=require('express')
var router=express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')
var User = require('../models/users');

mongoose.Promise=global.Promise

mongoose.connect('mongodb://127.0.0.1:27017/db_demo',{ useNewUrlParser: true });

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});

router.get('/api/goods',function(req,res,next){
    
    let sort
    let goodsModel
    let params={}
    let pageSize=parseInt(req.query.pageSize)
    let page=parseInt(req.query.page)
    let priceLevel = req.query.priceLevel
    var priceGt = '',priceLte = '';
    
    if(priceLevel&&priceLevel!='all'){
      switch (priceLevel){
        case '0':priceGt = 0;priceLte=100;break;
        case '1':priceGt = 100;priceLte=500;break;
        case '2':priceGt = 500;priceLte=1000;break;
        case '3':priceGt = 1000;priceLte=5000;break;
      }
      params = {
        salePrice:{
            $gte:priceGt,
            $lte:priceLte
        }
      }
    }
    // console.log('debug')
    let skip=(page-1)*pageSize
    

    if(req.query.sort){
      req.query.sort=='true'?sort=1:sort=-1   
      goodsModel=Goods.find(params).sort({'salePrice':sort}).skip(skip).limit(pageSize)
    }else{
      goodsModel=Goods.find(params).skip(skip).limit(pageSize)
    }
    
    goodsModel.exec().then(function(data){
        if(!data) res.json({
          status:'1',
          msg:err.message
        })

        res.json({
          status:0,
          msg:'',
          result:{
            count:data.length,
            list:data
          }

        })
	})	
})

router.post('/addCart',function(req,res,next){
  var userId=req.cookies.userId
  var productId=req.body.productId
  console.log("1debug")
  User.findOne({ userId:userId}).then(data1=>{
    if(!data1)   res.json({ status:"1", msg:err.message })
    var flag=false
    data1.cartList.forEach(item=>{
      if(item.productId==productId){
        item.productNum++
        flag=true
      }
    })

    if(flag){
      data1.save().then(data3=>{
        if(!data3)  res.json({ status:"1", msg:err.message })
        res.json({ status:'0', msg:'', result:'success'})
      })
    }else{
      Goods.findOne({productId:productId}).then(data2=>{
        if(!data2) res.json({ status:"1", msg:err.message })
        console.log(data2)
        data2.productNum=1
        data2.checked=1
        console.log(data2)
        data1.cartList.push(data2)
        data1.save().then(data3=>{
          if(!data3)  res.json({ status:"1", msg:err.message })
          res.json({ status:'0', msg:'', result:'success',})
          })
        
          
        })
    }
  })
})

router.get('/data',function(req,res,next){
  var userId=100000077
  User.findOne({ userId:userId}).then(data=>{
    res.json(data)
  })
})


module.exports=router
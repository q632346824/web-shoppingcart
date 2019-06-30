var express = require('express')
var router = express.Router()
var User = require('./../models/users')

router.post("/users/login",function(req,res,next){
  var param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
 
  User.findOne(param).then(data=>{

    if(!data) res.json({ status:"1",msg:"error"})
    
    
    res.cookie("userId",data.userId,{
      path:'/',
      maxAge:1000*60*60
    })
    res.cookie("userName",data.userName,{
      path:'/',
      maxAge:1000*60*60
    })
    // req.session.user=doc
    res.json({
        status:'0',
        msg:'',
        result:{
          userName:data.userName
        }
      }) 
  })

})

router.post("/users/logout",function(req,res,next){
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:'0',
    msg:'',
    result:''
  })
})

router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:'1',
      msg:'',
      result:"didn't login2"
    })
  }

})

router.get("/cartList",function(req,res,next){
  console.log("Thi is cartlist")
  var userId=req.cookies.userId
  User.findOne({userId:userId}).then((data)=>{
    if(!data)  res.json({status:'1',msg:'', result:'' })
    res.json({
      status:'0',
      msg:'',
      result:data.cartList
      })
    })
})

router.post("/deleteItem",function(req,res,next){

  var userId=req.cookies.userId
  var productId=req.body.productId
  User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}}).then(data=>{
    if(!data) res.json({status:'1',msg:'', result:''})
    res.json({
      status:'0',
      msg:'',
      result:'suc'
      })
  })
})

router.post("/cartEdit", function(req,res,next){
  var userId=req.cookies.userId
  var productId=req.body.productId
  var productNum=req.body.productNum
  var checked=req.body.checked

  User.updateOne({'userId':userId,"cartList.productId":productId},
    {
      "cartList.$.productNum":productNum,  
      "cartList.$.checked":checked,  
    }).then(data=>{
      if(!data) res.json({status:'1',msg:'error', result:''})
      res.json({
        status:'0',
        msg:'',
        result:'suc'
        })
    })
})

router.post("/editCheckAll",function(req,res,next){
  var userId=req.cookies.userId
  var checkAll=req.body.checkAll

  User.findOne({userId:userId}).then(user=>{
    if(!user) res.json({status:'1',msg:'error', result:''})
    user.cartList.forEach(item=>{
      item.checked=checkAll
    })
    user.save().then(data=>{
      if(!data) res.json({status:'1',msg:'error', result:''})
      res.json({
        status:'0',
        msg:'',
        result:'suc'
        })
    })

  })
})
module.exports=router
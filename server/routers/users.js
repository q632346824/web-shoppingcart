var express = require('express')
var router = express.Router()
var User = require('./../models/users')
require('./../util/util')

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

router.get("/addressList",function(req,res,next){
  var userId=req.cookies.userId
  User.findOne({userId:userId}).then(data=>{
    if(!data) res.json({status:'1',msg:'error', result:''})
    res.json({
      status:'0',
      msg:'',
      result:data.addressList
      })
  })
})

router.post("/setDefaultAddress",function(req,res,next){

  
  var userId=req.cookies.userId
  var addressId=req.body.addressId

  if(!addressId) return res.json({status:'1000',msg:'AddressId error', result:''})

  User.findOne({userId:userId}).then(data=>{
    if(!data) res.json({status:'1',msg:'error', result:''})

    var addressList=data.addressList
    addressList.forEach(item=>{
      if(item.addressId==addressId){
        item.isDefault=true
      }else{
        item.isDefault=false
      }
    })

    data.save().then(data1=>{
        if(!data1) res.json({status:'1',msg:'error', result:''})
        res.json({
          status:'0',
          msg:'',
          result:''
          })
    })
  })
})

router.post("/delAddress",function(req,res,next){
  var userId=req.cookies.userId
  var addressId=req.body.addressId

  User.update({userId:userId},{$pull:{'addressList':{'addressId':addressId}}}).then(data=>{
    if(!data) res.json({status:'1',msg:'error', result:''})
    res.json({
      status:'0',
      msg:'',
      result:''
      })

  })
})

router.post("/payment",function(req,res,next){
  var userId=req.cookies.userId
  var orderTotal=req.body.orderTotal
  var addressId=req.body.addressId
  User.findOne({userId:userId},function(err,data){
    if(err) res.json({status:'1',msg:'error', result:''})
    if(!data) res.json({status:'1',msg:'error', result:''})

    var address=''
    var goodsList=[]
    data.addressList.forEach(item=>{
      if(addressId==item.addressId){
        address=item
      }
    })

    data.cartList.filter(item=>{
      if(item.checked=="true"){
        goodsList.push(item)
      }
    })

    var platform="622"
    var r1=Math.floor(Math.random()*10)
    var r2=Math.floor(Math.random()*10)
    var sysDate=new Date().Format('yyyyMMddhhmmss')
    var createDate=new Date().Format('yyyy-MM- dd:hh:mm:ss')
    var orderId=platform+r1+sysDate+r2

    var order={
                orderId:orderId,
                orderTotal:orderTotal,
                addressInfo:address,
                goodsList:goodsList,
                orderStatus:'1',
                createDate:createDate
              }

    data.orderList.push(order)
    data.save().then(data1=>{
      if(!data1) res.json({status:'1',msg:'error', result:''})

      res.json({
          status:'0',
          msg:'',
          result:{
            orderId:order.orderId,
            orderTotal:order.orderTotal
            }
        })
      
    })

  })
})

router.get("/orderDetail",function(req,res,next){
  var userId=req.cookies.userId
  var orderId=req.query.orderId
  var orderTotal=0
  User.findOne({userId:userId}).then((data)=>{
    if(!data) res.json({status:'1',msg:'error', result:''})
    var orderList=data.orderList
    
    if(orderList.length>0){
      orderList.forEach(item=>{
        if(item.orderId==orderId){
          orderTotal=item.orderTotal
        }
      })
      if(orderTotal==0) res.json({status:'1',msg:'error1', result:''})
    }

    data.cartList=data.cartList.filter(item=>{
      return item.checked!=='true'
    })
    data.save().then(data2=>{
      if(!data2) res.json({status:'1',msg:'error', result:''})
      res.json({
        status:'0',
        msg:'',
        result:{
            orderTotal:orderTotal
            }
        })

    })

  })
})

router.get("/",function(req,res,next){

    res.send("123")
})
router.get("/showOrderList",function(req,res,next){
  var userId=req.cookies.userId
  User.findOne({userId:userId}).then((data)=>{
    res.send(data.orderList)
  })
})

module.exports=router
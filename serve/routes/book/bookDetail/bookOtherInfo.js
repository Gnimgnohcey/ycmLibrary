const { reject } = require("core-js/fn/promise");
const express=require("express")
const route=express.Router();
var connection = require('../../../dbconfig');
route.get('/bookOtherInfo',(req,res)=>{
    (async ()=>{
        let outResult={rentState:0,bookOtherGather:''}
        let getBookInfoList=`select * from bookAttribute inner join bookOtherInfo on bookAttribute.bookId=bookOtherInfo.bookId  inner join bookRackList on bookRackList.bookRackId=bookOtherInfo.bookRackId where bookAttribute.bookId=${req.query.bookId}`
        if(req.query.studentId!=undefined){
            let searchStudentRent=`select * from borrowInfoTable where bookId=${req.query.bookId} and studentId=${req.query.studentId} and isReturn=0`
            let result=await sqlConnect(searchStudentRent)
            if(result.length>0){
                outResult.rentState=1
            }
        }
        let data=await  sqlConnect(getBookInfoList)
        outResult.bookOtherGather=data[0]
        res.json(outResult)
    })()
});
function sqlConnect(sql){
  return new Promise((resolve,reject)=>{
      connection.query(sql,(error,result)=>{
          if(error){
              console.log('error',error)
          }
          resolve(result)
      })
  })
}



module.exports=route;
const { find } = require("core-js/fn/array");
const { reject, resolve } = require("core-js/fn/promise");
const express=require("express")
const route=express.Router();
var connection = require('../../../dbconfig');
route.get('/tcBook',(req,res)=>{
   (async()=>{
      const {selectOpera,doState,studentId,bookId}=req.query
      const findHave=`select * from thumbCollectTable where studentId=${studentId} and bookId=${bookId}`
      try{
        let result=await sqlConnect(findHave)
        let lastOpera; 
        if(result==0){
            selectOpera=='Thumb'?lastOpera=`insert into thumbCollectTable(studentId,bookId,isThumb,isCollect) values (${studentId},${bookId},1,0)`:lastOpera=`insert into thumbCollectTable(studentId,bookId,isThumb,isCollect) values (${studentId},${bookId},0,1)`
         }else{
            lastOpera=`update thumbCollectTable set is${selectOpera}=${doState} where bookId=${bookId} and studentId=${studentId};`
        }
        await sqlConnect(lastOpera)
        let changeTCNum;
        doState=="true"?changeTCNum=`update bookOtherInfo set book${selectOpera}=book${selectOpera}+1 where bookId=${bookId}`:changeTCNum=`update bookOtherInfo set book${selectOpera}=book${selectOpera}-1 where bookId=${bookId}`
        //通过字段保持一致进行直接字段名读取数据库操作,可用设计模式优化
        let lastResult=await sqlConnect(changeTCNum)
        if(lastResult){
            res.json({
                state:'success'
            })
        }
      }catch(e){
          console.log('error', e)
      }
   })()
})
route.get('/loadingStartTC',(req,res)=>{
    const {studentId,bookId}=req.query
    const findHave=`select * from thumbCollectTable where studentId=${studentId} and bookId=${bookId}`
    let initialTC={initialState:false,initResult:''}
    sqlConnect(findHave).then(result=>{
        if(result.length!=0){
            initialTC.initialState=true;
            initialTC.initResult=result[0]
        }
        res.json(initialTC)
    })
})
function sqlConnect(sql){
    return new Promise((resolve,reject)=>{
         connection.query(sql,(error,result)=>{
             if(error){
                 reject(error)
             }
              resolve(result)
         })
    })
  }
module.exports=route
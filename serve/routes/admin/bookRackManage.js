const { resolve } = require("core-js/fn/promise");
const express=require("express")
const route=express.Router();
var connection = require('../../dbconfig')
route.get('/addRack',(req,res)=>{
    const {rackName,category}=req.query
    const addSQL=`insert into bookRackList (bookRack,bookNum,category) values('${rackName}',50,'${category}')`;
    (async ()=>{
      try {
         await sqlConnect(addSQL)
            res.json({
                state:'success',
                reason:'添加成功'
            })
        }catch(error) {
            res.json({
              state:'error',
              reason:error.sqlMessage
            })
        }
    })()
})

route.get('/deleteRack',(req,res)=>{
    (async ()=>{
      try {
        let exitRackBook=await sqlConnect(`select * from bookOtherInfo where bookRackId=${req.query.bookRackId}`)
        if(exitRackBook.length>0){
            res.json({
                state:'error',
                reason:'不能删除还存在书籍的书架'
            })
        }else{
            const deleteSQL=`delete from bookRackList where bookRackId=${req.query.bookRackId}`;
            await sqlConnect(deleteSQL)
            res.json({
                state:'success',
                reason:'删除成功'
            })
          } 
        }catch(error) {
            res.json({
              state:'error',
              reason:error
            })
        }
    })()
})

route.get('/getRackByCategory',(req,res)=>{
     sqlConnect(`select * from bookRackList where category='${req.query.category}'`).then(result=>{
         res.json({
             state:'success',
             result:result
         })
     }).catch(error=>{
         res.json({
             state:error.sqlMessage
         })
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
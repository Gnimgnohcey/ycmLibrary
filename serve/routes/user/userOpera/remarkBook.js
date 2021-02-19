const { from } = require("core-js/fn/array");
const { query } = require("express");
const express=require("express")
const route=express.Router();
var connection = require('../../../dbconfig');
route.get('/sendRemark',(req,res)=>{
    (async()=>{
        const {studentId,bookId,remarkContent,sendTime}=req.query
        const handleRent=`select * from borrowInfoTable where studentId=${studentId} and bookId=${bookId}`
        const remarkState={
            state:false,
            reason:''
        }
        try{
           let stopStateResult=await sqlConnect(`select * from forbidSpeak where studentId=${studentId}`)
           //判断该用户是否被禁言
           if(stopStateResult.length!=0){
             remarkState.reason="由于你的不良发言,已经被管理员制裁,请联系管理员解决此事"
             res.json(remarkState)
           }else{
                let result=await sqlConnect(handleRent)
                if(result.length==0){
                    remarkState.reason="没借过这本书,有啥好评价的"
                    res.json(remarkState)
                }else{
                    let insertRemark=`insert into remarkList (studentId,bookId,remarkContent,sendTime) values(${studentId},${bookId},'${remarkContent}',${sendTime})`
                    let insertResult=await sqlConnect(insertRemark)
                    if(insertResult!=undefined){
                        remarkState.state=true
                        res.json(remarkState)
                    }
                }
           }
        }catch(e){
            console.log('e', e)
        }
    })()
})
route.get('/getRemark',(req,res)=>{
    (async()=>{
       const {bookId}=req.query
       const remarkOut={
           total:0,
           content:[]
       }
       let searchRemark;
       let pageSize;
       if(bookId!=''){
           searchRemark=`select * from remarkList inner join userInfo on remarkList.studentId=userInfo.studentId where bookId=${bookId}`
           pageSize=3
        }else{
           searchRemark='select * from remarkList inner join userInfo on remarkList.studentId=userInfo.studentId inner join bookAttribute on bookAttribute.bookId=remarkList.bookId'
           pageSize=8
       }
       try{
            const getResult=await sqlConnect(searchRemark)
            const result=getResult.reverse()
            remarkOut.total=result.length
            const pages=parseInt(result.length/pageSize)+1
            for(let i=0;i<pages;i++){
            remarkOut.content.push({
                pageNum:i,
                remarkSingleContent:result.slice(i*pageSize,(i+1)*pageSize)
             })
          }
            res.json(remarkOut)
        }catch(e){
           console.log('error',e)
        } 
    })()
})
route.get('/deleteRemark',(req,res)=>{
    (async()=>{
        const {remarkId}=req.query
        const deleteSQL=`delete from remarkList where remarkId=${remarkId}`
        const result=await sqlConnect(deleteSQL)
        if(result!=undefined){
            res.json({
                state:'success'
            })
        }else{
            res.json({
                state:'failed'
            })
        }
    })()
})



route.get('/stopRemark',(req,res)=>{
   sqlConnect(`insert into forbidSpeak (studentId) values (${req.query.studentId})`).then(result=>{
       if(result){
           res.json({
               state:'success',
               reason:'禁言成功'
           })
       }
   }).catch(error=>{
       res.json({
           state:'error',
           reason:'该用户已被禁言,不可重复禁言'
       })
   })
})

route.get('/retireMark',(req,res)=>{
    sqlConnect(`delete from forbidSpeak where studentId=${req.query.studentId}`).then(result=>{
        if(result){
            res.json({
                state:'success',
                reason:'取消禁言成功'
            })
        }
    }).catch(error=>{
        res.json({
            state:'error',
            reason:error.sqlMessage
        })
    })
})

route.get('/getStopList',(req,res)=>{
    sqlConnect('select * from forbidSpeak inner join userInfo on forbidSpeak.studentId=userInfo.studentId').then(result=>{
        res.json(result)
    }).catch(e=>{
        res.json({
            state:e
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
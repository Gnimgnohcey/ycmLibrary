const { resolve, reject } = require("core-js/fn/promise");
const express=require("express")
const route=express.Router();
var connection = require('../../dbconfig')
route.get('/getNoticeInfo',(req,res)=>{
    (async ()=>{
       let outNoticeList={
         noticeList:[],
         total:0
       } 
       let sqlSentence=`select * from notcieList`
       try{
        const getResult=await sqlConnect(sqlSentence)
        const result=getResult.reverse()
        outNoticeList.total=result.length
        const page=parseInt(result.length/8)+1
        for(let i=0;i<page;i++){
           outNoticeList.noticeList.push({
               noticeData:result.slice(i*8,(i+1)*8)
           })
        }
        res.json(outNoticeList)
       }catch(e){
           console.log('error', e)
       }
    })()
})
route.get('/getNoticeDetail',(req,res)=>{
    (async ()=>{
       let sqlSentence=`select * from notcieList where noticeId=${req.query.noticeId}`
       let addRead=`update notcieList set readNum=readNum+1 where noticeId=${req.query.noticeId}`
       try{
        await sqlConnect(addRead)  
        const result=await sqlConnect(sqlSentence)
        res.json(result)
       }catch(e){
           console.log('error', e)
       }
    })()
})
function sqlConnect(sqlSentence){
    return new Promise((resolve,reject)=>{
        connection.query(sqlSentence,(error,result)=>{
            if(error){
                reject(error)
            }
            resolve(result)
        })
    })
}
module.exports=route
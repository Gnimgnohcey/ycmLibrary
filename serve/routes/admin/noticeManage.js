const route=require('express').Router()
const connection = require('../../dbconfig')
route.get('/noticeListInManage',(req,res)=>{
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
                outNoticeList.noticeList.push(result.slice(i*8,(i+1)*8))
             }
             res.json(outNoticeList)
            }catch(e){
                console.log('error', e)
            }
    })()
})
route.get('/addNotice',(req,res)=>{
    (async()=>{
        const {noticeTitle,noticeContent,noticeSendDate}=req.query
        const insertSQL=`insert into notcieList (noticeTitle,noticeContent,noticeSendDate,readNum) values ('${noticeTitle}','${noticeContent}','${noticeSendDate}',0)`
        try{
            await sqlConnect(insertSQL)
            res.json({
                state:'success'
            })
        }catch(e){
           res.json({
               state:e
           })
        }
    })()
})
route.get('/deleteNotice',(req,res)=>{
    (async()=>{
        const {noticeId}=req.query
        const deleteSQL=`delete from notcieList where noticeId=${noticeId}`
        await sqlConnect(deleteSQL)
        res.json({
            state:'success'
        })
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
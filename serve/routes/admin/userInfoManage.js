const route=require('express').Router()
const connection = require('../../dbconfig')
route.get('/getUserList',(req,res)=>{
   (async()=>{
       let reData={
           total:0,
           userList:[]
       }
       let result=await sqlConnect('select * from userInfo')
       const pageNum=parseInt(result.length/9)+1
       reData.total=result.length
       for(let i=0;i<pageNum;i++){
            reData.userList.push(result.slice(9*i,(i+1)*9))
       }
       res.json(reData)
   })()
})

route.get('/updateUserInfo',(req,res)=>{
    (async()=>{
        const { studentId,classes,userName,password,sex,mail}=req.query
        try{
        await sqlConnect(`update userInfo set classes='${classes}',userName='${userName}',password='${password}',sex='${sex}',mail='${mail}' where studentId=${studentId}`)
        res.json({
            state:'success',
            reason:'success'
        })
      }catch(e){
          res.json({
              state:'error',
              reason:e.sqlMessage
          })
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
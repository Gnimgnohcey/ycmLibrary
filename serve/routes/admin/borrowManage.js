const { reject } = require("core-js/fn/promise");
const express=require("express");

const route=express.Router();
var connection = require('../../dbconfig')
route.get('/getBorrowInfoList',(req,res)=>{
    const {searchContent}=req.query
    let doSql=`select * from borrowInfoTable inner join bookAttribute on borrowInfoTable.bookId=bookAttribute.bookId inner join userInfo on userInfo.studentId=borrowInfoTable.studentId where  userName like '%${searchContent}%'`
    let outData={
        total:100,
        borrowInfoList:[]
    }
    sqlConnect(doSql).then(sqlResult=>{
        let result=sqlResult.reverse()
        outData.total=result.length
        let pageNums=parseInt(result.length/10)+1
        for(let i=0;i<pageNums;i++){
            outData.borrowInfoList.push(result.slice(i*10,(i+1)*10))
        }
        res.json(outData)
    }).catch(e=>{
        res.json({e})
    })
})

route.get('/updateCheck',(req,res)=>{
    sqlConnect(`update borrowInfoTable set checkState=1 where borrowId=${req.query.borrowId}`).then(result=>{
        res.json({
            state:'success'
        })
    }).catch(e=>{
        res.json({
            state:e
        })
    })

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
const { reject, resolve } = require("core-js/fn/promise");
const express=require("express")
const route=express.Router();
var connection = require('../../../dbconfig');
route.get('/userDoBorrow',(req,res)=>{
    (async(res)=>{
        let {studentId,borrowTime,borrowDaylong,bookId,isReturn,backTime}=req.query
        try{
           const handleBorrowState=await sqlConnect(`select * from borrowInfoTable where bookId=${bookId} and studentId=${studentId} and isReturn=0`)
           if(handleBorrowState.length!=0){
            res.json({
                responseState:'failed'
              })
           }else{
            await sqlConnect(`insert into borrowInfoTable (studentId,bookId,borrowTime,borrowDaylong,isReturn,backTime,checkState) values(${studentId},${bookId},'${borrowTime}',${borrowDaylong},${isReturn},'${backTime}',0)`);
            //每次借阅往借阅记录表中插入一条借阅记录
            await sqlConnect(`update bookOtherInfo set bookStock=bookStock-1,borrowAmount=borrowAmount+1 where bookId=${bookId}`)
            // 修改库存,添加该书的借阅次数
            res.json({
                responseState:'success'
              })
             }
            }catch(e){
              console.log('error', e)
           }
    })(res)
})
route.get('/userDoReturn',(req,res)=>{
    (async()=>{
        const {studentId,bookId,backTime}=req.query
        const returnBookSql=`update borrowInfoTable set backTime='${backTime}',isReturn=1 where studentId=${studentId} and bookId=${bookId} and isReturn=0`
        try{
            let overtimeState=0;
            const handleBorrowState=await sqlConnect(`select * from borrowInfoTable where bookId=${bookId} and studentId=${studentId} and isReturn=0`)
            if(handleBorrowState.length!=0){
                if(handleBorrowState[0].checkState==0){
                    res.json({
                        responseState:'error',
                        reason:'还书前,请将书本还至管理员出,确定后,才可还书'
                    })
                }else{
                const realityLong=(backTime-handleBorrowState[0].borrowTime)/86400000
                //实际借阅的天数
                if(realityLong>handleBorrowState[0].borrowDaylong){
                    await sqlConnect(`update userInfo set credit=credit-1 where studentId=${studentId}`)
                    //  符合超时状态,扣除信用分
                    overtimeState=1
                }   
                await sqlConnect(returnBookSql)
                let updateBookOther=`update bookOtherInfo set bookStock=bookStock+1 where bookId=${bookId}`
                let result=await sqlConnect(updateBookOther)
                if(result!=undefined){
                    if(overtimeState==0){
                        res.json({
                            responseState:'success',
                            reason:'归还成功'
                        })
                }else{
                        res.json({
                            responseState:'success',
                            reason:'归还成功,但是由于超时归还,扣除你一点信用分'
                        })
                    }
                }
            }
         }else{
            res.json({
                responseState:'error',
                reason:'不可重复还书'
            })
          }
        }catch(e){
            console.log('error',e)
        }
    })()
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
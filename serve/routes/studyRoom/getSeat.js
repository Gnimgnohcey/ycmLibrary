const { resolve, reject } = require("core-js/fn/promise");
const express=require("express")
const route=express.Router();
var connection = require('../../dbconfig')
route.get('/getSeatInfo',(req,res)=>{
    (async()=>{
        const seatList={
            total:0,
            seatContent:[]
        }
        const searchAllSeat=`select * from studySeat`
        let result=await sqlConnect(searchAllSeat)
        seatList.total=result.length
        const pages=parseInt(result.length/15)+1
        for(let i=0;i<pages;i++){
            seatList.seatContent.push(result.slice(i*15,(i+1)*15))
        }
        res.json(seatList)
    })()
})
route.get('/doSelectSeat',(req,res)=>{
    (async()=>{
        const {studentId,seatId}=req.query
        try{
            let haveBeenSeat=await sqlConnect(`select * from studySeat where studentId=${studentId}`)
            if(haveBeenSeat.length!=0){
                res.send('你已经选择了其他座位,不能太贪心哦!')
                return 0
            }
            let selectSeatorNull=await sqlConnect(`select * from studySeat where seatId=${seatId}`)
            if(selectSeatorNull[0].studentId!=null){
                res.send('你这个座位已经被抢走了哦!')
                return 0
            }
            let doSelectSeat=await sqlConnect(`update studySeat set studentId=${studentId} where seatId=${seatId}`)
            if(doSelectSeat!=undefined){
                res.send('抢座成功!')
            }
        }catch(e){
            console.log('e', e)
        }
    })()
})
route.get('/doLeaveSeat',(req,res)=>{
     sqlConnect(`update studySeat set studentId=null where seatId=${req.query.seatId}`).then(result=>{
         res.send("离开成功")
     }).catch(e=>{
         console.log('e',e)
     })
})

route.get('/clearSeat',(req,res)=>{
   sqlConnect(`update studySeat set studentId=null`).then(
       res.send('清空成功')
   ).catch(e=>{
       console.log(e)
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
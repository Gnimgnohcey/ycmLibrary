const express=require("express")
const route=express.Router();
var connection = require('../../dbconfig')
var multer  = require('multer')
const fs=require('fs')
route.get("/getBookInAdmin",(req,res)=>{
  (async()=>{
      let outResult={
         total:100,
         bookInfo:[]
      }
      let getBookInfoList=`select * from bookAttribute inner join bookOtherInfo on bookAttribute.bookId=bookOtherInfo.bookId inner join bookRackList on bookRackList.bookRackId=bookOtherInfo.bookRackId where bookName like '%${req.query.searchKey}%'`
      // if(req.query.searchKey==''){
      //   getBookInfoList=`select * from bookAttribute inner join bookOtherInfo on bookAttribute.bookId=bookOtherInfo.bookId`
      // }else{
      // }
      let result=await sqlConnect(getBookInfoList)
      outResult.total=result.length;
      const pageNum=parseInt(result.length/9)+1
      for(let i=0;i<pageNum;i++){
         outResult.bookInfo.push(result.slice(i*9,(i+1)*9))
      }
      res.json(outResult)
    })()
  })

route.post("/upload",multer({dest:'/upload'}).single('file'),(req,res,next)=>{
  const files=req.file
  const imgType=req.file.mimetype.split("/")[1]
  console.log('req', req.file)
  fs.renameSync(files.path,`upload/${files.filename}.${imgType}`)
  res.send(`${files.filename}.${imgType}`)
})  


route.get("/getRackEnum",(req,res)=>{
   const {category}=req.query
   sqlConnect(`select * from bookRackList where category='${category}'`).then(result=>{
     res.json(result)
   }).catch(e=>{
    console.log('error', e)
   })
})  


route.get("/saveBookInfo",(req,res)=>{
  const {bookId,bookName,author,bookBrief,publisher,bookPrice,bookRackId,category,imgSrc,publicTime,bookDetailAddress,bookStock,lowestCredit}=req.query;
  (async()=>{
    let operaBookAttr;
    let operaBookOtherInfo;
    try{
    if(bookId!=''){
       operaBookAttr=`update bookAttribute set bookName='${bookName}',author='${author}',bookBrief='${bookBrief}',publisher='${publisher}',bookPrice='${bookPrice}',category='${category}',imgSrc='${imgSrc}',publicTime='${publicTime}' where bookId=${bookId} `
       operaBookOtherInfo=`update bookOtherInfo set bookRackId=${bookRackId},bookDetailAddress='${bookDetailAddress}',bookStock=${bookStock},lowestCredit=${lowestCredit} where bookId=${bookId}`
       await sqlConnect(operaBookAttr)
      }else{
        operaBookAttr=`insert into bookAttribute (bookName,author,bookBrief,publisher,imgSrc,publicTime,category,bookPrice) values ('${bookName}','${author}','${bookBrief}','${publisher}','${imgSrc}','${publicTime}','${category}','${bookPrice}')`
        let result=await sqlConnect(operaBookAttr)
        operaBookOtherInfo=`insert into bookOtherInfo (bookId,bookCollect,bookThumb,bookRackId,bookDetailAddress,bookStock,borrowAmount,dateTime,lowestCredit) values(${result.insertId},0,0,${bookRackId},'${bookDetailAddress}',${bookStock},0,${Number(new Date())},${lowestCredit})`
        let newBookSet=`insert into bookState values(${result.insertId},1,0,0)`
        await sqlConnect(newBookSet)
      }
      await sqlConnect(operaBookOtherInfo)
    res.json({
      state:'success'
    })
  }catch(e){
    res.json({
      state:e.sqlMessage
    })
  }
  })()
})  

route.get('/outBorrow',(req,res)=>{
     sqlConnect('select distinct  bookId from borrowInfoTable').then(result=>{
       res.json(result)
     }).catch(e=>{
       console.log('error', e)
     })
})

route.get('/doDeleteBook',(req,res)=>{
   const {bookId}=req.query
   const deleteAttrTable=`delete from bookAttribute where bookId=${bookId}`
   const deleteOtherTable=`delete from bookOtherInfo where bookId=${bookId}`;
   (async()=>{
      try{
        sqlConnect(deleteAttrTable)
        sqlConnect( deleteOtherTable)
        res.json({
          state:'删除成功'
        })
      }catch(e){
        console.log(e)
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
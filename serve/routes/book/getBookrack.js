const express=require("express")
const route=express.Router();
var connection = require('../../dbconfig')
route.get('/getBookrack',(req,res)=>{
    connection.query(`select * from bookRackList`,(error,result)=>{
        if(error){
            console.log(error)
        }
        if(result){
            res.json(result)
        }
    })
})
route.get('/searchBookInRack',(req,res)=>{
      const searhField=JSON.parse(req.query.searchField)
      if(req.query.bookrack!=undefined){
        let selectRackBook=`select bookName,author,publisher,publicTime,bookPrice,bookBrief,imgSrc,bookRackList.bookRack,bookRackList.bookRackId,bookAttribute.bookId from bookAttribute inner join bookOtherInfo on bookAttribute.bookId=bookOtherInfo.bookId  inner join bookRackList on bookRackList.bookRackId=bookOtherInfo.bookRackId where ${searhField.searchType} like '%${searhField.searchContent}%' and (`
        req.query.bookrack.map(item=>{
            selectRackBook+=`  bookRack='${item}' or`
        })
        selectRackBook+=` bookRack='end')`
        sqlSearchResult(res,selectRackBook)
      }else{
        let searchSql=`select * from bookAttribute where ${searhField.searchType} like '%${searhField.searchContent}%'`;
        sqlSearchResult(res,searchSql)
      }
    
})

function sqlSearchResult(res,sqlSentence){
    const causalJson={
       dataList:[],
       page:0,
       total:0
    }
    //作为返回json的初始化
    connection.query(sqlSentence,(error,result)=>{
        if(error){
            console.log('tag', error)
        }
        causalJson.page=parseInt(result.length/9)+1
        for(let i=0;i<causalJson.page;i++){
            causalJson.dataList.push({
                pageNum:i,
                pageContent:result.slice(9*i,9*(i+1))
            })
        }
        causalJson.total=result.length
        res.json(causalJson)
    })
}

module.exports=route
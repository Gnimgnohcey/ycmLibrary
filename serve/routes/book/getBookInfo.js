const { find } = require("core-js/fn/array");
const express=require("express");
const { connect } = require("../../dbconfig");
const route=express.Router();
var connection = require('../../dbconfig');
class findOpera{
    findAll(res,rentState=null,searchField){
        let searchSql
        if(rentState!=null){
            if(rentState){
                searchSql=`select * from bookAttribute inner join bookOtherInfo on bookOtherInfo.bookId=bookAttribute.bookId where bookStock<=0 and ${searchField.searchType} like '%${searchField.searchContent}%';`
            }else{
                searchSql=`select * from bookAttribute inner join bookOtherInfo on bookOtherInfo.bookId=bookAttribute.bookId where bookStock>0 and ${searchField.searchType} like '%${searchField.searchContent}%';` 
           }  
        }else{
            searchSql=`select * from bookAttribute where ${searchField.searchType} like '%${searchField.searchContent}%'`;
        }
        this.sqlConnect(searchSql).then(result=>{
            this.responSearchResult(res,result)
        }).catch(error=>{
            console.log('error', error)
        })
    }
    findNew(res,rentState=null,searchField){
       let searchSql;
       if(rentState!=null){
        if(rentState){
            searchSql=`select * from bookState inner join bookAttribute on bookState.bookId=bookAttribute.bookId inner join bookOtherInfo on bookAttribute.bookId=bookOtherInfo.bookId where bookState.isNew=1 and bookStock<=0 and ${searchField.searchType} like '%${searchField.searchContent}%';`
        }else{
            searchSql=`select * from bookState inner join bookAttribute on bookState.bookId=bookAttribute.bookId  inner join bookOtherInfo on bookAttribute.bookId=bookOtherInfo.bookId  where bookState.isNew=1 and bookStock>0 and ${searchField.searchType} like '%${searchField.searchContent}%';`
        }
       }else{
        searchSql=`select * from bookState inner join bookAttribute on bookState.bookId=bookAttribute.bookId where bookState.isNew=1 and ${searchField.searchType} like '%${searchField.searchContent}%';`
       }
       this.sqlConnect(searchSql).then(result=>{
        this.responSearchResult(res,result)
        }).catch(error=>{
            console.log('error', error)
        })
    }
    findHot(res,rentState=null,searchField){
        let searchSql;
        if(rentState!=null){
          if(rentState){
            searchSql=`select * from bookAttribute inner join bookOtherInfo on bookAttribute.bookId=bookOtherInfo.bookId where ${searchField.searchType} like '%${searchField.searchContent}%' and bookStock<=0 Order by borrowAmount desc;`
        }else{
            searchSql=`select * from bookAttribute inner join bookOtherInfo on bookAttribute.bookId=bookOtherInfo.bookId where ${searchField.searchType} like '%${searchField.searchContent}%' and bookStock>0 Order by borrowAmount desc;`  
        }
        }else{
           searchSql=`select * from bookAttribute inner join bookOtherInfo on bookAttribute.bookId=bookOtherInfo.bookId where ${searchField.searchType} like '%${searchField.searchContent}%' Order by borrowAmount desc;`
        }
        this.sqlConnect(searchSql).then(result=>{
            this.responSearchResult(res,result.slice(0,100))
        }).catch(e=>{
            console.log('error', error)
        })
    }
    responSearchResult(res,result){
        const causalJson={
           dataList:[],
           page:0,
           total:0
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
    }
    sqlConnect(sql){
        return new Promise((resolve,reject)=>{
            connection.query(sql,(error,result)=>{
                if(error){
                    reject(error)
                }
                resolve(result)
        })
    })
  }
}
//利用策略模式减少ifelse
route.get('/getBookByCondition',(req,res)=>{
    const findState={
        findConditon:'findAll',
        isExistRent:false,
        rentState:false,
    }
    let defaultSearchField;
    if(req.query.searchField==undefined){
        defaultSearchField={
            searchType:'bookName',
            searchContent:''
        }
    }else{
        defaultSearchField=JSON.parse(req.query.searchField)
    }
    //这里定义一个默认值,如果外部调用该接口时,不存在该参数,则默认定义一个
    //事件默认选取的是判断借阅条件来查找,通过外部传入的操作指令来做筛选
    const getBookCondition=new findOpera()
    if(!req.query.condition){
        //如果外部选择为空的话默认查询全部返回出去
        getBookCondition.findAll(res,null,defaultSearchField)
    }else{
    req.query.condition.map(item=>{
        if(item.indexOf('Rent')!=-1){
            findState.isExistRent=true
            //判断是否要筛选出借阅的
            if(item.indexOf('After')!=-1){
                findState.rentState=true
            }else{
                findState.rentState=false
            }
            // 保存借阅状态
        }else{
            findState.findConditon=item
        }
    })
    // 处理前端传来的数据,判断出准确调用的方法
    if(findState.isExistRent==true){
        getBookCondition[findState.findConditon](res,findState.rentState,defaultSearchField) 
    }else{
        getBookCondition[findState.findConditon](res,null,defaultSearchField)
    }
  }
})
module.exports=route
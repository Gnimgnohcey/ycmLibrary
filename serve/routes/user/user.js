const express=require("express")
const route=express.Router();
var connection = require('../../dbconfig')
route.get('/register',(req,res)=>{
    (async()=>{
        console.log('tag', req)
        const resJson={state:'',data:'',errorResult:''}
        const {studentId,classes,userName,password,sex,mail,accountCard}=req.query
        const insertData=`insert  into userInfo (studentId,classes,userName,password,sex,mail,credit,accountCard,currentState) values (${studentId},'${classes}','${userName}','${password}','${sex}','${mail}',100,'${accountCard}',1)`
        try{
          let result=await sqlConnect(insertData)
          if(result!=undefined){
            resJson.state="success"
            resJson.data=result
          }
        }catch(e){
            resJson.state="failed"
            resJson.errorResult=e
        }
        res.json(resJson)
    })()
})
route.get('/login',(req,res)=>{
    (async()=>{
        const {studentId,password}=req.query;
        const selectById=`select * from userInfo where studentId=${studentId}`
        const selectJson={state:'',resultReason:'',userInfo:''}
        let adminRoute=[{
            path:'/adminSystem',
            name:'adminSystem',
            componentURL:'admin/adminSystem.vue',
            children:[
              {
                path:'/adminSystem/bookManage',
                name:'bookManage',
                componentURL:'admin/moduleManage/bookManage.vue', 
              },
              {
                path:'/adminSystem/bookRackManage',
                name:'bookRackManage',
                componentURL:'admin/moduleManage/bookRackManage.vue'
              },
              {
                path:'/adminSystem/noticeManage',
                name:'noticeManage',
                componentURL:'admin/moduleManage/noticeManage.vue'
              },
              {
                path:'/adminSystem/bookRemarkManage',
                name:'bookRemarkManage',
                componentURL:'admin/moduleManage/bookRemarkManage.vue'
              },
              {
                path:'/adminSystem/userInfoManage',
                name:'userInfoManage',
                componentURL:'admin/moduleManage/userInfoManage.vue'
              },
              {
                path:'/adminSystem/studyRoomManage',
                name:'studyRoomManage',
                componentURL:'admin/moduleManage/studyRoomManage.vue'
              },
              {
                path:'/adminSystem/borrowManage',
                name:'borrowManage',
                componentURL:'admin/moduleManage/borrowManage.vue'
              }
             ]
          }]
          if(studentId=='101'){
             selectJson.adminRoute=adminRoute
          }
        try{
          let result=await sqlConnect(selectById)
          if(result.length!=0){
                if(password==result[0].password){
                    selectJson.state="success"
                    selectJson.userInfo=result[0]
                 }else{
                    selectJson.state="failed"
                    selectJson.resultReason="密码错误!"
                 }
            }else{
                selectJson.state="failed"
                selectJson.resultReason="查找不到该账户"
            }
            res.json(selectJson)
        }catch(e){
            console.log('err', e)
        }
    })()
})
route.get('/getUserInfo',(req,res)=>{
    (async()=>{
        const {studentId}=req.query;
        const selectById=`select * from userInfo where studentId=${studentId}`;
        try{
            let result=await sqlConnect(selectById)
            res.json(result[0])
        }catch(e){
            console.log(e)
        }
    })()
})
route.get('/getUserBook',(req,res)=>{
    (async()=>{
        const userBook={
            state:'success',
            BTresult:[],
            TCresult:[]
        }
        let userBorrowInfo=`select * from borrowInfoTable inner join bookAttribute on borrowInfoTable.bookId=bookAttribute.bookId where studentId=${req.query.studentId};`
        let userTCInfo=`select * from thumbCollectTable inner join bookAttribute on thumbCollectTable.bookId=bookAttribute.bookId where studentId=${req.query.studentId};`
        try{
           let BIresult=await sqlConnect(userBorrowInfo)
           userBook.BTresult=BIresult
           let TCresult=await sqlConnect(userTCInfo)
           userBook.TCresult=TCresult
           res.json(userBook)
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
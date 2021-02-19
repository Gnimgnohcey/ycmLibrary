import { getUserInfoAPI,getUserBookAPI } from 'apiList/user.js'
export default {
   state:{
      userInfo:{}
      // BIGather:{},
      // TCGather:{}
   },
   getters:{
      outUserInfo(state){
        return state.userInfo
      }
   },
   actions:{
     showUserInfo(context){
        alert(context.state.userId)
     },
     getUserInfo({state},studentId){
         getUserInfoAPI({studentId}).then((result)=>{
             state.userInfo=result.data
         })
         //将用户信息存储在vuex中
     }
   //   getBorrowBook({state}){
   //      console.log('ssss', state.userInfo.studentId)
   //      getUserBookAPI({studentId:state.userInfo.studentId}).then(result=>{
   //        state.BIGather=result.data.BTresult
   //        state.TCGather=result.data.TCresult
   //        console.log('tagp', state.BIGather)
   //     })
   //   }
   },
   mutations:{
   }
}
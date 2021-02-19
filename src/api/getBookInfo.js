import  axios from 'axios'
//功能与后面的接口相似,暂时注释
export const getBookListByCondition=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/getBookByCondition',
        method:'get',
        params:params
    })
 }
 export const getBookOtherInfoAPI=(params='')=>{
   return axios.request({
       url:'http://localhost:3000/bookOtherInfo',
       method:'get',
       params:params
   })
}
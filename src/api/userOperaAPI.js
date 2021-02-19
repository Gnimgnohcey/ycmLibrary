import axios from 'axios'
export const borrowBook=(params='')=>{
   return axios.request({
       url:'http://localhost:3000/userDoBorrow',
       method:'get',
       params:params
   })
}
export const returnBook=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/userDoReturn',
        method:'get',
        params:params
    })
 }
 export const tcBookAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/tcBook',
        method:'get',
        params:params
    })
 }
 //tc=thumb AND collect
 export const loadingStartTCAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/loadingStartTC',
        method:'get',
        params:params
    })
 }

 export const sendRemarkAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/sendRemark',
        method:'get',
        params:params
    })
 }
 
 export const getRemarkAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/getRemark',
        method:'get',
        params:params
    })
 }
 export const deleteRemarkAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/deleteRemark',
        method:'get',
        params:params
    })
 }
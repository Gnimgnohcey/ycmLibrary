import axios from 'axios';
export const getNoticeAPI= (params='')=>{
    return axios.request({
        url:'http://localhost:3000/getNoticeInfo',
        method:'get',
        params:params
    })
}
export const getNoticeDetailAPI= (params='')=>{
    return axios.request({
        url:'http://localhost:3000/getNoticeDetail',
        method:'get',
        params:params
    })
}
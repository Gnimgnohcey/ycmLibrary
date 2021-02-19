import axios from 'axios'
export const getNoticeInManageAPI=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/noticeListInManage',
        method:'GET',
        params:params
    })
}
export const addNoticeAPI=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/addNotice',
        method:'GET',
        params:params
    })
}
export const deleteNoticeAPI=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/deleteNotice',
        method:'GET',
        params:params
    })
}
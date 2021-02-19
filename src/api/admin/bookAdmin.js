import axios from 'axios'
export const showBookInfoAdmin=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/getBookInAdmin',
        method:"GET",
        params:params
    })
}
export const getRackEnumAPI=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/getRackEnum',
        method:"GET",
        params:params
    })
}
export const saveBookInfoAPI=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/saveBookInfo',
        method:"GET",
        params:params
    })
}

export const  doDeleteBookAPI=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/doDeleteBook',
        method:"GET",
        params:params
    })
}
export const  outBorrowAPI=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/outBorrow',
        method:"GET",
        params:params
    })
}
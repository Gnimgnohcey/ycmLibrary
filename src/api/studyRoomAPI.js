import axios from 'axios'
export const getSeatInfoAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/getSeatInfo',
        method:'get',
        params:params
    })
}
export const doSelectSeatAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/doSelectSeat',
        method:'get',
        params:params
    })
}
export const doLeaveSeatAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/doLeaveSeat',
        method:'get',
        params:params
    })
}


export const clearSeatAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/clearSeat',
        method:'get',
        params:params
    })
}
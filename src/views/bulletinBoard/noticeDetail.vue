<template>
    <div class="content">
       <Row>
         <i-col span="24" class="send-title">{{noticeDetail.noticeTitle}}</i-col>
         <i-col span="23" class="send-date"> {{noticeDetail.noticeSendDate}} <Icon type="ios-eye-outline" />{{noticeDetail.readNum}}</i-col>  
         <i-col span="24" class="send-content">{{noticeDetail.noticeContent}}
         </i-col>
       </Row>
       <div class="footCell"></div>
    </div>
</template>
<script>
import { getNoticeDetailAPI } from 'apiList/getNotice'
export default {
    name:'noticeDetail',
    data(){
        return{
          noticeDetail:{}
        }
    },
    created(){
        console.log(this.$route.query)
        getNoticeDetailAPI({noticeId:this.$route.query.noticeId}).then(result=>{
            this.noticeDetail=result.data[0]
        })
    }
}
</script>
<style scoped>
    .content{
        width:90%;
        margin: 0 auto;
    }
    .send-title{
        font-size:20px;
        font-weight: bolder;
        margin-top:10px;
    }
    .send-date{
        text-align: right;
        font-size:10px;
        color:gray;
    }
    .send-content{
        text-indent: 2em;
        text-align: left;
        word-wrap: break-word;
    }
    .footCell{
        height: 400px;
    }
</style>
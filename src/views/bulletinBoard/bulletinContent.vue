<template>
    <div>
        <Row>
            <i-col span="3" style="margin:20px 0;font-weight:bolder">公告栏</i-col>
        </Row>
        <List style="margin-left:5%;height:400px">
            <div class="list-item-style" v-for="(item,index) in noticeList" :key="index" @click="routeToDetail(item)">
            <ListItem>
                 {{item.noticeTitle}} 
                <ListItemMeta/>
                <template slot="action">
                   <li>
                     <Icon type="ios-eye-outline" />{{item.readNum}}
                   </li>
                   <li>
                     {{item.noticeSendDate}}
                   </li>
                </template>
            </ListItem>
            </div>
        </List>
         <Page :total="pageInfo.total" :page-size="pageInfo.pageSize" @on-change="pageTo" style="margin-top:10px"/>
    </div>
</template>
<script>
import { getNoticeAPI } from 'apiList/getNotice';
export default {
    name:'',
    data(){
        return{
            bothNotice:[],
            noticeList:[],
            pageInfo:{
                total:10,
                pageSize:8
            }
        }
    },
    methods:{
       routeToDetail(item){
           this.$router.push({
               path:'noticeDetail',
               query:{
                   noticeId:item.noticeId
               }
           })
       },
       pageTo(val){
           this.noticeList=this.bothNotice.noticeList[val-1].noticeData
       }
    },
    created(){
        getNoticeAPI().then((result) => {
            this.bothNotice=result.data
            this.pageInfo.total=result.data.total
            this.noticeList=result.data.noticeList[0].noticeData 
        }) 
    }
}
</script>
<style scoped>
   /* .list-item-style{
       border-bottom: 2px solid rgba(158,165,44,.4);
   } */
</style>
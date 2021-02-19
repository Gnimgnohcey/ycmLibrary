<template>
   <div style="width:80%;margin:20px auto;">
       <Row>
       <i-col class="seat-style" span="4" v-for="(item,key) in seatArr" :key="key">
            <Card>
                <p slot="title">{{item.seatId}}</p>
                <p>{{showStId(item.studentId)}}</p>
                 <Button v-if="$store.state.user.userInfo.studentId&&item.studentId==null" @click="doSeletSeat(item)" size="small"  type="success" ghost>抢座</Button>
                 <Button v-if="$store.state.user.userInfo.studentId&&item.studentId==$store.state.user.userInfo.studentId" @click="doLeaveSeat(item)" size="small"  type="error" ghost>离开</Button>
            </Card>
       </i-col>
       </Row>
        <Page  @on-change="pageTo"   :total="seatBoth.total" :page-size="pageSize" class="top-adjust-style"/>
   </div>
  
</template>
<script>
import {getSeatInfoAPI,doSelectSeatAPI,doLeaveSeatAPI} from 'apiList/studyRoomAPI'
export default {
    name:'selectStudyRoom',
    data(){
        return {
            seatBoth:{
                total:100
            },
            seatArr:[],
            pageSize:15
        }
    },
    methods:{
       showStId(val){
          if(val==null){
              return '空位'
          }else{
              return val
          }
        },
       pageTo(val){
           this.seatArr=this.seatBoth.seatContent[val-1]
       },
       doSeletSeat(item){
           doSelectSeatAPI({studentId:this.$store.state.user.userInfo.studentId,seatId:item.seatId}).then(result=>{
               this.$Message.success(result.data)
               this.initData()
           })
       },
       doLeaveSeat(item){
           doLeaveSeatAPI({seatId:item.seatId}).then(result=>{
               this.$Message.success(result.data)
               this.initData()
           })
       },
       initData(){
            getSeatInfoAPI().then(result=>{
            this.seatBoth=result.data
            this.seatArr=result.data.seatContent[0]
        })
       }
    },
    created(){
        this.initData()
    }

}
</script>
<style scoped>
   .seat-style{
       margin: 10px;
   }
</style>
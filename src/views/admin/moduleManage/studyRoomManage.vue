<template>
    <div style="padding-top:20px">
        自习室管理
        <Row style="padding-top:200px">   <Button @click="clearSeat">清空所有座位</Button></Row>
      
        <!-- <button ></button> -->
    </div>
</template>
<script>
import { clearSeatAPI } from "apiList/studyRoomAPI";
export default {
    name:'studyRoomManage',
    methods:{
        clearSeat(){
            clearSeatAPI().then(result=>{
                this.$Message.success(result.data)
            })
        }
    }
}
</script>
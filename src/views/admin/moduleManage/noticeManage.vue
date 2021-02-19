<template>
      <div>
        <Row>
            <i-col span="16" style="margin:30px;font-weight:bolder">公告栏</i-col>
             <i-col span="4" style="margin:30px;">
                   <Button  icon="ios-add" @click="addNotice">添加公告</Button>
             </i-col>
        </Row>
        <Row>
        <i-col span="23">
        <List>
            <div class="list-item-style" v-for="(item,index) in noticeList" :key="index">
            <ListItem>
                 {{item.noticeTitle}} 
                <ListItemMeta/>
                <template slot="action">
                   <li>
                     <Icon type="ios-eye-outline"/>{{item.readNum}}
                   </li>
                   <li>
                     {{item.noticeSendDate}}
                   </li>
                   <Poptip
                      confirm
                        title="你确定删除么?"
                        @on-ok="doDeleteNotice(item.noticeId)"
                        style="text-align: left;"
                    >
                        <Button size="small"  icon="ios-trash-outline"></Button>
                   </Poptip>
                </template>
            </ListItem>
            </div>
        </List>
        </i-col>
        </Row>
         <Page :total="pageInfo.total" :current.sync="pageInfo.reCurrent" :page-size="pageInfo.pageSize" @on-change="pageTo" style="margin-top:10px"/>
        <Modal
            v-model="noticeModal"
            width="350px"
            title="输入书架名字"
            @on-ok="ok"
            @on-cancel="cancel"
            >
            <Input v-model="newNotice.noticeTitle" placeholder="Enter Title" style="width: 330px" />
            <Input v-model="newNotice.noticeContent" type="textarea" maxlength="500" placeholder="Enter Content" style="width: 330px;margin-top:20px" />
        </Modal>
    </div>
</template>
<script>
import {getNoticeInManageAPI,addNoticeAPI,deleteNoticeAPI} from 'apiList/admin/noticeManage.js'
export default {
    name:'noticeManage',
    data(){
        return{
            noticeList:[],
            pageInfo:{
                total:80,
                pageSize:8,
                reCurrent:1
            },
            noticeGather:[],
            newNotice:{
                noticeTitle:'',
                noticeContent:'',
                noticeSendDate:''
            },
            noticeModal:false
        }
    },
    methods:{
        addNotice(){
            this.noticeModal=true
        },
        ok(){
            this.newNotice.noticeSendDate=new Date()
            addNoticeAPI(this.newNotice).then(res=>{
                console.log('resss', res)
                if(res.data.state=='success'){
                    this.$Message.success('添加成功')
                    this.newNotice.noticeTitle=''
                    this.newNotice.noticeContent=''
                    this.noticeModal=false
                    this.initNotice()
                }else{
                    this.$Message.error('发生不知道什么错误')
                }
            })
        },
        cancel(){
            this.noticeModal=false
        },
        pageTo(val){
            this.noticeList=this.noticeGather[val-1]
        },
        doDeleteNotice(val){
          deleteNoticeAPI({noticeId:val}).then(result=>{
              if(result.data.state=='success'){
                  this.$Message.success('删除成功')
                  this.initNotice()
              }
        })
        },
        initNotice(){
          getNoticeInManageAPI().then(result=>{
            this.noticeList=result.data.noticeList[0]
            this.pageInfo.total=result.data.total
            this.noticeGather=result.data.noticeList
            this.pageInfo.reCurrent=1
        })
        }
    },
    mounted(){
        this.initNotice()
        // addNoticeAPI({A:1}).then(res=>{
        //     console.log('tag', res)
        // })
        // deleteNoticeAPI({b:2}).then(result=>{
        //     console.log(result)
        // })
    }
    
}
</script>
<style scoped>
   .list-item-style{
       border-bottom: 2px solid lightcyan;
       margin-top:3px;
   }
</style>
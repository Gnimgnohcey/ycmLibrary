<template>
    <div style="padding-top:20px">
        <Row>
            <i-col span="22">
            租借记录表
            <i-input v-model="searchContent" placeholder="Enter text" style="width: auto;float:right;">
               <Icon type="ios-search" slot="suffix" @click="doSearchByUser"/>
           </i-input>
           </i-col>
        </Row>
     
      
        <Row class="top-margin">
            <i-col span="22">
                <Table :columns="columnList" border :data="borrowData" ref="table"></Table>
                <Button class="top-margin" type="primary" size="large" @click="exportData"><Icon type="ios-download-outline"></Icon> 导出当页面数据 </Button>
                <Page  class="top-margin" style="margin-bottom:20px" show-elevator :total='total' :page-size="pageSize" @on-change='PageTo'></Page>
            </i-col>
        </Row>
    </div>
</template>
<script>
import { getBorrowInfoListAPI,updateCheckAPI } from "apiList/admin/borrowInfoManage";
export default {
    name:'borrowInfoManage',
    data(){
       return{
           searchContent:'',
           columnList:[
               {
                   title:'学号',
                   key:'studentId'
               },
               {
                   title:'借阅人',
                   key:'userName',
                   width:'100px',
               },
               {
                   title:'班级',
                   key:'classes',
                   width:'150px',
                   filters: [
                        {
                            label: '网络工程194',
                            value: '网络工程194'
                        },
                        {
                            label: '网络工程195',
                            value: '网络工程195'
                        }
                    ],
                    filterMethod (value, row) {
                         return row.classes==value
                    }
               },
               {
                   title:'借阅书籍',
                   key:'bookName'
               },
               {
                   title:'借阅时长',
                   key:'borrowDaylong',
                   width:'120px',
                   sortable: true
               },
               {
                   title:'借阅时间',
                   key:'borrowTime',
                   render:(h,params)=>{
                       let dataHandle=new Date(params.row.borrowTime)
                       let tranferDate=dataHandle.getFullYear()+'-'+(dataHandle.getMonth()+1)+'-'+dataHandle.getDate()+" "+dataHandle.getHours()+':'+dataHandle.getMinutes()
                       return h('div',{},tranferDate)
                    }
               },
               {
                   title:'归还状态',
                   key:'isReturn',
                   width:'120px',
                   render: (h, params) => {
                       let color = 'default'
                       let showData
                       color = params.row.isReturn == '1' ? 'red' : color
                       showData= params.row.isReturn == '1' ? '已还' : '未还'
                       const editBtn = h(
                        'Tag',{
                               props: {
                               color: color,
                               type: 'border'
                                },
                                style:{
                                    marginLeft:'20px'
                                }
                            },
                          showData
                            )
                        return editBtn
                    },
                   filters: [
                        {
                            label: '已归还',
                            value: 1
                        },
                        {
                            label: '未归还',
                            value: 2
                        }
                    ],
                    filterMethod (value, row) {
                            if (value === 1) {
                                return row.isReturn== 1
                            } else if (value === 2) {
                                return row.isReturn== 0
                            }
                        }
               },
               {
                   title:'稽核',
                   key:'checkState',
                   render:(h,params)=>{
                       let _this=this
                       const checkBtn=h('Button',{
                           props:{
                              type:'default'
                           },
                           on:{
                               click(){
                                   updateCheckAPI({borrowId:params.row.borrowId}).then(result=>{
                                       _this.$Message.success('稽核成功')
                                       _this.initBorrow()
                                   })
                               }
                           }
                       },'稽核')
                       const overCheckBtn=h('Tag',{
                           props:{
                              color:'default'
                           }
                       },'已稽核')

                       if(params.row.isReturn==1||params.row.checkState==1){
                                return overCheckBtn
                       }else{
                                return checkBtn
                       }                  
                   },
                    filters: [
                        {
                            label: '已稽核',
                            value: 1
                        },
                        {
                            label: '未稽核',
                            value: 2
                        }
                    ],
                    filterMethod (value, row) {
                            if (value === 1) {
                                return row.checkState== 1
                            } else if (value === 2) {
                                return row.checkState== 0
                            }
                        }
               }
           ],
           borrowData:[],
           borrowGather:[],
           total:100,
           pageSize:10
       }
    },
    methods:{
        doSearchByUser(){
           this.initBorrow()  
        },
        exportData () {
            this.$refs.table.exportCsv({
                filename: 'no Return',
                original: false
            });
        },
        PageTo(val){
            this.borrowData=this.borrowGather[val-1]
        },
        initBorrow(){
            getBorrowInfoListAPI({searchContent:this.searchContent}).then(result=>{
            this.borrowData=result.data.borrowInfoList[0],
            this.borrowGather=result.data.borrowInfoList
            this.total=result.data.total
            })
        }
    },
    mounted(){
        this.initBorrow()
    //    getBorrowInfoListAPI({isReturn:''}).then(result=>{
    //        this.borrowData=result.data.borrowInfoList[0],
    //        this.borrowGather=result.data.borrowInfoList
    //        this.total=result.data.total
    //    })
   }   
}
</script>
<style  scoped>
   .top-margin{
       margin-top:20px
   }
</style>
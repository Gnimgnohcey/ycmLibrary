<template>
    <div style="padding-top:10px"> 
        <Row>
            <i-col span="16">
                    评论列表
                     <Card  v-for="(item,key) in markExample" :key="key" class="remarkSingle">
                       <p slot="title" style="font-size:10px;font-weight:bolder">
                         <Icon type="md-contact" />
                         {{item.userName}}
                         <Icon type="ios-book-outline" />
                           评价书籍:{{item.bookName}}
                         <Icon type="ios-clock-outline" />
                           发布时间:{{item.sendTime|showData}} 
                       </p>
                       内容:{{item.remarkContent}}
                         <Poptip
                            confirm
                            title="你确定禁言此人么?"
                            @on-ok="doStopRemark(item.studentId)"
                            style="float:right;margin-right:20px;text-align:left"
                        >
                        <Icon type="ios-close-circle-outline" />
                        </Poptip>
                        <Poptip
                            confirm
                            title="你确定删除么?"
                            @on-ok="doDeleteRemark(item.remarkId)"
                            style="float:right;margin-right:5px;text-align:left"
                        >
                        <Icon  type="ios-trash-outline"/>
                        </Poptip>
                 </Card> 
                   <Page style="margin-top:20px;margin-bottom:20px" @on-change="pageTo" :current.sync="divePage.reCurrent"   :total="divePage.total" :page-size="divePage.singlePage" class="top-adjust-style"/> 
            </i-col>
            <i-col span="8">
                禁言列表
                <Row>
                    <Tag v-for="item in stopList" :key="item.forbidId"  closable @on-close="handleClose(item.studentId)">{{item.studentId}} {{ item.userName }}</Tag>
                </Row>

            </i-col>
      
            </Row>              
    </div>
</template>
<script>
import {getAllReMarkAPI,deleteReMarkAPI,retireMarkAPI,stopRemarkAPI,getStopListAPI} from 'apiList/admin/bookRemarkManage'
export default {
    name:'bookRemarkManage',
       filters:{
       showData(resultDate){
            const dataHandle=new Date(resultDate)
            return dataHandle.getFullYear()+'-'+(dataHandle.getMonth()+1)+'-'+dataHandle.getDate()+" "+dataHandle.getHours()+':'+dataHandle.getMinutes()
        }
    },
    data(){
        return {
            divePage:{
                total:100,
                singlePage:8,
                reCurrent:1
            },
            markExample:[],
            remarkGather:[],
            stopList:[]
        }
    },
    methods:{
        handleClose(val){
           retireMarkAPI({studentId:val}).then(result=>{
                this.$Message[result.data.state](result.data.reason)
                this.initStopList()
           })
        },
        pageTo(val){
            this.markExample=this.remarkGather[val-1].remarkSingleContent
        },
        doDeleteRemark(remarkId){
            deleteReMarkAPI({remarkId}).then(result=>{
                if(result.data.state=='success'){
                    this.$Message.success('删除成功')
                    this.loadingInitRemark()
                }else{
                    this.$Message.error("遇到不可抗力")
                }
            })
        },
        loadingInitRemark(){
            getAllReMarkAPI({bookId:''}).then(result=>{
                this.divePage.total=result.data.total
                this.divePage.reCurrent=1
                this.markExample=result.data.content[0].remarkSingleContent
                this.remarkGather=result.data.content
                console.log('...', this.markExample)
            })
        },
        doStopRemark(val){
            stopRemarkAPI({studentId:val}).then(result=>{
                this.$Message[result.data.state](result.data.reason)
                this.initStopList()
            })
        },
        initStopList(){
            getStopListAPI().then(res=>{
                this.stopList=res.data
            })
        }
    },
    created(){
        this.loadingInitRemark()
        this.initStopList()

    }
}
</script>
<style scoped>
   .remarkSingle{
       margin-top:20px;
       text-align: left;
   }
</style>
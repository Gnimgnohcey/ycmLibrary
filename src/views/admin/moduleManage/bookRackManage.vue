<template>
    <div style="padding-top:10px;">
        书架列表
     <Tabs v-model="tabValue" @on-click="changeSelectCate">
        <TabPane :label="item" :name="item" v-for="item in categoryList" :key="item">
                <Row>
                    <i-col span="24">
                        <Button  icon="ios-add" @click="addRack">添加书架</Button>
                    </i-col>
                    <i-col style="margin:30px" span="4" v-for="(item,key) in selectRackList" :key="key">
                        <Card style="width:180px">
                         <p slot="title">
                           {{item.bookRack}}
                         </p>
                          <Poptip
                            confirm
                            title="你确定删除么?"
                            @on-ok="doDelete(item.bookRackId)"
                             style="text-align: left;"
                        >
                           <a href="#" @click.prevent="">
                            <Icon type="ios-trash-outline" />
                                Delete
                           </a>
                          </Poptip>
                        </Card>
                    </i-col>
                </Row>
        </TabPane>
    </Tabs>
      <Modal
        v-model="rackModal"
        width="330px"
        title="输入书架名字"
        @on-ok="ok"
        >
         <Input v-model="rackContent" placeholder="Enter something..." style="width: 300px" />
    </Modal>
    </div>
    
</template>
<script>
import {getBookrackListAPI} from 'apiList/bookRackAPI'
import {getRackByCategoryAPI,addRackAPI,deleteRackAPI} from 'apiList/admin/bookRackManage'
export default {
    name:'bookRackManage',
    data(){
        return{
           categoryList:[],
           selectRackList:[],
           tabValue:'HistoryAndPhilosophy',
           rackModal:false,
           rackContent:''
        }
    },
    methods:{
        ok(){
          addRackAPI({rackName:this.rackContent,category:this.tabValue}).then(result=>{
               this.$Message[result.data.state](result.data.reason)
               this.rackModal=false
               this.rackContent=''
               this.initRackInCate(this.tabValue)
          })

        },
        addRack(){
           this.rackModal=true
        },
        doDelete(rackId){
            deleteRackAPI({bookRackId:rackId}).then(result=>{
                this.$Message[result.data.state](result.data.reason)
                this.initRackInCate(this.tabValue)
            })
        },
        changeSelectCate(val){
             this.initRackInCate(val)
        },
        initRackInCate(val){
           getRackByCategoryAPI({category:val}).then(result=>{
               if(result.data.state!='success'){
                   this.$Message.error(result.data.state)
               }else{
                   this.selectRackList=result.data.result
               }
           })
        }
    },
    created(){
        getBookrackListAPI().then(result=>{
            let categoryList=new Set()
            result.data.forEach(element=>{
                categoryList.add(element.category)
            })
            this.categoryList=[...categoryList]
        })
        //加载初始类别，复用的查询页面的接口

        this.initRackInCate('HistoryAndPhilosophy')
    }
}
</script>
<style scoped>

</style>
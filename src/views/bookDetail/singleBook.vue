<template>
    <div class="content">
        <Row class="bookInfo">
            <i-col span="10">
                <Card style="width:320px;padding:20px;margin-left:20%">
                <div style="text-align:center;">
                    <show-img v-model="bookDetailList.bookOtherGather.imgSrc" :imgAttr="bookSize"></show-img>
                    <!-- <h3>失乐园</h3> -->
                </div>
            </Card>
            </i-col>
            <i-col span="14">
              <List style="width:80%">
                    <ListItem class="bookTitle">{{bookDetailList.bookOtherGather.bookName}}</ListItem>
                    <ListItem>
                        <span class="book-info-decrip">作者:</span>{{bookDetailList.bookOtherGather.author}}
                    </ListItem>
                    <ListItem>
                        <span class="book-info-decrip">出版日期:</span>{{bookDetailList.bookOtherGather.publicTime}}  
                        <span class="book-info-decrip" style="margin-left:20px">出版社:</span>{{bookDetailList.bookOtherGather.publisher}}
                        <span class="book-info-decrip" style="margin-left:20px">库存:</span>{{bookDetailList.bookOtherGather.bookStock}}
                    </ListItem>
                    <ListItem>
                        <span class="book-info-decrip">书架:</span>{{bookDetailList.bookOtherGather.bookRack}}  
                        <span class="book-info-decrip" style="margin-left:20px">层数:</span>{{bookDetailList.bookOtherGather.bookDetailAddress}}
                        <span class="book-info-decrip" style="margin-left:20px">最低可借信用分:</span>{{bookDetailList.bookOtherGather.lowestCredit}}
                    </ListItem>
                    <ListItem>
                       <span class="book-info-decrip" style="display:block;width:20%;">情节描述:</span>
                       <span style="display:block;width:80%">{{bookDetailList.bookOtherGather.bookBrief|abver}}</span>
                    </ListItem>
                </List>
            </i-col>
        </Row>
        <Row class="post-adjust">
            <i-col span="8">
               <Button shape="circle" :size="buttonSize"  class="book-option" ref="Thumb"  @click="selectStateChange('thumbOnclick')">
                     <Icon type="ios-thumbs-up" v-if="thumbState" />
                     <Icon type="ios-thumbs-up-outline" v-if="!thumbState"/>
                   点赞{{bookDetailList.bookOtherGather.bookThumb}}</Button>
            </i-col>
            <i-col span="8"> 
               <Button type="default" shape="circle" :size="buttonSize" ref="Collect"  class="book-option" @click="selectStateChange('collectOnclick')">
                   <Icon type="ios-heart-outline" v-if="!collectState" />
                   <Icon type="ios-heart" v-if="collectState" />
                   收藏{{bookDetailList.bookOtherGather.bookCollect}}</Button>
            </i-col>
            <i-col span="8">
                    <Button type="default" style="width:80%" shape="circle" :size="buttonSize" :disabled="(bookDetailList.bookOtherGather.bookStock==0)" v-if="(bookDetailList.rentState==0)&&bookDetailList.bookOtherGather.bookStock==0">暂无库存</Button>
                    <Button @click="borrowBook" type="default" style="width:80%" shape="circle" :size="buttonSize" v-if="bookDetailList.bookOtherGather.bookStock!=0&&bookDetailList.rentState==0">我要借书</Button>
                    <Button @click="returnBook" type="default" style="width:80%" shape="circle" :size="buttonSize" v-if="(bookDetailList.rentState==1)">我要还书</Button>
            </i-col>
        </Row>
        <div class="post-adjust width-adjust">
            <Row>
                <i-col span="22" style="font-weight:bolder;text-align:left">
                书评<Icon type="ios-chatboxes-outline" /><span style="font-size:6px">{{divePage.total}}</span>
                </i-col>
                <i-col span="2"><Button type="warning" @click="openRemark">评价</Button></i-col>
            </Row>
            <Card   class="top-adjust-style textLeft" v-if="divePage.total==0">
                暂无任何评论
            </Card>
            <Card  v-for="(item,key) in markExample" :key="key" class="top-adjust-style textLeft">
                    <p slot="title">
                       <Icon type="md-contact" />{{item.userName}}
                        <Poptip
                            confirm
                            title="你确定删除么?"
                            @on-ok="doDeleteRemark(item.remarkId)"
                            style="float:right;margin-right:20px;text-align:left"
                        >
                        <Icon v-if="item.studentId==outUserInfo.studentId" type="ios-trash-outline"/>
                        </Poptip>
                     </p>
                     <p>{{item.remarkContent}}</p>
                     <p style="font-size:7px">{{item.sendTime|showData}}</p>
            </Card>        
            <Page @on-change="pageTo"    :total="divePage.total" :page-size="divePage.singlePage" class="top-adjust-style"/>
        </div>
       <Modal
            v-model="borrowBookState"
            title="借书"
            @on-cancel="cancel">
            <Row>
                <i-col span="12"><p>学号:{{outUserInfo.studentId}}</p></i-col>
                <i-col span="12"><p>姓名:{{outUserInfo.userName}}</p></i-col>
            </Row>
            <p>书名:{{bookDetailList.bookOtherGather.bookName}}</p>
            <p>借书时间:{{Number(new Date())|showData}}</p>
            <Row>
                <i-col span="3">
                    <p style="line-height:30px">选择天数:</p>
                </i-col>
                <i-col span="8">
                    <Select  v-model="borrowInfo.borrowDaylong" style="width:150px;text-align:left" placeholder="请选择借书时长">
                        <Option v-for="item in dayList" :value="item" :key="item">{{item}}</Option>
                    </Select>
                </i-col>
                <i-col span="10" style="margin-top:5px;"><Checkbox v-model="certainBorrow">我已确认要借书</Checkbox></i-col>
            </Row>
             <div slot="footer">
                <Button type="default" :loading="saveLoading"  @click="saveBorrowInfo">确定</Button>
            </div>
        </Modal>
        <Modal
            v-model="returnBookModel"
            title="我要还书"
        >
        <p>您确定要还书么？</p>
        <div slot="footer">
           <Button type="default" @click="doReturn">确定</Button>
        </div>
        </Modal>
        <Modal
            v-model="remarkBookModel"
            title="我要评价"
            width="400"
        >
        <p>
             <Input v-model="remarkContent" maxlength="500" show-word-limit type="textarea" placeholder="Enter something..." style="width: 370px" />
        </p>
        <div slot="footer">
           <Button type="default" @click="doRemark">发布</Button>
        </div>
        </Modal>
    </div>
</template>
<script>
import showImg from '../../components/exhibit/showImg/showImg.vue'
import {mapGetters} from 'vuex'
import { getBookOtherInfoAPI } from 'apiList/getBookInfo'
import { borrowBook,returnBook,tcBookAPI,loadingStartTCAPI,sendRemarkAPI,getRemarkAPI,deleteRemarkAPI} from 'apiList/userOperaAPI'
export default {
    name:'bookDetail',
    components: { showImg },
    filters:{
       abver(val){
          if(val&&val.length>150){
            return val.slice(0,200)+'....'
           }
            return val
        },
        showData(resultDate){
            const dataHandle=new Date(resultDate)
            return dataHandle.getFullYear()+'-'+(dataHandle.getMonth()+1)+'-'+dataHandle.getDate()+" "+dataHandle.getHours()+':'+dataHandle.getMinutes()
        }
    },
    data(){
        return{
            selectBookId:0,
            borrowBookState:false,
            returnBookModel:false,
            certainBorrow:false,
            saveLoading:false,
            remarkBookModel:false,
            remarkContent:'',
            borrowInfo:{
               borrowDaylong:7
            },
            dayList:[3,5,7,15],
            bookSize:{
                loadWidth:210,
                loadHeight:230
            },
            thumbState:false,
            collectState:false,
            //用于加载初始值
            thumbOnclick:false,
            collectOnclick:false,
            //用于判断点击事件
            initTCInfo:{},
            bookDetailList:{
               bookOtherGather:{},
               rentState:0,
            },
            buttonSize:"large",
            markExample:[],
            bookRemark:{remarkNum:222},
            divePage:{
                total:0,
                singlePage:3
            },
            remarkGather:[]
        }
    },
    methods:{
        doDeleteRemark(remarkId){
            deleteRemarkAPI({remarkId}).then(result=>{
                if(result.data.state=='success'){
                    this.$Message.success('删除成功')
                    this.loadingInitRemark()
                }else{
                    this.$Message.error("遇到不可抗力")
                }
            })
        },
        pageTo(val){
            this.markExample=this.remarkGather[val-1].remarkSingleContent
        },
        //分页跳转
        openRemark(){
            if(!this.$store.state.user.userInfo.studentId){
               this.$Message.error("请先登陆")
               return 0
            }
           this.remarkBookModel=true
        },
        doRemark(){
            if(this.remarkContent==''){
                this.$Message.error("评论内容不能为空")
            }else{
                sendRemarkAPI({studentId:this.outUserInfo.studentId,bookId:this.selectBookId,remarkContent:this.remarkContent,sendTime:Number(new Date())}).then(result=>{
                console.log(result)
                if(result.data.state==true){
                    this.$Message.success('评论成功')
                    this.loadingInitRemark()
                }else{
                    this.$Message.error(result.data.reason)
                }
                this.remarkBookModel=false
                this.remarkContent=''
              })
            }
        },
        borrowBook(){
          if(!this.$store.state.user.userInfo.studentId){
               this.$Message.error("请先登陆")
               return 0
          }
          if(this.$store.state.user.userInfo.credit>this.bookDetailList.bookOtherGather.lowestCredit){
             this.borrowBookState=true
          }else{
              this.$Message.error(`您的信誉积分没有达到该书的${this.bookDetailList.bookOtherGather.lowestCredit}分的最低要求`)
          }
        },
        returnBook(){
          this.returnBookModel=true
        },
        saveBorrowInfo(){
        if(this.certainBorrow){
            this.saveLoading=true
            this.borrowInfo.borrowTime=Number(new Date)
            borrowBook({studentId:this.outUserInfo.studentId,borrowTime:Number(new Date()),borrowDaylong:this.borrowInfo.borrowDaylong,bookId:this.selectBookId,isReturn:false,backTime:0}).then(result=>{
                if(result){
                    (result.data.responseState=="success")?this.$Message.success('借书成功'):this.$Message.error('你已经借过这本书了')
                    this.borrowBookState=false
                    this.saveLoading=false
                    this.loadWebContent()
                }
            }) 
         }else{
            this.$Message.success("请先确认")
         }
        },
        doReturn(){
            returnBook({studentId:this.$store.state.user.userInfo.studentId,bookId:this.selectBookId,backTime:Number(new Date())}).then(result=>{
                //  (result.data.responseState=="success")?this.$Message.success(result.data.reason):this.$Message.error('不要重复还书')
                 this.$Message[result.data.responseState](result.data.reason)
                 this.loadWebContent()
                 this.returnBookModel=false
                 this.$store.dispatch('getUserInfo',localStorage.getItem("userInfo"))
            })
        },   
        cancel(){
            this.borrowBookState=false
        },
        //关闭模态框
        selectStateChange(val){ 
            if(!localStorage.getItem("userInfo")){
               this.$Message.error("请先登陆")
               return 0
            } 
           this[val]=!this[val]
        },
        changeTCBtnStyle(tcState,val){
            if(tcState){
                this.$refs[val].$el.style.color="red"
            }else{
                this.$refs[val].$el.style.color="grey"
            }
        },
        //加载初始值时不做请求,所以俩个相似的方法需要独立开来
        watchStateChange(val,tcState){
            tcBookAPI({selectOpera:val,doState:tcState,studentId:localStorage.getItem("userInfo"),bookId:this.selectBookId}).then(result=>{
                if(result.data.state=='success'){
                    this.loadWebContent()
                }
            })
        },
        loadWebContent(){
          if(this.selectBookId){
            getBookOtherInfoAPI({bookId:this.selectBookId,studentId:localStorage.getItem("userInfo")}).then(result=>{
                this.bookDetailList=result.data
            })
          }
        },
        loadingTCState(){
           if(this.selectBookId&&localStorage.getItem("userInfo")){
                loadingStartTCAPI({studentId:localStorage.getItem("userInfo"),bookId:this.selectBookId}).then(result=>{
                    this.initTCInfo=result.data
                    if(result.data.initialState){
                        this.thumbState=result.data.initResult.isThumb
                        this.changeTCBtnStyle(this.thumbState,'Thumb')
                        this.collectState=result.data.initResult.isCollect
                        this.changeTCBtnStyle(this.collectState,'Collect')
                   }
                })
           }
        //当登陆状态与书本信息同时存在时,请求点赞状态表内容加载初始
        },
        loadingInitRemark(){
            getRemarkAPI({bookId:this.selectBookId}).then(result=>{
                console.log('result',result.data)
                this.divePage.total=result.data.total
                this.markExample=result.data.content[0].remarkSingleContent
                this.remarkGather=result.data.content
                console.log('...', this.markExample)
            })
        }
    },
    computed:{
        ...mapGetters(['outUserInfo'])
    },
    created(){
        this.selectBookId=this.$route.query.bookId
        this.loadWebContent()
        this.loadingTCState()
        this.loadingInitRemark()
        //加载初始的点赞收藏状态
    },
    watch:{
       thumbOnclick(){
           this.thumbState=!this.thumbState
           this.changeTCBtnStyle(this.thumbState,'Thumb')
           this.watchStateChange('Thumb',this.thumbState)
        },
        collectOnclick(){
           this.collectState=!this.collectState
           this.changeTCBtnStyle(this.collectState,'Collect')
           this.watchStateChange('Collect',this.collectState)
        },
        $route(to,from){
             this.selectBookId=this.$route.query.bookId
             this.loadWebContent()
             this.loadingTCState()
             this.loadingInitRemark()
          }
    }
} 
</script>
<style scoped>
    .content{
        width:90%;
        margin: 0 auto;
    }
    .bookTitle{
        font-weight: bolder;
        font-size:22px;
    }
    .book-info{
        height: 250px;
    }
    .book-info-decrip{
        font-weight: bolder;
    }
    .book-option{
        width:80%;
        color:grey;
        box-shadow:-5px -5px 10px rgba(255,135,11,.1),5px 5px 10px rgba(255,95,11,.3);
        background: linear-gradient(to bottom right,white,rgba(73,35,15,.3));
    }
    .book-option:hover{
        outline:none;
        background: radial-gradient(rgba(73,35,15,.2),white);
        color:grey;
        border: 1px solid wheat;
    }
    .width-adjust{
         width:80%;
    }
    .post-adjust{
        margin: 25px auto;
    }
    .textLeft{
        text-align: left;
    }
    .top-adjust-style{
        margin-top:15px;
    }
</style>

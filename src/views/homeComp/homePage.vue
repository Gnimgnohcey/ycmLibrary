<template>
    <div>
     <show-img v-model="loadImgInfo.loadSrc" :imgAttr="loadImgInfo">
         <div slot="imgDecorate" class="home-page-exhibit">
             <span>精句品读:</span>
             <span class="sentenceContent">{{everyDaySentence[randSentence].content}}</span>
               ——
             <span class="sentenceAuthor">{{everyDaySentence[randSentence].author}}</span>
         </div>
     </show-img>
     <div style="margin-top:20px">
        <Row>
            <i-col span="16" style="border-right:1px solid black">
                <div class="new-book-box">
                    <Row>
                        <i-col span="12" style="text-align:left;">
                            <span class="module-title">
                                新书上架
                            </span>
                        </i-col>
                        <i-col span="12" style="text-align:right">
                             <span class="more-info" @click="toMore('bookList')">
                                查看更多
                            </span>
                        </i-col>
                    </Row>
                    <Row>
                       <i-col v-for='(item,index) in  newBookList' span="8" :key="index">
                           <div class='new-book' @click="toSingleBook(item)" >
                              <show-img v-model="item.imgSrc" :imgAttr="newBookAttr">
                                  <div slot="imgDecorate" :style="{fontSize:'8px'}">
                                      {{item.bookName}}
                                  </div> 
                                </show-img>
                           </div>
                       </i-col>
                    </Row>
                </div>
            </i-col>
            <i-col span="8">
                <div class="news-info">
                     <Row>
                        <i-col span="12" style="text-align:left">
                            <span class="module-title">
                               最新公告
                            </span>
                        </i-col>
                        <i-col span="12" style="text-align:right">
                             <span class="more-info" @click="toMore('bulletBoard')">
                                查看更多
                            </span>
                        </i-col>
                    </Row>
                     <Row>
                        <List style="margin-left:10px">
                            <div v-for="(item,index) in noticeList" :key="index" @click='toSingleNotice(item)'>
                                <ListItem>
                                   {{item.noticeTitle}} 
                                <ListItemMeta :avatar="item.avatar" style="text-align:right" :description="item.noticeSendDate" />
                                <template slot="action">
                                    <li>
                                      <Icon type="ios-eye-outline" />{{item.readNum}}
                                    </li>
                            </template>
                            </ListItem>
                            </div>
                        </List>
                     </Row>
                </div>
            </i-col>
        </Row>
     </div>
    </div>
</template>
<script>
import showImg from '_c/components/exhibit/showImg'
import { getBookListByCondition } from 'apiList/getBookInfo';
import { getNoticeAPI } from 'apiList/getNotice';
export default {
    name:'homePage',
    components:{
         showImg
    },
    filters:{
        abbreviate(val){
            if(val.length>13){
              return val.slice(0,13)+'...'
            }
            return val
           
        }
    },
    data(){
        return{
          loadImgInfo:{
              loadSrc:require('_c/assets/img/book.jpg'),
            //   loadSrc:'http://localhost:3000/static/book2.jpg'静态资源放在本地服务上
              loadWidth:'100%',
              loadHeight:'400',
              loadAlt:''
          },
          everyDaySentence:[
              {
                  content:'书籍是更高等的人类，也是唯一能寄言于未来的人类。',
                  author:'伊·芭·勃朗宁'
              },
              {
                  content:'没有书籍的屋子，就像没有灵魂的躯体。',
                  author:'西塞罗'
              },{
                  content:'好书是伟大心灵的富贵血脉。',
                  author:'弥尔顿'
              }
          ],
          newBookList:[],
          newBookAttr:{
              loadWidth:'100%',
              loadHeight:210,
              loadAlt:''
          },
          noticeList:[]
        }
    },
    computed:{
        randSentence(){
           return Math.floor(Math.random()*this.everyDaySentence.length)
        }
    },
    methods:{
        toSingleBook(item){
            this.$router.push({
                path:'singleBook',
                query: {
                  bookId:item.bookId
                }
            })
        },
        toSingleNotice(item){
            this.$router.push({
               path:'noticeDetail',
               query:{
                   noticeId:item.noticeId
                 }
            })
        },
        toMore(routeAddress){
            this.$router.push({
                name:routeAddress,
                params:{
                    findOpera:'findNew'
                }
            })
        }
    },
    mounted(){
        getBookListByCondition({condition:['findNew']}).then((result)=>{
            const newArray=result.data.dataList[result.data.dataList.length-1].pageContent
            if(newArray.length>3){
              this.newBookList=[...newArray.slice(newArray.length-4,newArray.length-1)]
            }else{
                this.newBookList=[...newArray]
            }       
        })
        getNoticeAPI().then((result) => {
            this.bothNotice=result.data
            this.noticeList=result.data.noticeList[0].noticeData.slice(0,6)
        }) 
    }
}
</script>
<style scoped>
    .home-page-exhibit{
       width: 80%;
       height: 40px;
       margin-left: 10%;
       font-size: 15px;
       font-weight: bolder;
       line-height: 40px;
       border-bottom: 2px solid rgba(255,156,155,.6);
   }
   /* .new-book-box{
       width:100%;
   } */
   .news-info{
       width:100%;
   }
   .more-info{
       color: lightblue;
       margin-right:10%;
       font-size:8px;
   }
   .module-title{
       font-weight: bolder;
       font-size:8px;
       margin-left: 10%;
   }
   .new-book{
       width: 190px;
       padding:10px;
       box-shadow: 0 0 2px lightcoral;
       border-radius: 4px;
       margin: 20px auto;
       overflow: hidden;
       font-size:6px;
       font-weight: bolder;
   }
</style>
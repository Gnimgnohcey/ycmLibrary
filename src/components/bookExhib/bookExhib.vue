<template>
   <div>
     <Row :loading="true">
        <i-col v-for='(item,index) in  singlePageBookList' span="8" :key="index">
            <div class='book' @click="toSingleBook(item)" >
                <show-img v-model="item.imgSrc" :imgAttr="newBookAttr">
                <div slot="imgDecorate" class="book-name">
                    {{item.bookName|smallText}}
                </div> 
                </show-img>
            </div>
        </i-col>
     </Row>
      <Page show-elevator :total="pageInfo.total" :page-size="pageInfo.size" @on-change="pageTo" class="top-adjust-style" style="margin-top:10px"/>
   </div>    
</template>
<script>
import showImg from '../exhibit/showImg'
import { getBookListByCondition } from 'apiList/getBookInfo';
import { searchBookInRackAPI } from 'apiList/bookRackAPI';
export default {
    name:'bookExhib',
    props:{
        value:{
            type:Array
        },
        searchField:{
            type:Object,
            default:null
        },
        handleBookrackSelect:{
            type:Array
        }
    },
    components:{
        showImg
    },
    filters:{
       smallText(val){
          if(val.length>12){
              return val.slice(0,12)+'...'
          }else{
              return val
          }
       }
    },
    data(){
        return{
          newBookAttr:{
            loadWidth:'80%',
            loadHeight:190,
            loadAlt:''
        },
        singlePageBookList:[],
        allBookList:[],
        pageInfo:{
            size:9,
            total:100
          }
        }
    },
    methods:{
         pageTo(val){
           this.singlePageBookList=this.allBookList[val-1].pageContent
         },
         toSingleBook(item){
            this.$router.push({
                path:'singleBook',
                query: {
                  bookId:item.bookId
                }
            })
          },
          findMore(condition,searchField){
             getBookListByCondition({condition,searchField}).then((result)=>{
                 this.pageInfo.total=result.data.total
                 this.singlePageBookList=result.data.dataList[0].pageContent
                 this.allBookList=result.data.dataList
             })
          },
          findSelectTag(bookrack){
            searchBookInRackAPI({bookrack,searchField:this.searchField}).then(result=>{
                    this.pageInfo.total=result.data.total
                    this.singlePageBookList=result.data.dataList[0].pageContent
                    this.allBookList=result.data.dataList
                })
          }
        },
        watch:{
            value(news){
                this.findMore([...news],this.searchField)
                //以数组的形式传入,具体解析在后端来处理
            },
            searchField:{
                 deep:true,
                 handler(val){
                    if(this.handleBookrackSelect.length==0){
                        //判断是否要根据书架来查询,要是父组件书架信息没传入,则调用一层接口findMore
                      this.findMore([...this.value],val)
                    }else{
                      this.findSelectTag([...this.handleBookrackSelect])  
                    }   
                    // 监听到外部传入字符串的变化后将外部传入的对象传入后台
                 }
            },
            handleBookrackSelect(bookrack){
               this.findSelectTag([...bookrack])  
            }
        }
    }
</script>
<style scoped>
   .book{
       width: 190px;
       height: 240px;
       box-shadow: 0 0 2px lightcoral;
       border-radius: 4px;
       margin: 20px auto;
       padding-top:5px;
       overflow: hidden;
   }
   .book-name{
       font-weight: bolder;
       font-size: 5px;
       padding-top:10px;
   }

</style>
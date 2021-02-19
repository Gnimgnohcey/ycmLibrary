<template>
<div>
    <img ref="imgPix" :src="value" :width="imgAttr.loadWidth" :height="imgAttr.loadHeight" :alt="imgAttr.loadAlt" @error="failedLoading"/>
    <slot name="imgDecorate"></slot>
</div>  
</template>
<script>
export default {
    name:'showImg',
    data(){
        return{
        }
    },
    props:{
        value:{
            type:String,
            default:'http://localhost:3000/static/5469ef9c10d6c682b59dd9751abe7d0f.jpeg'
        },
        // imgAttr:Object
        imgAttr:{
            type:Object,
            default:function(){
               return{
                  loadWidth:120,
                  loadHeight:120,
                  loadAlt:''
                }
            }
        }
        
    },
    methods:{
        failedLoading(){
            this.$refs['imgPix'].src=require('_c/assets/img/failedloding.png')
            // 图片报错处理不能有错误,否则会进入死循环
        }
    }
}
</script>
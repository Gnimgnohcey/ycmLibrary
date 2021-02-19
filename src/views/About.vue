<template>
  <div class="about">
    <canvas ref="canvasBox" id="canvas" width="800" height="600"></canvas>
  </div>
</template>
<script>
 export default {
    name:'About',
    data(){
      return{
        currentX:0,
        currentY:5,
        currentSpeechX:1,
        currentSpeechY:1,
        canvas:'',
        ctx:'',
        circleList:[]
      }
    },
    mounted(){
      var canvas=document.getElementById("canvas");
       this.canvas=canvas;
       if(canvas.getContext){
            var ctx=canvas.getContext("2d")
            this.ctx=ctx;
        }
        for(let i=0;i<20;i++){
          this.circleList.push({
            x:this.currentX,
            y:this.currentY,
            r:5,
            speechX:this.currentSpeechX,
            speechY:this.currentSpeechY,
            color:Math.random()*500
          })
          this.currentSpeechX+=1;
          this.currentSpeechY+=1;
          this.currentX+=40
          this.currentY+=30
        }
      var inum=0
      setInterval(()=>{
        inum++
        if(inum%7==0){
         this.ctx.clearRect(0,0,800,600) 
        }
        this.drawPlay()},1000/60)
      // this.drawPlay()
    
    },
    methods:{
      drawPlay(){
       
        this.circleList.map((item)=>{
            this.draw(item)
        })
      },
      draw(circleListBox){
            this.ctx.fillStyle="black"
            this.circleMove(circleListBox)
            this.ctx.beginPath();
            // var num=Math.random()*500;
            this.ctx.arc(circleListBox.x,circleListBox.y,circleListBox.r,0,Math.PI*2,true);
            this.ctx.closePath();
            this.ctx.fillStyle=`#${Math.floor(circleListBox.color)}`
            this.ctx.fill();
            
      },
      circleMove(circleListBox){
         circleListBox.x+=circleListBox.speechX
         if(circleListBox.x>(this.$refs['canvasBox'].width)||circleListBox.x<0){
           circleListBox.speechX*=-1
         }
         circleListBox.y+=circleListBox.speechY
         if(circleListBox.y>(this.$refs['canvasBox'].height)||circleListBox.y<0){
           circleListBox.speechY*=-1
         }
      }
    }
  }
</script>
<style>
  #canvas{
      box-shadow:0 0 10px black;
  }


</style>
<template>
  <div>
    <el-page-header @back="goBack" content="我的个人笔记"  id="mywrite"></el-page-header>
    <hr>
    <div  id="mybody">
      <div class="body">
        <el-skeleton :rows="50" animated :throttle="500" v-if="!context"/>
          <h1 class="tilie">{{tilie}}</h1>
          <div class="context" v-html="context"></div>
          <hr>
          <div class="time">发布于：{{time}}</div>
      </div>
    </div>
    <div class="to_top" v-if="btnFlag" @click="backTop">
      <img  class="go-top" src="../../src/assets/返回顶部.png"  alt="返回顶部">
    </div>
  </div>
</template>

<script>
export default {
    name:'VueDetails',
    data(){
        return{
          tilie:"",
          time:"",
          context:"",
          btnFlag:false
        }
    },
    methods:{
      goBack(){
        // 返回上一页
        this.$router.go(-1)
      },
      // 点击图片回到顶部方法，加计时器是为了过渡顺滑
      backTop () {
          const that = this
          let timer = setInterval(() => {
            let ispeed = Math.floor(-that.scrollTop / 5)
            document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
            if (that.scrollTop === 0) {
              clearInterval(timer)
            }
          }, 16)
      },
    
      // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
      scrollToTop () {
        const that = this
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        that.scrollTop = scrollTop
        if (that.scrollTop > 60) {
          that.btnFlag = true
        } else {
          that.btnFlag = false
        }
      }
    },
    destroyed () {
      window.removeEventListener('scroll', this.scrollToTop)
    },
    mounted(){
        window.addEventListener('scroll', this.scrollToTop)
        // 取出参数(来自上一个页面传数据)
        // console.log(this.$route.query.id)
        var id=this.$route.query.id
        this.$http({
          method:'post',
          url:'http://localhost:3000/getdetail',
          headers:{
              'Content-Type':"application/json;charset=utf-8"
          },
          data:{
            id:id
          }
        }).then(res=>{
          // console.log(res.data);
          res.data.context.forEach(element => {
            this.context+=element+'\n'
          });
          this.time=res.data.index.creationTime
        })
    }
}
</script>

<style lang="less" scoped>
  #mybody{
    padding: 20px;
		top: 0;
		left: 0;
		width:97%;
		min-width: 1000px;
    min-height: 87vh;
    background-color: #FFFFCC;
  }
  .body{
    width: 80%;
    margin: 0 auto;
    padding: 20px;
    background-color: rgba(240, 248, 255, 0.823);
    .time,.timeRight{
      display: inline;
      color: rgb(105, 105, 105);
    }
    .timeRight{
      margin-left: 80%;
    }
  }
  .go-top{
    width: 30px;
    height: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    
  }
  .to_top{
    position: fixed;
    right: 50px;
    bottom: 50px;
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 20%;
    transition-duration:0.5s;
  }

  .to_top:hover{
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transition-duration:0.5s;
  }

</style>
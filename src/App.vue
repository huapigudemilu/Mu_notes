<template>
  <div id="pp">
    <router-view></router-view>
  </div>
</template>



<script>

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      browseTime: 0,  // 浏览时长初始值为 0
      clearTimeSet: null, 
    };
  },
  methods: {
    setTime() {
      //设置定时器
      this.clearTimeSet = setInterval(() => {
        const self=this
        self.$store.commit('getDate')
        self.browseTime=self.$store.state.user.date
        this.browseTime++;
        this.$store.commit('setDate',this.browseTime)
      }, 1000);
    },
    addBrowseRecord(){
      this.$store.commit('getDate')
      this.$store.commit('getName')
      const date=this.$store.state.user.date
      const username=this.$store.state.user.username
      this.$http({
          method:'post',
          url:'http://localhost:3000/savetime',
          data:{
              date:date,
              username:username
          }
      })
    }
  },
  mounted() {
      this.setTime(); // 页面加载完成后开始计时
  },
  beforeDestroy() {
    clearInterval(this.clearTimeSet); // 离开页面后清除定时器
    this.addBrowseRecord(); // 上送后台接口，将浏览时长等信息传到后台，离开当前路由后调用
  },

}
</script>
<style>

#pp{
  min-width: 100vh;
  margin: 0;
}
</style>

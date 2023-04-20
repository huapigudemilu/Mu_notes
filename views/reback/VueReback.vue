<template>
  <div id="mybody">

    
    <el-page-header @back="goBack" content="我的个人笔记"  id="mywrite"></el-page-header>
    <hr>

    <div id="contextbody">
        <el-card class="box-card">
            <el-tree  :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-card>

        <div id="essayshow" v-html="context"></div>
    </div>

  </div>
</template>

<script>
export default {
    name:'VueReback',
    data() {
      return {
        drawer: false,
        direction: 'ltr',
        context:'',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
        goBack(){
            this.$router.push('home');
        },
        handleNodeClick(data) {
            const self=this
            if(data.id){
                self.context=""
                var id=data.id+""
                // console.log(id);
                // 二级（这里是叶子节点）发请求
                self.$http({
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
                        self.context+=element+'\n'
                    });
                })
            }
        }
    },
    mounted(){
        this.$store.commit('getName')
        const username=this.$store.state.user.name
        // 请求文章列表
        this.$http({
            method:'post',
            url:'http://localhost:3000/essaytree',
            data:{
                username:username
            }
        }).then(res=>{
            // console.log(res.data[1][0].essayKind);
            this.data=[]
            for(var i=0;i<res.data.length;i++){
                const source={label: '',level:i,children: []}
                for(var j=0;j<res.data[i].length;j++){
                    const chilsource={label: '',level:2,id:''}
                    chilsource.label=res.data[i][j].essayTitle
                    chilsource.id=res.data[i][j].essayId
                    source.children.push(chilsource)
                }
                source.label=res.data[i][0].essayKind
                this.data.push(source)
            }
            // console.log(this.data);
        })
    }
  }

</script>

<style>
#essayshow{
    background-color: blanchedalmond;
    min-height: 91.9vh;
    padding: 20px;
    flex: 10;
}
#contextbody{
    display: flex;
}
.box-card{
    flex: 2;
}
</style>
<template>
  <div>
    <div style="display: flex;">
        
        <el-page-header @back="goBack" content="我的个人笔记"  id="mywrite"></el-page-header>

        <el-dropdown @command="handleCommand" style="margin-left: 1150px;">
            <span class="el-dropdown-link">
                标签：{{essaykind}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="java">java</el-dropdown-item>
                <el-dropdown-item command="node">node</el-dropdown-item>
                <el-dropdown-item command="vue">vue</el-dropdown-item>
                <el-dropdown-item command="javascript">javascript</el-dropdown-item>
                <el-dropdown-item command="c/c++">c/c++</el-dropdown-item>
                <el-dropdown-item command="liunx">liunx</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

    </div>
    <hr>
    <MarkdownPro
    v-model="count"
    :toolbars="toolbars"
    :height="690"
    :autoSave="true"
    :interval="1000000"
    left-toolbar="undo redo | image"
    :disabled-menus="[]"
    :bordered="false"
    @on-upload-image="onPasteImage"
    @on-ready="onReady"
    @on-copy="onCopy"
    @on-save="onSave"
    theme="dark"
    />
  </div>
</template>

<script>
import TurndownService from 'turndown'
import { MarkdownPro } from 'vue-meditor'
export default {
    name:'VueWrite',
    components:{
        MarkdownPro
    },
    data(){
        return{
            count:'请使用一级标题作为文章的题目',
            essaykind:'java',
            toolbars: {
                h4:true,
                h5:true,
                h6:true,
                uploadImage:true,
                print:true,
                save:true,
                clear:true,
            },
        }
    },
    methods:{
        handleCommand(command) {
            this.essaykind=command
        },
        goBack() {
            // 返回上一页
            this.$router.push('manage');
        },
        onReady (data) {
            console.log(data,'onReady')
        },
        onCopy (text) {
            console.log(text,'onCopy')
        },
        onPasteImage (file) {
            console.log(file,'onPasteImage')
            
        },
        onSave (data) {
            // console.log(data.html);
            this.$store.commit('getName')
            const username=this.$store.state.user.name
            if(!this.$route.query.id){
                // 没有id意味着是新建
                this.$http({
                method:'post',
                url:'http://localhost:3000/context',
                headers:{
                    'Content-Type':"application/json;charset=utf-8"
                },
                data:JSON.stringify({
                    context:data.html,
                    kind:this.essaykind,
                    username:username
                }),
                }).then(()=>{
                    this.$message({
                        type: 'success',
                        message: '保存成功',
                        center: true,
                    })  
                    this.$router.push('manage')
                }).catch((err)=>{
                    this.$message({
                    type: 'error',
                    message: '保存失败'+err,
                    center: true,
                    })  
                })
            }else{
                // 有意味着在原有基础上改
                // console.log('进入了更改保存');
                this.$http({
                    method:'post',
                    url:'http://localhost:3000/updatacontext',
                    headers:{
                        'Content-Type':"application/json;charset=utf-8"
                    },
                    data:{
                        id:this.$route.query.id,
                        context:data.html,
                        kind:this.essaykind,
                    }
                }).then(()=>{
                    this.$message({
                        type: 'success',
                        message: '保存成功',
                        center: true,
                    })  
                    this.$router.push({name:'manage'})
                }).catch((err)=>{
                    this.$message({
                    type: 'error',
                    message: '保存失败'+err,
                    center: true,
                    })  
                })

            }
        }
        },
        mounted(){
            // console.log(this.$route.query.id)
            if(this.$route.query.id){
                this.count=''
                // 如果有参数传递过来，就查询内容并插入页面
                this.$http({
                    method:'post',
                    url:'http://localhost:3000/getdetail',
                    headers:{
                        'Content-Type':"application/json;charset=utf-8"
                    },
                    data:{
                        id:this.$route.query.id,
                    }
                }).then(res=>{
                    // console.log(res.data);
                    var counttemp=''
                    res.data.context.forEach(element => {
                        counttemp+=element+'\n'
                    });
                    var turndownService = new TurndownService()
                    var markdown = turndownService.turndown(counttemp)
                    // console.log(markdown);
                    this.count=markdown
                })
            }
        }
}
</script>

<style lang="less" scoped>
</style>
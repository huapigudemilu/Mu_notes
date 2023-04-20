<template>
  <div>
    <el-page-header @back="goBack" content="我的个人笔记"  id="mywrite"></el-page-header>
    <hr>
    <el-button type="primary" @click="gotoAdd">＋ 再写一篇</el-button>
    <el-input style="width: 150px;margin-left: 1100px;margin-right: 10px;" v-model="searchFrom.keyword" placeholder="请输入内容"></el-input>
    <el-button type="primary" @click="getList(searchFrom.keyword)">搜索</el-button>
    <el-table
    v-loading="loading"
    :data="tableData"
    style="width: 100%">

        <el-table-column
        fixed
        prop="date"
        label="日期"
        width="300">
        </el-table-column>

        <el-table-column
        prop="name"
        label="题目"
        width="400">
        </el-table-column>

        <el-table-column
        prop="tag"
        label="标签"
        width="400"
        :filters="[{ text: 'liunx', value: 'liunx' }, { text: 'java', value: 'java' }, { text: 'html', value: 'html' }, { text: 'javascritp', value: 'javascritp' },{ text: 'vue', value: 'vue' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
            <template slot-scope="scope">
                <el-tag
                :type='tagType(scope.row.tag)'
                disable-transitions>{{scope.row.tag}}</el-tag>
            </template>
        </el-table-column>

        <el-table-column
        label="操作"
        width="400">
        <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteClick(scope.row)" type="text" size="small" style="color:red">删除</el-button>
        </template>
        </el-table-column>

    </el-table>

  </div>
</template>

<script>
export default {
    name:'VueManage',
    methods:{
        getList(tilie=' '){
            // console.log(tilie);
            this.loading=true
            if(tilie==''){
                this.$router.go(0)
            }else{
                this.$store.commit('getName')
                const username=this.$store.state.user.name
                this.$http({
                    url:'http://localhost:3000/essayselbylike',
                    method:'post',
                    data:{
                        username:username,
                        title:tilie
                    }
                }).then(res=>{
                this.tableData=[]
                    for(var i=0;i<res.data.length;i++){
                        var source={id:'',date:'',name:'',tag:''}
                        source.id=res.data[i].essayId
                        source.date=res.data[i].creationTime.slice(0,10)
                        source.name=res.data[i].essayTitle
                        source.tag=res.data[i].essayKind
                        this.tableData.push(source)
                    }
                    this.loading=false
                })
            }
        },
        // 跳转到编辑（新建）
        gotoAdd(){
            this.$router.push('write')
        },
        tagType(tag){
            switch(tag){
                case 'liunx':
                    return 'success';
                case 'java':
                    return 'info';
                case 'html'||'javascritp':
                    return 'warning'
                case 'vue'||'node':
                    return 'danger'
            }
        },
        getAllList(){
            this.$store.commit('getName')
            const username=this.$store.state.user.name
            this.$http({
                method:'post',
                url:'http://localhost:3000/essay',
                data:{
                    username:username
                }
            }).then(res=>{
                // console.log(res.data);
                this.tableData=[]
                for(var i=0;i<res.data.length;i++){
                    var source={id:'',date:'',name:'',tag:''}
                    source.id=res.data[i].essayId
                    source.date=res.data[i].creationTime.slice(0,10)
                    source.name=res.data[i].essayTitle
                    source.tag=res.data[i].essayKind
                    this.tableData.push(source)
                }
                this.loading=false
            })
        },
        resetDateFilter() {
            this.$refs.filterTable.clearFilter('date');
        },
        clearFilter() {
            this.$refs.filterTable.clearFilter();
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        goBack() {
            this.$router.push('home');
        },
        handleClick(row) {
            this.$router.push({path:'/details',query:{id:row.id}})
        },
        deleteClick(row){
            // console.log(row);
            this.$confirm("此操作将永久删除该文章，是否继续？","提示",{
                    confirmButtonText:'确认',
                    cancelButtonText:'取消',
                    type:"waring"
                }).then(()=>{
                    const id=row.id
                    this.$http.get(`http://localhost:3000/deleteEssay?id=${id}`)
                    .then((res)=>{
                        if(res.data==1){
                            this.$message({
                                type: 'success',
                                message: '删除成功',
                                center: true,
                            })
                            this.$router.go(0)
                        }else if(res.data==-1){
                            this.$message({
                                type: 'error',
                                message: '删除失败',
                                center: true,
                            })
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '未知错误',
                                center: true,
                            })
                        }
                        
                    })
                    .catch(err=>{
                        this.$message({
                            type: 'error',
                            message: '删除失败'+err,
                            center: true,
                        })                        
                    })
                })
        },
        editClick(row){
            // console.log(row.id);
            this.$router.push({path:'/write',query:{id:row.id}})
        }
    },
    data(){
        return {
            tableData: [{
                id:1,
                date: '2016-05-02',
                name: '王小虎',
                tag: 'Liunx',
            }],
            searchFrom:{
                keyword:''
            },
            loading:true
        }
    },
    created(){
        this.getAllList()
    }
}
</script>

<style>
</style>
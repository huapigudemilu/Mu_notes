<template>
  <div class="body">
    <!-- 导航栏 -->
    <div id="my_menu">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <!-- <el-menu-item index="1">个人中心</el-menu-item> -->
            <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item index="2-1" @click="gowrite">做笔记</el-menu-item>
                <el-menu-item index="2-2" @click="gomanage">笔记管理</el-menu-item>
                <el-menu-item index="2-3" @click="watchback">笔记树</el-menu-item>
                <el-menu-item index="2-4" @click="logout">退出登录</el-menu-item>
                <el-submenu index="2-5">
                    <template slot="title">其他</template>
                    <el-menu-item index="2-5-1">注销账号</el-menu-item>
                    <el-menu-item index="2-5-2" @click="callme">联系我们</el-menu-item>
                    <!-- <el-menu-item index="2-4-3">选项3</el-menu-item> -->
                </el-submenu>
            </el-submenu>
            <el-menu-item index="3" disabled>广场</el-menu-item>
            <!-- <el-menu-item index="4"><a href="#" style="text-decoration:none" target="_blank">笔记管理</a></el-menu-item> -->
        </el-menu>
    </div>


<div id="main_crad">
    <div>
        <!-- 个人卡片 -->
        <div id="my_info">
            <el-col  :span="16">
                <el-card class="box-card info_card" shadow="hover">
                    <div style="display: flex;">
                        <img :src="user_info.userPic" alt="">
                        <div style="margin-left: 10px;">
                            <h2 style="margin-top: 10px;margin-bottom: 15px;" v-text="user_info.userName"></h2>
                            <p>注册日期：{{user_info.registrationTime}} </p>
                        </div>
                    </div><br>
                    <hr>
                    <div style="height: 8px;"></div>
                </el-card>
            </el-col>
        </div>


    <!-- 最近编辑 -->
        <div id="near_write">
            <el-col  :span="16">
                <el-card style="margin-top: 20px;height: 418px;" shadow="hover">
                    我的笔记
                    <hr>
                    <el-table :data="tableData"  style="font-size: 13px;" max-height="380" v-loading="loading">
                        <el-table-column  
                        :show-overflow-tooltip="true"
                        v-for="(val,key) in tableLabel"
                        :key="key"
                        :prop="key"
                        :label="val"
                        >
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </div>
    </div>

<!-- 轮播图 -->
    <div>
        <el-card shadow="hover" style="height:300px;width: 650px;margin-left: -150px;margin-right: 20px;">
            励志墙
            <hr>
            <el-carousel :interval="3000" type="card" height="200px">
                <el-carousel-item v-for="item in item" :key="item.name">
                    <img :src="item.pic" :alt="item.name" :title="item.name" style="width: 100%;height: 100%;"/>
                </el-carousel-item>
            </el-carousel>
        </el-card>
    </div>


<!-- 文章类型分布 -->
    <div id="me_tips">
        <el-card class="box-card" style="height:300px;" shadow="hover">
            我的笔记分类
            <hr>
            <div id="myHomeChart" ref="homeEcharts" style="height:250px;" ></div>
            
        </el-card>
    </div>

<!-- 时长记录 -->
    <div id="me_histimes">
        <el-card class="box-card" style="height:270px;width: 1070px;" shadow="hover">
            时长记录（分钟）
            <hr>
            <div id="myTimeChart" ref="timeEcharts" style="height:300px;margin-top: -35px;" ></div>
            
        </el-card>
    </div>


</div>



  </div>
</template>

<script>
export default {
    name:'VueHome',
    data(){
        return{
            loading:true,
            activeIndex: '1',
            time_ECharts_X_data:[],
            time_ECharts_Series_data:[150,67,0,92,0,65,123],
            // 后端传入用户信息
            user_info:{
                userName:"",
                userPic: '',
                registrationTime:0
            },
            tableLabel:{
                name:"标题",
                tips:"标签",
                time:"创建时间",
            },
            tableData:[
                {
                    id:1,
                    name:'Liunx笔记',
                    tips:'Liunx',
                    time:'2022/11/12'
                },
                {
                    id:2,
                    name:'javaweb',
                    tips:'java',
                    time:'2022/11/12'
                },
            ],
            data:[
                { value: 500, name: 'Mysql' },
                { value: 300, name: '汇编' },
                { value: 200, name: '操作系统' },
                { value: 500, name: 'java' },
                { value: 100, name: 'js' }
            ],
            item:[
            {
              name:'相信自己',
            //   scr:'https://you.ctrip.com/sight/xichang592/19706.html',
              pic:require('../../src\\assets\\3487843.jpg'),
            },
            {
              name:'突破自己',
            //   scr:'https://you.ctrip.com/sight/chengdu104/4226.html',
              pic:require('../../src\\assets\\3487844.jpg'),
            },
            {
              name:'超越自己',
            //   scr:'https://you.ctrip.com/sight/xichang592/49892.html',
              pic:require('../../src\\assets\\3487853.jpg'),
            },
            {
              name:'成就自己',
            //   scr:'https://you.ctrip.com/sight/liangshanzhou912/19705.html',
              pic:require('../../src\\assets\\3487858.jpg'),
            }
          ]
        }
    },
    mounted() {
        this.$store.commit('getName')
        const username=this.$store.state.user.name
        this.$http({
            method:"post",
            url:'http://localhost:3000/userinfo',
            data:{
                username:username
            }
        }).then(res=>{
            // console.log(res.data,'userinfo');
            this.user_info=res.data
            this.user_info.registrationTime=this.user_info.registrationTime.slice(0,10)
            this.time_ECharts_Series_data=res.data.time
            // console.log(this.time_ECharts_Series_data);
            // 调用当前图表
            this.timeChart()
        })
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
                var source={id:'',name:'',time:'',tips:''}
                source.id=res.data[i].essayId
                source.name=res.data[i].essayTitle
                source.time=res.data[i].creationTime.slice(0,10)
                source.tips=res.data[i].essayKind
                this.tableData.push(source)
            }
            this.loading=false
        })
        this.$http({
            method:'post',
            url:'http://localhost:3000/kdandcount',
            data:{
                username:username
            }
        }).then(res=>{
            // console.log(this.data);
            this.data=[]
            for(var i=0;i<res.data.length;i++){
                var mykind={value:'',name:''}
                mykind.name=res.data[i].essayKind
                mykind.value=res.data[i].count
                this.data.push(mykind)
                this.dataChart()
            }
            // console.log(this.data);
        })

        
    },
    methods:{
        callme(){
            this.$alert('邮箱：875480722@qq.com', '联系我们', {
            confirmButtonText: '确定',
            callback: action => {
                this.$message({
                type: 'info',
                message: `action: ${ action }`
                });
            }
            });
        },
        watchback(){
            this.$router.push('reback')
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        gomanage(){
            this.$router.push('manage')
        },  
        gowrite(){
            this.$router.push('write')
        },
        logout(){
            this.$store.commit('getDate')
            this.$store.commit('getName')
            const date=this.$store.state.user.date
            const username=this.$store.state.user.name
            // console.log(username);
            this.$http({
                method:'post',
                url:'http://localhost:3000/savetime',
                data:{
                    date:date,
                    username:username
                }
            })
            // console.log(date);
            this.$router.push('/')
            this.$store.commit('clearName')
            this.$store.commit('clearDate')
        },
        dataChart() {
        // //初始化图表，this.$refs.homeEcharts获取到图表容器
        var myChart = this.$echarts.init(this.$refs.homeEcharts)
        var option;
        option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '0%',
            left: 'center'
        },
        series: [
            {
            name: 'Access From',
            type: 'pie',
            radius: ['3%', '65%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data:this.data
            }
        ]
        };

        option && myChart.setOption(option);
        },
        timeChart() {
        //初始化图表，this.$refs.homeEcharts获取到图表容器
        var myChart = this.$echarts.init(this.$refs.timeEcharts)
        var option = {
            // An highlighted block
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.time_ECharts_X_data
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: this.time_ECharts_Series_data,
                    type: 'line',
                    lineStyle: {
                        color: '#CCFFCC'
                    },
                    areaStyle: {
                        color: '#CCFFCC'
                    }
                }
            ]
        };
        // 把参数配置放到容器里
        myChart.setOption(option)
        },
    },
}
</script>

<style lang="less" scoped>
    *{
        margin: 0;   
    }
    .body{
        // background-color: #CCFFFF;
        background: linear-gradient(rgba(21, 255, 138, 0.5), rgba(17, 228, 232, 0.5));
        height: 97vh;
    }
    #my_menu{
        margin-bottom: 30px;
    }
    #my_info,#me_tips,#near_write{
        
        width: 500px;
    }
    #my_info img{
        width: 80px;
        height: 80px;
    }
    #my_info,#near_write{
        margin-left: 50px;
    }
    .info_card{
        background-color: #FFFFFF;
    }
    #me_tips{
        width: 400px;
    }
    #main_crad{
        display: flex;
    }
    #me_histimes{
        position: absolute;
        top: 420px;
        left: 409px;
    }
</style>
<template>
    <el-card class="box-card body">
      <img src="../../src/assets/uugai.com_1669555514434.png" height="120" width="528.6" alt="">
      <el-row type="flex" justify="center" style="margin-top: 10%;">
        <el-col :span="6">
          <el-form 
            class="fromcard"
            label-position="left" 
            label-width="80px" 
            :model="formLogin"
            :rules="rules"
            ref="formLogin">

            <el-form-item style="width: 400px;margin-top: 70px;margin-left: 55px;" prop="name">
              <el-input v-model="formLogin.name" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item style="width: 400px;margin-left: 55px;" prop="password">
              <el-input v-model="formLogin.password" type="password" placeholder="请输入密码" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item style="margin-left: -4%;">
                <el-button type="primary" style="width: 320px;" @click="login">登录</el-button>
                <el-button class="enroll" type="text" @click="dialogVisible = true">点击注册</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        
        <el-dialog
          title="注册信息"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
        
          <el-form 
          label-position="left" 
          label-width="80px" 
          :model="enroll"
          :rules="rules"
          ref="enroll">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="enroll.name"></el-input>
            </el-form-item>
            <el-form-item label="邮 箱" prop="emil">
              <el-input v-model="enroll.emil"></el-input>
            </el-form-item>
            <el-form-item label="密 码" prop="password">
              <el-input v-model="enroll.password" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 13%;">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="toEnroll">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-row>
    </el-card>
  </template>
  
  <script>
    import md5 from 'js-md5';
    export default {
      name:'VueLogin',
      data(){
        let checkUserName = (rule,value,cb)=>{
          if(!value){
            return cb(new Error('账户不能为空!'))
          }else{
            cb(); // 将判断传递给后面
          }
        }
        let checkPassword = (rule,value,cb)=>{
          if(!value){
            return cb(new Error('密码不能为空!'))
           }else{
            cb();
           }
        }
        let checkEmil = (rule,value,cb)=>{
          if(!value){
            return cb(new Error('邮箱不能为空!'))
           }else{
            cb();
           }
        }
        return{
          dialogVisible: false,
          formLogin:{
            name: '',
            password: '',
          },
          enroll:{
            name:'',
            password:'',
            emil:''
          },
          rules:{
            name:[
              {validator:checkUserName,trigger: 'blur'}
            ],
            password:[
              {validator:checkPassword,trigger: 'blur'}
            ],
            emil:[
              {validator:checkEmil,trigger: 'blur'}
            ]
          }
        }
      },
      methods:{ 
        // 注册
        toEnroll(){
          this.$http({
            method:'post',
            url:'http://localhost:3000/enroll',
            data:{
              username:this.enroll.name,
              useremil:this.enroll.emil,
              userpassword:md5(this.enroll.password)
            }
          }).then((res)=>{
            if(res.data==-1){
              this.$message.warning('该用户名已被占用')
            }else if(res.data==0){
              this.$message.warning('该邮箱以注册过')
            }else if(res.data==1){
              this.$message.success('注册成功')
              this.dialogVisible = false
            }else if(res.data==520){
              this.$message.error('不是合法的邮箱')
            }
          })
        },
        handleClose(done) {
          this.$confirm('确认要取消注册？')
            .then(()=> {
              done();
            })
            .catch(() => {});
        },
        // 向登录接口发起请求
        login(){
          const self=this
          let user = this.formLogin
          let formData = {
            name: user.name,
            password: user.password
          }
          self.$http({
            method:'post',
            url:'http://localhost:3000/login',
            data:{
                username:formData.name
            }
        }).then(res => {
              // console.log(res.data==md5(formData.password));
              if (res.data==md5(formData.password)) {
                  self.$store.commit('clearName')
                  self.$store.commit('setName',this.formLogin.name)
                  self.$store.commit('getDate')
                  // console.log(self.$store.state.user.name);
                  self.$store.commit('clearDate')
                  self.$store.commit('setDate',0)
                  this.$message.success('登陆成功')
                  // 登录成功 跳转至首页
                  this.$router.push({name:'home'}) 
              }else{
                  this.$message.error('用户名或密码错误');
                  return false;
              }
          })
          .catch(err => {
              this.$message.warning('用户不存在',err)
          })
        },
      }
    }
  </script>

  <style lang="less" scoped>
    .body{
        background-color: aquamarine;
        background: linear-gradient(rgba(21, 255, 138, 0.5), rgba(17, 228, 232, 0.5)), no-repeat center/100% url(../../src/assets/pexels-youngdae-kim-12704642.jpg);
        height:97vh;
    }
    img{
      position: absolute;
      left: 25px;
      top: 14px;
    }
    .enroll{
      display: inline;
      position: relative;
      left: -70px;
      top: 40px;
      cursor: pointer;
      color: rgb(105, 105, 105);
    }
    .enroll:hover{
      color: rgb(81, 81, 81);
    }
    .fromcard{
      border: 1px solid rgba(128, 128, 128, 0.429);
      width: 600px;
      height: 300px;
      text-align: center;
      margin-left: -90px;
      border-radius: 12px;
      background-color: rgba(221, 221, 221, 0.327);
    }

  </style>
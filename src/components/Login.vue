<template>
    <div id="login">
      <div class="loginDiv">
        <Card style="width:350px;padding: 16px">
          <p slot="title">用户登录</p>
          <Form ref="formInline" :model="formInline" :rules="ruleInline" >
            <FormItem prop="userName">
              <Input type="text" v-model="formInline.userName" placeholder="Username">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="Password">
              <Icon type="ios-locked-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" class="ivu-btn ivu-btn-primary ivu-btn-long" @click="handleSubmit('formInline')">登录</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        formInline: {
          userName: '',
          password: ''
        },
        ruleInline: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { type: 'string', min: 3, message: '密码不能小于6位数', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$ajax.post('/user/doLogin',this.formInline).then((result)=>{
              console.log(result);
              if (result.data.success){
                this.$router.push({path:'/home'});
              }
            });
          }
        })
      }
    }
  }
</script>
<style>
  #login {
    background-image: url('/static/login.jpg');
    height: 100%;
    width: 100%;
    position: relative;
    background-size: cover;
  }

  .loginDiv{
    float: right;
    margin-right: 10%;
    margin-top: 20%;
  }
</style>

<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>
              Item 1
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>
              Item 2
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>
              Item 3
            </MenuItem>
            <MenuItem name="4">
              <Icon type="ios-paper"></Icon>
              Item 4
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu @on-select="showComponent" active-name="" theme="light" width="auto" >
            <Submenu v-for="menu in menus" :key="menu.id" :name="menu.name" v-if="menu.level==1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                {{menu.name}}
              </template>
              <MenuItem v-for="menuItem in menu.childrens" :key="menuItem.id" :name="menuItem.routerName">{{menuItem.name}}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <!--<Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>{{activMenu}}</BreadcrumbItem>
          </Breadcrumb>-->
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        menus:[]
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        var self=this;
        this.$ajax.get('/getMenuInfo')
          .then(function(response){
            if(response.data.resultCode==200){
              self.menus=response.data.data;
            }
          });
      })

    },
    methods:{
      showComponent(name) {
        this.$router.push({name:name})
      }
    }
  }
</script>

<template>
  <div>
    <div id="searchDiv">
      <strong>姓名：</strong><Input size="small" v-model="searchData.name" style="width: 150px"></Input>
      <strong>电话：</strong><Input size="small" v-model="searchData.phone" style="width: 150px"></Input>
      <Button size="small" style="margin-left: 20px" @click="updateTable" type="primary" icon="ios-search">搜索</Button>
    </div>
    <div style="margin: 10px">
      <Button size="small" @click="modal = true" style="margin-left: 5px" type="primary" icon="person-add">新增</Button>
    </div>
    <Table border :columns="columns" :data="data"></Table>
    <Page style="margin-top: 10px" @on-change="pageChange" @on-page-size-change="sizeChange" :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.size" show-sizer show-elevator show-total></Page>
    <Modal
      v-model="modal"
      title="用户信息"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="customerInfo" :model="customerInfo" :label-width="80" :rules="formRules">
        <FormItem prop="name" label="姓名">
          <Input type="text"  v-model="customerInfo.name" placeholder="输入用户姓名"></Input>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="customerInfo.gender">
            <Radio label="0">女</Radio>
            <Radio label="1">男</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="电话号码">
          <Input  v-model="customerInfo.phone" placeholder="输入手机号码"></Input>
        </FormItem>
        <FormItem label="地址">
          <Input  v-model="customerInfo.address" placeholder="输入地址"></Input>
        </FormItem>
        <FormItem label="生日">
          <DatePicker  format="yyyy-MM-dd" @on-change="dateSet" :value="customerInfo.birth" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
          <Button @click="cancel" shape="circle">取消</Button>
        <Button @click="ok" type="primary" shape="circle">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import index from "../router";

  export default {
    data () {
      return {
        columns: [
          {
            title: '姓名',
            key: 'name',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.name)
              ]);
            }
          },
          {
            title:'性别',
            key:'gender',
            render:(h,params)=>{
              if(params.row.gender==='1'){
                return h('div',{},'男')
              }
              else if(params.row.gender==='0'){
                return h('div',{},'女')
              }
            }
          },
          {
            title: '电话',
            key: 'phone'
          },
          {
            title: '地址',
            key: 'address'
          },
          {
            title:'生日',
            key:'birth'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              var edit=true;
              var del=true;
              /*this.$ajax.get('/ispermision/customer:edit').then(function (response) {
                edit=response.data;
              });
              this.$ajax.get('/ispermision/customer:delete').then(function (response) {
                del=response.data;
              });*/
              if (edit&&del ){
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    directives:{
                      name:"permision",
                      expression:"admin"
                    },
                    on: {
                      click: () => {
                        this.show(params.index)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.remove(params.index)
                      }
                    }
                  }, '删除')
                ]);
              }
              else if (edit){
                return h('div',[
                  h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    style:{
                      marginRight:'5px'
                    },
                    on:{
                      click:()=>{
                        this.show(params.index)
                      }
                    }
                  },'编辑')
                ])
              }
              else if (del){
                return h('div',[
                  h('Button',{
                    props:{
                      type:'error',
                      size:'small'
                    },
                    style:{
                      marginRight:'5px'
                    },
                    on:{
                      click:()=>{
                        this.remove(params.index)
                      }
                    }
                  },'删除')
                ])
              }
              else {
              return null;
              }
            }
          }
        ],
        data: [

        ],
        modal:false,
        searchData:{
          name:'',
          phone:''
        },
        customerInfo:{
          name:'',
          gender:'',
          phone:'',
          address:'',
          birth:''
        },
        pageInfo:{
          size:20,
          page:1,
          total:100
        },
        formRules:{
          name:[
            {required:true,type:'string',message:'用户姓名不能为空',trigger:'blur'}
          ]
        }
      }
    },
    methods: {
      show (index) {
        this.customerInfo=JSON.parse(JSON.stringify(this.data[index]));
        this.modal=true;
      },
      remove (index) {
        this.customerInfo=JSON.parse(JSON.stringify(this.data[index]));
        this.customerInfo.isdelete=1;
        this.ok();
      },
      ok(){
        console.log(this.customerInfo);
        this.$refs['customerInfo'].validate((valid)=>{
          if (valid){
            this.$ajax.post(
              '/customer/addOrUpdate',
              this.customerInfo
            ).then((response)=>{
              if (response.data.success){
                this.$Message.success(response.data.message);
              }
            });
            this.updateTable();
            this.modal=false;
            this.$refs['customerInfo'].resetFields();
            this.customerInfo={};
          }
        });
      },
      cancel (){
        this.$refs['customerInfo'].resetFields();
        this.customerInfo={};
        this.modal=false;
      },
      dateSet(date){
        this.customerInfo.birth=date;
      },
      pageChange (page){
        this.pageInfo.page=page;
        this.updateTable();
      },
      sizeChange (size){
        this.pageInfo.size=size;
        this.updateTable();
      },
      updateTable(){
        this.$ajax.post('/customer/getCustomerPageData',{
          name:this.searchData.name,
          phone:this.searchData.phone,
          page:this.pageInfo.page,
          size:this.pageInfo.size
        }).then((response)=>{
          if (response.data.success){
            this.data=response.data.data.list;
            this.pageInfo.total=response.data.data.total;
            this.pageInfo.page=response.data.data.pageNum;
            this.pageInfo.size=response.data.data.pageSize;
          }
        });
      }
    },
    mounted:function () {
      this.$nextTick(()=>{
      this.updateTable();
      });
    }
  }
</script>
<style scoped>
  #searchDiv{
    margin: 20px;
  }

</style>

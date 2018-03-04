<template>
  <div>
    <div id="searchDiv">
      <strong>姓名：</strong><Input size="small" style="width: 150px"></Input>
      <strong>电话：</strong><Input size="small" style="width: 150px"></Input>
      <Button size="small" style="margin-left: 20px" type="primary" icon="ios-search">搜索</Button>
    </div>
    <div style="margin: 10px">
      <Button size="small" @click="modal = true" style="margin-left: 5px" type="primary" icon="person-add">新增</Button>
    </div>
    <Table border :columns="columns" :data="data"></Table>
    <Modal
      v-model="modal"
      title="用户信息"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form :model="customerInfo" :label-width="80">
        <FormItem label="姓名">
          <Input  v-model="customerInfo.name" placeholder="输入用户姓名"></Input>
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
            title: 'Action',
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
          {
            name: 'John Brown',
            phone: 15302265314,
            address: 'New York No. 1 Lake Park',
            birth:'1996-02-09',
            gender:'0'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            gender:'1'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park'
          }
        ],
        modal:false,
        customerInfo:{
          name:'',
          gender:'',
          phone:'',
          address:'',
          birth:''
        },
        editIndex:'',
      }
    },
    methods: {
      show (index) {
        this.editIndex=index;
        this.customerInfo=JSON.parse(JSON.stringify(this.data[index]));
        this.modal=true;
      },
      remove (index) {
        this.data.splice(index, 1);
      },
      ok(){
        console.log(this.customerInfo);
        this.$ajax.post(
          '/customer/add',
          this.customerInfo
        ).then((response)=>{
          if (response.data.success){
            this.$Message.success(response.data.message);
          }
          else {
            this.$Message.error(response.data.message);
          }
        })
        this.customerInfo="";
      },
      cancel (){
        this.customerInfo="";
      },
      dateSet(date){
        this.customerInfo.birth=date;
      }
    }
  }
</script>
<style scoped>
  #searchDiv{
    margin: 20px;
  }

</style>

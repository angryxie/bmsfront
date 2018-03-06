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
      <div>
        <Table border :columns="columns" :data="data"></Table>
        <Page style="margin-top: 10px" @on-change="pageChange" @on-page-size-change="sizeChange" :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.size" show-sizer show-elevator show-total></Page>
      </div>
      <div id="subTable"><Table border :columns="subColums" :data="subData"></Table></div>
      <div>
        <Modal @on-cancel="orderCancel" v-model="modal" title="订单信息" >
          <Form  :model="orderInfo" :label-width="80" >
            <FormItem label="订单号">
              <strong>{{orderInfo.orderCode}}</strong>
            </FormItem>
            <FormItem label="客户姓名">
              <Input type="text" v-model="orderInfo.name"/>
            </FormItem>
            <FormItem label="联系电话">
              <Input type="text" v-model="orderInfo.phone"/>
            </FormItem>
            <FormItem label="预约时间">
              <DatePicker  format="yyyy-MM-dd" @on-change="orderDateSet" :value="orderInfo.appointment" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="订单价格">
              <Input type="text" v-model="orderInfo.price"/>
            </FormItem>
            <FormItem label="已付金额">
              <Input type="text" v-model="orderInfo.paid"/>
            </FormItem>
            <FormItem label="未付金额">
              <Input type="text" v-model="orderInfo.unPaid"/>
            </FormItem>
            <FormItem label="备注">
              <Input type="textarea" v-model="orderInfo.remark"/>
            </FormItem>
            <FormItem label="发票号">
              <Input type="text" v-model="orderInfo.invoiceCode"/>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button @click="orderCancel" shape="circle">取消</Button>
            <Button @click="orderOk" type="primary" shape="circle">确认</Button>
          </div>
        </Modal>
      </div>
    </div>
</template>

<script>
    export default {
        name: "",
        data(){
          return {
            searchData:{},
            columns:[
              {
                title:'订单号',
                key:'orderCode'
              },
              {
                title:'客户姓名',
                key:'name'
              },
              {
                title:'联系电话',
                key:'phone'
              },
              {
                title:'预约时间',
                key:'appointment'
              },
              {
                title:'价格',
                key:'price'
              },
              {
                title:'已付款',
                key:'paid'
              },
              {
                title:'未付款',
                key:'unpaid'
              },{
                title:'备注',
                key:'remark'
              },
              {
                title:'发票号',
                key:'invoiceCode'
              },
              {
                title:'操作',
                key:'action',
                render:(h,params)=>{

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
                            this.orderShow(params.index)
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
                            this.orderRemove(params.index)
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
            data:[],
            subColums:[
              {
                title:'订单行号',
                key:'entryCode'
              },
              {
                title:'项目名',
                key:'name'
              },
              {
                title:'价格',
                key:'price'
              },
              {
                title:'备注',
                key:'remark'
              },
              {
                title:'负责人',
                key:'owner'
              }
            ],
            subData:[],
            modal:false,
            orderInfo:{},
            pageInfo:{
              size:20,
              page:1,
              total:100
            }
          }
        },
      methods:{
        updateTable(){
          this.$ajax.post('/order/getOrderPageData',{
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
        },
        pageChange (page){
          this.pageInfo.page=page;
          this.updateTable();
        },
        sizeChange (size){
          this.pageInfo.size=size;
          this.updateTable();
        },
        orderOk(){
          this.$ajax.post('/order/addOrUpdate',this.orderInfo).then((response)=>{
            const data=response.data;
            if (data.success){
              this.$Message.success(data.message);
              this.updateTable();
              this.modal=false;
              this.orderInfo={};
            }
          });
        },
        orderCancel(){
          this.modal=false;
          this.orderInfo={}
        },
        orderDateSet(value){
          this.orderInfo.appointment=value;
        },
        orderShow(index){
          this.orderInfo=JSON.parse(JSON.stringify(this.data[index]));
          this.modal=true;
        },
        orderRemove(index){

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
  #subTable{
    margin-top: 20px;
    width: 60%;
  }
</style>

<template>
    <div>
      <div id="searchDiv">
        <strong>姓名：</strong><Input size="small" v-model="searchData.name" style="width: 150px"></Input>
        <strong>电话：</strong><Input size="small" v-model="searchData.phone" style="width: 150px"></Input>
        <Button size="small" style="margin-left: 20px" @click="updateTable" type="primary" icon="ios-search">搜索</Button>
      </div>
      <div style="margin: 10px">
        <Button size="small" @click="addOrder" style="margin-left: 5px" type="primary" icon="android-list">新增</Button>
      </div>
      <div>
        <Table highlight-row @on-row-click="selectOne" border :columns="columns" :data="data"></Table>
        <Page style="margin-top: 10px" @on-change="pageChange" @on-page-size-change="sizeChange" :total="pageInfo.total" :current="pageInfo.page" :page-size="pageInfo.size" show-sizer show-elevator show-total></Page>
      </div>
      <div v-if="subDivShow">
        <div style="margin: 10px 0px 0px 10px">
          <Button size="small" @click="addOrderEntry" style="margin-left: 5px" type="primary" icon="android-list">新增订单行</Button>
        </div>
        <div id="subTable"><Table border :columns="subColums" :data="subData"></Table></div>
      </div>
      <div>
        <Modal @on-cancel="modal=false" v-model="modal" title="订单信息" >
          <Form ref="orderRef" :model="orderInfo" :label-width="80" :rules="orderRules">
            <FormItem label="订单号">
              <strong>{{orderInfo.orderCode}}</strong>
            </FormItem>
            <FormItem label="客户姓名" prop="name">
              <Input type="text" v-model="orderInfo.name"/>
            </FormItem>
            <FormItem label="联系电话" prop="phone">
              <Input type="text" v-model="orderInfo.phone"/>
            </FormItem>
            <FormItem label="预约时间">
              <DatePicker  format="yyyy-MM-dd" @on-change="orderDateSet" :value="orderInfo.appointment" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="订单价格" prop="price">
              <Input type="text" v-model="orderInfo.price"/>
            </FormItem>
            <FormItem label="已付金额" prop="paid">
              <Input type="text" v-model="orderInfo.paid"/>
            </FormItem>
            <FormItem label="未付金额" prop="unpaid">
              <Input type="text" v-model="orderInfo.unpaid"/>
            </FormItem>
            <FormItem label="备注">
              <Input type="textarea" v-model="orderInfo.remark"/>
            </FormItem>
            <FormItem label="发票号">
              <Input type="text" v-model="orderInfo.invoiceCode"/>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button @click="modal=false" shape="circle">取消</Button>
            <Button @click="orderOk" type="primary" shape="circle">确认</Button>
          </div>
        </Modal>
      </div>
      <div>
        <Modal v-model="entryModal" title="订单行信息">
          <Form ref="orderEntryRef" :rules="orderEntryRules" :model="orderEntryInfo" :label-width="80">
            <FormItem label="订单行号">
              <strong>{{orderEntryInfo.entryCode}}</strong>
            </FormItem>
            <FormItem prop="name" label="项目名">
              <Input type="text" v-model="orderEntryInfo.name"/>
            </FormItem>
            <FormItem label="价格" prop="price">
              <Input type="text" v-model="orderEntryInfo.price"/>
            </FormItem>
            <FormItem label="备注">
              <Input type="textarea" v-model="orderEntryInfo.remark"/>
            </FormItem>
            <FormItem label="负责人" prop="owner">
              <Select filterable v-model="orderEntryInfo.owner" style="width:100px">
                <Option v-for="(item,index) in userInfo" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button @click="entryModal=false" shape="circle">取消</Button>
            <Button @click="orderEntryOk" type="primary" shape="circle">确认</Button>
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
            orderRules:{
              name:[
                {required:true,message:"请输入客户姓名",trigger:"blur"}
              ],
              phone:[
                {required:true,message:"电话号码不能为空",trigger:"blur"},
                {validator(rule, value, callback){
                    var errors=[];
                    if(!(/^1\d{10}$/.test(value))){
                      callback("请输入正确的手机号码");
                    }
                    callback(errors);
                  }}
              ],
              price:[
                {required:true,message:"金额不能为空",trigger:"blur"},
                {type:"number",message:"请输入正确的金额",trigger:"blur",transform(value){
                    return Number(value);
                  }}
              ],
              paid:[
                {required:true,message:"已付金额不能为空",trigger:"blur"},
                {type:"number",message:"请输入正确的金额",trigger:"blur",transform(value){
                    return Number(value);
                  }}
              ],
              unpaid:[
                {required:true,message:"未付金额不能为空",trigger:"blur"},
                {type:"number",message:"请输入正确的金额",trigger:"blur",transform(value){
                    return Number(value);
                  }}
              ]
            },
            orderEntryRules:{
              name:[
                {required:true,message:"项目名不能为空",trigger:"blur"}
              ],
              price:[
                {required:true,message:"金额不能为空",trigger:"blur"},
                {type:"number",message:"请输入正确的金额",trigger:"blur",transform(value){
                    return Number(value);
                  }}
              ],
              owner:[
                {validator(rule,value,callback){
                  var errors=[];
                  if (value&&value!=""){
                    callback(errors);
                  }
                  callback("请选择正确的负责人");
                  }},
              ]

            },
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
                key:'ownerName'
              },
              {
                title:"操作",
                key:"action",
                render:(h,params)=>{
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
                          this.orderEntryInfo=this.subData[params.index];
                          this.entryModal=true;
                        }
                      }
                    },"编辑"),
                    h('Button',{
                      props:{
                        type:"error",
                        size:"small"
                      },
                      style:{
                        marginRight:"5px"
                      },
                      on:{
                        click:()=>{
                          this.orderEntryRemove(params.index);
                        }
                      }
                    },"删除")
                  ])
                }
              }
            ],
            subData:[],
            modal:false,
            entryModal:false,
            orderInfo:{},
            orderEntryInfo:{},
            pageInfo:{
              size:20,
              page:1,
              total:100
            },
            userInfo:[],
            subDivShow:false
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
              this.subDivShow=false;
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
          this.$refs['orderRef'].validate((valid)=>{
            if (valid){
              this.$ajax.post('/order/addOrUpdate',this.orderInfo).then((response)=>{
                const data=response.data;
                if (data.success){
                  this.$Message.success(data.message);
                  this.updateTable();
                  this.modal=false;
                }
              });
            }
          });
        },
        orderDateSet(value){
          this.orderInfo.appointment=value;
        },
        orderShow(index){
          this.orderInfo=JSON.parse(JSON.stringify(this.data[index]));
          this.modal=true;
        },
        orderRemove(index){
          this.$Modal.confirm({
            content:"确认删除改订单？",
            onOk: ()=>{
              this.$ajax.post('/order/deleteOrder',this.data[index]).then((result)=>{
                if (result.data.success){
                  this.$Message.success(result.data.message);
                  this.updateTable();
                }
              });
            }
          });

        },
        orderEntryRemove(index){
          this.$Modal.confirm({
            content:"确认删除改订单行？",
            onOk: ()=>{
              this.$ajax.get('/orderEntry/delete/'+this.subData[index].id).then((result)=>{
                if (result.data.success){
                  this.$Message.success(result.data.message);
                  this.getOrderEntry(this.orderInfo);
                }
              });
            }
          });
        },
        addOrder(){
          this.orderInfo={};
          this.modal=true
        },
        selectOne(row,index){
          this.orderInfo=row;
          this.subDivShow=true;
          this.getOrderEntry(row);
        },
        getOrderEntry(row){
          this.$ajax.post('/orderEntry/getByOrderId',row).then((result)=>{
            if (result.data.success){
              this.subData=result.data.data;
            }
          });
        },
        addOrderEntry(){
          this.entryModal=true;
          this.orderEntryInfo={};
        },
        orderEntryOk(){
          this.$refs["orderEntryRef"].validate((valid)=>{
            if (valid){
              this.$ajax.post("/orderEntry/addOrUpdate/"+this.orderInfo.id,this.orderEntryInfo).then((result)=>{
                if (result.data.success){
                  this.getOrderEntry(this.orderInfo);
                  this.entryModal=false;
                }
              });
            }
          })
        }
      },
      mounted:function () {
        this.$nextTick(()=>{
          this.updateTable();
          this.$ajax.get('/user/getUserInfo').then((result)=>{
            if (result.data.success){
              this.userInfo=result.data.data;
            }
          });
        });
      }
    }
</script>

<style scoped>
  #subTable{
    margin-top: 5px;
    width: 60%;
  }
</style>

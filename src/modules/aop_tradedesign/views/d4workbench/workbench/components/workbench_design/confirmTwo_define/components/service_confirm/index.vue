<template>
  <div class="aop_tradedesign_service_confirm_page">
    <PageDialog
      :dialogWidth="'1000px'"
      :dialogTitle="'数据集及L5确认凭证'"
      :dialogVisiable="dialogVisible"
      @closeDialog="dialogVisible = false"
      class="create_dialog"
    >
      <div slot="box">
        <!-- <div class="dialog_title">
          <span></span>
        </div> -->
        <div class="detail_info">
          <div class="title">基本信息</div>
          <DetailInfo ref="detailInfoRef" :detailInfo="detailInfo"></DetailInfo>
        </div>
        <div class="divider"></div>
        <div class="service">
          <div class="service_title">服务确认项</div>
          <ServiceList ref="serviceTabsRef" :tableData="serviceList"></ServiceList>
        </div>
        <div class="dataList">
          <div class="dataList_title">数据集确认项</div>
          <DatasetList ref="datasetListRef" :tableData="dataSetList"></DatasetList>
        </div>
        <div class="person">
          <div class="person_title">选择确认人员<el-tag size="small" type="warning">每个角色至少有一名人员，输入多个人员请用英文逗号分隔开</el-tag></div>
          <div class="person_border">
            <div class="person_content" v-if="systemId == '1'">
            <!-- <div class="person_op" @click.stop="addPersonDialog('T2DDZ')">＋ 选择T2订单长</div> -->
            <div class="person_op" @click.stop="addPersonDialog('T2DDZ')">T2订单长</div>
            <el-input v-model.trim="t2OrderUserNm" placeholder="请输入T2订单长"></el-input>
            <!-- <div class="person_list" v-for="item in userList" :key="item.userNo">
              <div class="person_name">{{ item.userName }}</div>
              <i class="el-icon-error f16 icon_close" @click="delUser('T2DDZ',item)"></i>
            </div> -->
            </div>

            <div class="person_content" v-if="systemId == '2'">
            <!-- <div class="person_op" @click.stop="addPersonDialog('T2DDZ')">＋ 选择T2订单长</div> -->
            <div class="person_op" @click.stop="addPersonDialog('T2DDZ')">T1订单长</div>
            <el-input v-model.trim="t2OrderUserNm" placeholder="请输入T1订单长"></el-input>
            <!-- <div class="person_list" v-for="item in userList" :key="item.userNo">
              <div class="person_name">{{ item.userName }}</div>
              <i class="el-icon-error f16 icon_close" @click="delUser('T2DDZ',item)"></i>
            </div> -->
            </div>

          <div class="person_content" v-if="systemId == '1'">
            <!-- <div class="person_op" @click.stop="addPersonDialog('T2ZCSJ')">＋ 选择T2设计</div> -->
            <div class="person_op" @click.stop="addPersonDialog('T2ZCSJ')">T2设计</div>
            <el-input v-model.trim="t2DesignUserNm" placeholder="请输入选择T2设计"></el-input>
            <!-- <div class="person_list" v-for="item in userDesignList" :key="item.userNo">
              <div class="person_name">{{ item.userName }}</div>
              <i class="el-icon-error f16 icon_close" @click="delUser('T2ZCSJ',item)"></i>
            </div> -->
          </div>

          <div class="person_content" v-if="systemId == '2'">
            <!-- <div class="person_op" @click.stop="addPersonDialog('T2ZCSJ')">＋ 选择T2设计</div> -->
            <div class="person_op" @click.stop="addPersonDialog('T2ZCSJ')">T1设计</div>
            <el-input v-model.trim="t2DesignUserNm" placeholder="请输入选择T1设计"></el-input>
            <!-- <div class="person_list" v-for="item in userDesignList" :key="item.userNo">
              <div class="person_name">{{ item.userName }}</div>
              <i class="el-icon-error f16 icon_close" @click="delUser('T2ZCSJ',item)"></i>
            </div> -->
          </div>


          <div class="person_content">
            <!-- <div class="person_op" @click.stop="addPersonDialog('ZYL5YFDDZ')">＋ 自有L5研发订单长</div> -->
            <div class="person_op" @click.stop="addPersonDialog('ZYL5YFDDZ')">自有L5研发订单长</div>
            <el-input v-model.trim="l5OrderUserNm" placeholder="请输入自有L5研发订单长"></el-input>
            <!-- <div class="person_list" v-for="item in userAdminList" :key="item.userNo">
              <div class="person_name">{{ item.userName }}</div>
              <i class="el-icon-error f16 icon_close" @click="delUser('ZYL5YFDDZ',item)"></i>
            </div> -->
            </div>
          </div>
        
        </div>
      </div>
      <div slot="footer">
        <el-button @click.native="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="confirm">确 认</el-button>
      </div>
    </PageDialog>
    <PersonDialog ref="personDialogRef" @checkPerson="checkPerson"></PersonDialog>
    <PersonAdminDialog ref="personAdminDialogRef" @checkPerson="checkPerson"></PersonAdminDialog>
    <PersonDesignDialog ref="personDesignDialogRef" @checkPerson="checkPerson"></PersonDesignDialog>
  </div>
</template>
<script>
import PageDialog from "@m/core/components/page_dialog";
import mixin from "@m/core/mixin";
import Table from "@m/core/components/page_table";
import DetailInfo from "./components/detail_info";
import ServiceList from "./components/serviceList";
import DatasetList from "./components/datasetList";
import PersonDialog from "./components/dialog/personDialog";
import PersonAdminDialog from "./components/dialog/personAdminDialog";
import PersonDesignDialog from "./components/dialog/personDesignDialog";
import { unduplicated, setSerialNumber } from "@m/utils/array";
import {mapGetters} from "vuex"
export default {
  mixins: [mixin],
  components: {
    Table,
    PageDialog,
    DetailInfo,
    DatasetList,
    ServiceList,
    PersonDialog,
    PersonAdminDialog,
    PersonDesignDialog
  },
  props:{
    // detailInfo:{
    //   type:Object,
    //   default:()=>({})
    // }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        desc: ""
      },
      serviceList: [],
      dataSetList: [],
      detailInfo: {},
      userList: [],  //T2订单长
      userDesignList: [],  //T2设计
      userAdminList: [],  //自有L5研发订单长
      admiId:"", //资产编号
      isolateWorkspace:"", //隔离标识
      bizLineId:"",
      competitorId:"",   //客户号
      jobId:"",   //作业号
      svcId:"",
      dataSetNo:"",
      reviewParticipatePrsn:"",
      transId:"",  //交易Id
      aftId:"",
      platformFlg:"",  //平台标识
      authCode:"" ,   //授权编号
      modelVersion:"",
      t2OrderUserNm:"",
      t2DesignUserNm:"",
      l5OrderUserNm:""
    };
  },
  methods: {
    showDialog(data) {
      this.dialogVisible = true;
      this.svcId = data.apiId;
      this.dataSetNo = data.dataSetNo;
      this.transId = data.transId;
      this.t2OrderUserNm = "";
      this.t2DesignUserNm = "";
      this.l5OrderUserNm = "";
      this.serviceList= [];
      this.dataSetList = [];
      this.reset();
      this.getOrderDetail();
      this.getDetail();
      this.getPlatformFlg();
    },
    async getDetail() {
      const params = {
        assetId: this.admiId,
        isolateWorkspace: this.isolateWorkspace,
        svcId:this.svcId,
        aftId:this.aftId
      };
      const res = await this.rpc.downloadDesign.getServDetail(params); //设计确认--详情
      this.serviceList = res.servSetConfirmList;
      this.dataSetList = res.dataSetConfirmList;
      if(res.t2DesignUserList && res.t2DesignUserList.length > 0){
        res.t2DesignUserList.map((item) =>{
          this.userDesignList.push({
            userName:item.custUserName,
            userNo:item.custUserNo
          })
        })
        this.t2DesignUserNm = this.userDesignList.map((item) =>item.userName).join(",")
      }
      if(res.t2OrderUserList && res.t2OrderUserList.length > 0){
        res.t2OrderUserList.map((item) =>{
          this.userList.push({
            userName:item.custUserName,
            userNo:item.custUserNo
          })
        })
        this.t2OrderUserNm = this.userList.map((item) =>item.userName).join(",")
      }

      if(res.l5OrderUserList && res.l5OrderUserList.length > 0){
        res.l5OrderUserList.map((item) =>{
          this.userAdminList.push({
            userName:item.custUserName,
            userNo:item.custUserNo
          })
        })
        this.l5OrderUserNm = this.userList.map((item) =>item.userName).join(",")
      }
    },
    delUser(type,data) {
      // this.userList.map((item,index) =>{
      //   if(item.usrNo == data.usrNo){
      //     this.userList.splice(index,1)
      //   }
      // })
      if(type == "T2DDZ"){
        this.userList.splice(this.userList.findIndex(i => i.userNo === data.userNo),1);
      }else if(type == "T2ZCSJ"){
        this.userDesignList.splice(this.userDesignList.findIndex(i => i.userNo === data.userNo),1);
      }else if(type == "ZYL5YFDDZ"){
        this.userAdminList.splice(this.userAdminList.findIndex(i => i.userNo === data.userNo),1);
      }
      
    },
    async confirm() {
      // if(!this.userList.length>0) return this.$message.error("请选择T2订单长");
      // if(!this.userDesignList.length>0) return this.$message.error("请选择T2设计");
      // if(!this.userAdminList.length>0) return this.$message.error("请选择自有L5研发订单长");
      // let tempListPerson = []
      // tempListPerson.push(...this.userAdminList,...this.userDesignList,...this.userList)
      // this.reviewParticipatePrsn = tempListPerson.map(item =>item.userName).join(";");
      if(this.t2OrderUserNm == "") return this.systemId == "1" ? this.$message.error("请输入T2订单长") :this.$message.error("请输入T1订单长");
      if(this.t2DesignUserNm == "") return this.systemId == "1" ? this.$message.error("请输入T2设计"):this.$message.error("请输入T1设计");
      if(this.l5OrderUserNm == "") return  this.$message.error("请输入自有L5研发订单长");
      // let userNm = this.userList.map(item =>item.userName).join(";");  //T2订单长
      // let userDesignNm = this.userDesignList.map(item =>item.userName).join(";")   //T2设计
      // let userAdminNm = this.userAdminList.map(item =>item.userName).join(";")    //自有L5研发订单长
      // let userAdminNm = "朱张华"    //自有L5研发订单长
      let tableArr = this.$refs.serviceTabsRef.tableData[0]
      // console.log(this.reviewParticipatePrsn,tableArr.remarks,"用户名")
      const params = {
        astId:this.admiId || "",
        // authNo:this.isolateWorkspace || "",
        authNo:this.authCode || "",
        svcId:this.svcId || "",
        orderNo:this.detailInfo.orderNumber || "",
        projNm:this.detailInfo.bizName || "",
        cstNm:this.detailInfo.cstName || "",
        remrk:tableArr.remarks || "",
        // reviewParticipatePrsn:this.reviewParticipatePrsn,
        transId:this.transId || "",
        l5OrderUserNm:this.l5OrderUserNm.replace(/，/ig,','),
        t2DesignUserNm:this.t2DesignUserNm.replace(/，/ig,','),
        t2OrderUserNm:this.t2OrderUserNm.replace(/，/ig,','),
        cstId:this.detailInfo.cstId || "",
        platformFlg:this.platformFlg || "",
        modelVersion:this.modelVersion || ""
      };
      console.log("params --->",params)
      const res = await this.rpc.downloadDesign.designConfirm(params); //设计确认
      this.$notify({
        title: "成功",
        message: "服务确认成功",
        duration: 2000,
        type: "success",
      });
      this.dialogVisible = false;
      this.$emit("designConfirm");
    },
    async getOrderDetail() {
      const params = {
        assetId: this.admiId,
        // isolateWorkspace: this.isolateWorkspace,
        authCode:this.authCode
      };
      const res = await this.rpc.downloadDesign.getOrderDetail(params);
      this.detailInfo = res;
    },
    addPersonDialog(data) {
      console.log("添加人员");
      // if(data == "T2DDZ"){
      //   this.$refs.personDialogRef.showDialog(data);
      // }else if(data == "T2ZCSJ"){
      //   this.$refs.personDesignDialogRef.showDialog(data);
      // }else if(data == "ZYL5YFDDZ"){
      //   this.$refs.personAdminDialogRef.showDialog(data);
      // }
    },
    checkPerson(e,type) {
      let data = []
      data = e.map(item => {
        return {
          userName: item.userName,
          userNo: item.userNo
        };
      });
      if(type == "T2DDZ"){
        this.userList.push(...data);
        this.userList = unduplicated(this.userList, "userNo");
      }else if(type == "T2ZCSJ"){
        this.userDesignList.push(...data);
        this.userDesignList = unduplicated(this.userDesignList, "userNo");
      }else if(type =="ZYL5YFDDZ"){
        this.userAdminList.push(...data);
        this.userAdminList = unduplicated(this.userAdminList, "userNo");
      }
      
    },
    reset(){
      this.userAdminList.length = 0;
      this.userDesignList.length = 0;
      this.userList.length = 0;
    },
    async getPlatformFlg(){
      const res = await this.rpc.downloadDesign.getPlatformFlg({
        aftId:this.aftId
      });
      this.platformFlg = res.authType
      // console.log("res",res)
    },
  },
  created() {
    const {admiId,isolateWorkspace,bizLineId,competitorId,jobId,aftId,authCode,modelVersion} = this.$route.query;
    this.admiId = admiId;
    this.isolateWorkspace = isolateWorkspace;
    this.bizLineId = bizLineId;
    this.competitorId = competitorId;
    this.jobId = jobId;
    this.aftId = aftId;
    this.authCode = authCode;
    this.modelVersion = modelVersion;
    // console.log(admiId,isolateWorkspace,bizLineId,competitorId,jobId,modelVersion,this.systemId,"created")
  },
  mounted() {},
  computed:{
    ...mapGetters(['systemId', 'hasSystemPermission','userInfo']),
  },
};
</script>
<style lang="scss" scoped>
@import "@m/assets/css/mixin.scss";
.aop_tradedesign_service_confirm_page {
  .dialog_title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: #131313;
    font-size: 16px;
  }
  .title {
    margin: 16px 0px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
  }
  .service_title{
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 16px;
  }
  .dataList_title{
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    margin: 16px 0px;
  }
  .person_title{
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    margin: 24px 0px 16px 0px;
  }
  .divider{
    height: 1px;
    border: 1px solid #EEF0F5;
    margin: 23.5px 0px;
  }
  .person {
    // display: flex;
    margin: 20px 0px;
    // align-items: center;
    .person_content {
      display: flex;
      margin-bottom: 25px;
      // margin-left: 10px;
      .person_list {
        padding: 8px 14px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        border: 1px solid rgba(221, 221, 221, 1);
        border-radius: 2px;
        margin-right: 8px;
        position: relative;
        // margin-bottom: 12px;
        .icon_close {
          // width: 15px;
          // height: 15px;
          position: absolute;
          top: -8px;
          right: -8px;
          cursor: pointer;
          color: #818181;
        }
      }
      .person_op {
        height: 36px;
        width: 160px;
        line-height: 36px;
        text-align: center;
        border: 1px solid rgba(53, 138, 255, 1);
        border-radius: 3px;
        background-color:  #358AFF;
        font-family: PingFangSC-Regular;
        // font-size: 14px;
        color:  #FFFFFF;
        letter-spacing: 0;
        // line-height: 37px;
        // padding: 8px 14px;
        margin-right: 12px;
        cursor: pointer;
      }
    }
  }
  .person_border{
    border: 1px solid #dfdfdf;
    padding: 10px 4px;
  }
}
</style>

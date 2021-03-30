<template>
  <div class="the-box" id="thebox">
    <div class="col-lg-3 ctrbox" id="formDiv" v-loading="searchLoading">
      <div class="form-group row">
        <label for="deptid" class="col-sm-3 control-label text-left mobilefont">摄像头</label>
        <div class="col-sm-9 forinput" id="treeselectLi">
          <el-select style="width: 100%" size="small" :value="valueTitle" ref="select" popper-class="my-select">
            <el-option :value="valueTitle" :label="valueTitle" class="options">
              <el-tree ref="devTree" class="my-select-tree" id="dev-tree" node-key="deptid" v-if="showTree" :props="treeProps" :load="treeLoad" lazy @node-click="handleNodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    <i :class="['fa',{'fa-sitemap':typeof data.parentid != 'undefined' && typeof data.channelname == 'undefined',
                      'fa-server': data.device && typeof data.channelname == 'undefined',
                      'fa-camera channeloffline':typeof data.channelname != 'undefined' && data.status === 0 && !data.type,
                      'fa-camera channelonline':typeof data.channelname != 'undefined' && data.status === 1 && !data.type,
                      'fa-volume-off channeloffline':typeof data.channelname != 'undefined' && data.status === 0 && data.type===1,
                      'fa-volume-off channelonline':typeof data.channelname != 'undefined' && data.status === 1 && data.type===1,
                      'fa-exclamation-triangle channeloffline':typeof data.channelname != 'undefined' && data.status === 0 && data.type===2,
                      'fa-exclamation-triangle channelonline':typeof data.channelname != 'undefined' && data.status === 1 && data.type===2,
                      'fa-microphone channeloffline':typeof data.channelname != 'undefined' && data.status === 0 && data.type===3,
                      'fa-microphone channelonline':typeof data.channelname != 'undefined' && data.status === 1 && data.type===3}]"></i>
                    <span class="ellipsis mobilefont" :title="node.label">{{node.label}}</span>
                  </span>
                </span>
              </el-tree>
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form-group row">
        <label for="startTime" class="col-sm-3 control-label text-left mobilefont">开始时间</label>
        <div class="col-sm-9 forinput">
          <el-date-picker class="mobilefont" size="small" style="width: 100%" id="startTime" name="startTime" type="datetime" placeholder="选择日期" v-model.trim="form.startTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </div>
      </div>
      <div class="form-group row">
        <label for="endTime" class="col-sm-3 control-label text-left"
          >结束时间
        </label>
        <div class="col-sm-9 forinput">
          <el-date-picker class="mobilefont" size="small" style="width: 100%" id="endTime" name="endTime" type="datetime" placeholder="选择日期" v-model.trim="form.endTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </div>
      </div>
      <div class="form-group row">
        <label for="input-usersex" class="col-sm-3 control-label text-left">存储位置</label>
        <div class="col-sm-9 forinput">
          <el-radio-group class="text-left mobilefont" size="small" v-model.trim="form.memoryType" @change="changeHandler" :active-value="0">
            <el-radio label="0">设备</el-radio>
            <br>
            <el-radio label="1">服务器</el-radio>
            <br>
            <el-radio label="2">设备和服务器</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="form-group row">
        <label for="speed" class="col-sm-3 control-label text-left mobilefont">下载速度</label>
        <div class="col-sm-9 forinput">
          <el-select style="width: 100%" id="speed" size="small" name="speed" v-model.trim="form.speed" placeholder="请选择速度">
            <el-option class="options marleft" v-for="item in [{id:1,name:'1倍'},{id:2,name:'2倍'},{id:4,name:'4倍'}]" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form-group row">
        <label for="input-record" class="col-sm-3 control-label text-left mobilefont">是否录像</label>
        <div class="col-sm-9 forinput">
          <el-select style="width: 100%" id="input-record" size="small" name="record" v-model.trim="form.record" placeholder="1">
            <el-option class="options marleft" v-for="(item, index) in recordList" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
      </div>
      <div class="row text-center">
        <!-- <el-button type="button" style="margin-right:15px;" size="medium" class="btn btn-md btn-success" @click.prevent="searchList" v-loading="searchLoading">
          <i class="fa fa-search mobilefont"></i> 搜索
        </el-button> -->
        <el-button size="medium" type="primary" icon="el-icon-search" @click.prevent="searchList">搜索</el-button>
      </div>
    </div>
    <div class="col-lg-9 playbox" id="lbandplayDiv">
      <div class="view-list row">
        <div class="video-show col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div id="car-eye-player">
            <a><div class="col-smxx-8" id="player0"></div></a>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 text-left video-show"></div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-left video-show"></div>
      </div>
      <div class="row">
        <div class="col-xs-8 col-sm-8 col-md-6 col-lg-6 text-left video-show">
          <ul>
            <li @click.prevent="setPlayerPlay(1)" class="controlmenulistt">
              <img class="controlbtnmenulist" src="../assets/images/play.png" v-show="!isplay" />
              <img class="controlbtnmenulist" src="../assets/images/pause.png" v-show="isplay" />
              <div class="alert-tip">{{isplay?'暂停':'播放'}}</div>
            </li>
            <li @click.prevent="setPlayerPlay(2)" class="controlmenulistt" v-if="isplay">
              <img class="controlbtnmenulist" src="../assets/images/stop.png" />
              <div class="alert-tip">停止</div>
            </li>
            <li @click.prevent="setPlayerPlay(4)" class="controlmenulistt">
              <img class="controlbtnmenulist" src="../assets/images/capture.png" />
              <div class="alert-tip">拍照</div>
            </li>
            <li @click.prevent="setPlayerPlay(5)" class="controlmenulistt">
              <img class="controlbtnmenulist" src="../assets/images/mute.png" v-show="!issilence" />
              <img class="controlbtnmenulist" src="../assets/images/unmute.png" v-show="issilence" />
              <div class="alert-tip">{{issilence?'恢复':'静音'}}</div>
            </li>
            <li style="width: 30%;box-sizing:border-box;padding-right:5px;" class="controlmenulistt yltcls" >
              <el-slider v-model="value1" @change="changemute"></el-slider>
              <!--<img class="btnmenulist" src="../assets/images/unmute.png"/>-->
            </li>
            <li @click.prevent="setPlayerPlay(6)" class="controlmenulistt">
              <img class="controlbtnmenulist" src="../assets/images/backward.png" />
              <div class="alert-tip">慢进{{(isplay&&!!fFstate&&100>fFstate?fFstate:"")|fFstateFilter}}</div>
            </li>
            <li @click.prevent="setPlayerPlay(7)" class="controlmenulistt">
              <img class="controlbtnmenulist" src="../assets/images/forward.png" />
              <div class="alert-tip">快进{{(isplay&&!!fFstate&&fFstate>100?fFstate:"")|fFstateFilter}}</div>
            </li>
          </ul>
        </div>
        <div class="col-xs-4 col-sm-2 col-md-2 col-lg-2 text-left">
          <div id="playerTextName" style="margin-top: 3%"></div>
        </div>
        <div class="col-xs-12 col-sm-2 col-md-4 col-lg-4 text-right" v-show="!isMobile()">
          <div id="playerTextTime">
            <p style="color: #000000; font-size: 1vh; margin-top: -5px">0/0</p>
          </div>
          <el-slider v-model="valuepress" @change="changepress" :max="timelength" :disabled="!currentPlayingCanDrag" v-show="!isMobile()" style="margin-top: -25px"></el-slider>
        </div>
      </div>
      <div class="row tableTextList">
        <el-table class="my-table" height="100%" :data="tableDataList" v-show="showplayertable" style="width: 100%">
          <el-table-column class="mobilefont" label="设备/通道名称" min-width="120" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
          <el-table-column class="mobilefont" prop="startTime" width="160" :formatter="stateFormatStartTime" label="开始时间" show-overflow-tooltip></el-table-column>
          <el-table-column class="mobilefont" prop="endTime" width="160" :formatter="stateFormatEndTime" label="结束时间" show-overflow-tooltip></el-table-column>
          <el-table-column class="mobilefont" prop="memoryType" width="70" :formatter="memoryTypeFormat" label="来源" show-overflow-tooltip></el-table-column>
          <el-table-column class="mobilefont" width="120" label="操作">
            <template slot-scope="props">
              <div class="btn-group btn-group-xs">
                <button type="button" class="btn btn-warning mobilefont" @click.prevent="playBackplayer(props.row)">
                  <i class="fa fa-play"></i> 播放
                </button>
                <button type="button" class="btn btn-danger mobilefont" @click.prevent="downLoadVideo(props.row, props.$index)" v-show="!isMobile()">
                  <i class="fa fa-download"></i> 下载
                </button>
              </div>
            </template>
          </el-table-column>
          <el-table-column class="mobilefont" prop="press" width="80" label="下载进度" show-overflow-tooltip v-show="isdevice"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import { mapState,mapActions } from "vuex";
import "assets/css/classic.css";
import "assets/css/style.css";
import { component as VueContextMenu } from "@xunlei/vue-context-menu";
import ElementUI, { Switch } from "element-ui";
import { WEB_Socket } from "../assets/config/linkparam.js";
import logo from "../assets/images/logo.png";

export default {
  components: { VueContextMenu, ElementUI },
  data() {
    return {
      playerLength: 1,
      protocol: "",
      q: "",
      online: "",
      total: 0,
      pageSize: 10,
      sort: "id",
      order: "desc",
      form: this.defForm(),
      searchLoading: false,
      showplayertable: true,
      showdownloadtable: false,
      logoimg: logo,
      deviceId: "",
      gb_id: "",
      d_gb_id: "",
      memoryType: 0,
      value1: 100,
      valuepress: 0,
      issilence: false,
      isplay: false,
      showTree: true,
      fFstate: 0,
      playerstate: false,
      recordList: [
        {
          value: 1,
          label: "是",
        },{
          value: 0,
          label: "否",
        }
      ],
      treeProps: {
        label: (data, node) => {
          var label = "";
          if (node.level === 1) {
            // 第一层lable为src_name字
            node.deptid = data.deptid;
            node.deptname = data.deptname;
            label = data.deptname;
            label += ` [${Number(data.subCount) + Number(data.subDeviceCount)}]`;
          } else {
            if (typeof data.devicename != "undefined") {
              node.id = data.id;
              node.devicename = data.devicename;
              node.channelcount = data.channels;
              node.status = data.status;
              label = data.deptname;
              if (data.channels > 0) {
                label += ` [${data.channels}]`;
              }
            } else if (typeof data.channelname != "undefined") {
              node.channelcode = data.gb_id;
              node.d_gb_id = data.d_gb_id;
              node.channelname = data.channelname;
              node.deviceId = data.deviceid;
              node.status = data.status;
              label = data.deptname;
            } else {
              node.deptid = data.deptid;
              node.deptname = data.deptname;
              label = data.deptname;
              if (Number(data.subCount) + Number(data.subDeviceCount) > 0) {
                label += ` [${data.subCount + data.subDeviceCount}]`;
              }
            }
          }
          return label;
        },
        isLeaf: (data, node) => {
          if (typeof data.channelname != "undefined") {
            return true;
          } else {
            if (typeof data.devicename != "undefined") {
              return data.channels == 0;
            } else {
              return Number(data.subCount) + Number(data.subDeviceCount) == 0;
            }
          }
        },
        disabled: (data, node) => {
          return false;
        },
      },
      valueId: "", // 初始值
      valueTitle: "",
      socket: null,
      tableDataList: [],
      channelname: "",
      channelnamestr: "",
      deviceIdstr: "",
      channelCodestr: "",
      playingType: "",
      timelength: 10,
      timer: "",
      isdevice: false,
      downloadspeed: 0,
      downloadTime: 0,
      speedTime: 0,
      dtimer: "",
      showSiper: false,
      timeText: "",
      timeSsText: "",
      devicenameStr: "",
      downloadOpt: "",
      downloadIndex: "",
      connectNumber :"1",
      dragWaitting: false,//设备类视频拖拽播放等待中
      dragType: 0,//1往后拖动，2往前拖动
      currentPlayingCanDrag: true,//当前播放视频是否可以拖动播放
      currentPlayUrl: "",
      offsetTime: 0,//拖动播放时的差值，因为拖动后播放器是从0开始的
      stopApiLoad: false,//正在请求停止中防止重复提交请求
      playWattingTime: 5,//如果是设备类视频拖动的话给他三分钟的等待时间，但是三分钟后需要回复到5秒的等待时间。如果不是拖动的话只允许它等待5秒。
    };
  },
  computed: {
    ...mapState(["userInfo", "serverInfo"]),
  },
  filters: {
    fFstateFilter(val){
      let result = "";
      switch (val) {
        case 25:
          result = "4倍";
          break;
        case 50:
          result = "2倍";
          break;
        case 100:
          result = "正常";
          break;
        case 200:
          result = "2倍";
          break;
        case 400:
          result = "4倍";
          break;
        default:
          break;
      }
      return result;
    }
  },
  mounted() {
    this.connectNumber = this.getGuid();
    //this.setDownloadSpeed();
    this.reloadPlayer();
    this.setPlayerLength(this.playerLength);
    this.form.memoryType = "0";
    if (this.isMobile()) {
      this.$el.querySelector("#formDiv").before(this.$el.querySelector("#lbandplayDiv"));
      $("#thebox").addClass("ismobile");
      $(".controlmenulistt").css("width", "13.2%");
      $(".yltcls").css("margin-right", "3%");
      $(".yltcls").css("margin-top", "1%");
      $(".downloadbtn").css("width", "10%");
      $(".downloadbtn").css("float", "right");
      $("#startTime").css("font-size", "1.5vh");
      $("#startTime").css("padding-right", "0");
      $("#endTime").css("font-size", "1.5vh");
      $("#endTime").css("padding-right", "0");
      $("#player0").css("padding-right", "0");
      $("#player0").css("padding-left", "0");
      $(".forinput").css("padding-right", "0");
    } else {
      $("#startTime").css("font-size", "1.5vh");
      $("#startTime").css("padding-right", "0");
      $("#endTime").css("font-size", "1.5vh");
      $("#endTime").css("padding-right", "0");
      $(".yltcls").css("margin-right", "1%");
      $(".yltcls").css("margin-top", "-0.4%");
      $(".downloadbtn").css("width", "14%");
    }
  },
  methods: {
    ...mapActions([
      "keepLogin"
    ]),
    defForm() {
      return {
        deptid: "",
        channelId: "",
        memoryType: "",
        startTime: this.formatTime(new Date().getTime(),"yyyy-MM-dd")+" 08:00:00",
        endTime: this.formatTime(new Date().getTime(),"yyyy-MM-dd")+" 23:59:59",
        speed: 1,
        record: 0,
      };
    },
    getGuid(){
        var guid = "";
        for (var i = 1; i <= 32; i++){
            var flag = Math.floor(Math.random() * 10);
            //如果是偶数就设置成为
            if(flag%2 == 0) {
                //全大写
                var n = Math.floor(flag*2.4) + 65;
                //全小写
                // var n = Math.floor(flag*2.4) + 97;
                var n = String.fromCharCode(n);
                guid += n;
            } else {
                guid += flag;
            }
          // if((i==8)||(i==12)||(i==16)||(i==20))
          //   guid += "-";
        }
        return guid;
    },
    reloadPlayer() {//初始化播放器
      this.playerrestart("", "player0", 0);
      $("#player0").find(".pe-wrapper").css("border", "#FFFFFF solid 2px");
      $("#player0").find("span.pe-button").remove();
      $("#player0").find("div.volumebar").remove();
      $("#player0").find("div.pe-center").remove();
      $("#player0").find("div.pe-logo").remove();
      $("#player0").find("div.pe-controlbar").remove();
      $("#player0").find("div.pe-display").css("height", "calc(100% - 0px)");
      $("#player0").find("div.pe-content").css("height", "calc(100% - 0px)");
      $("#startTime").css("font-size", "1.5vh");
      $("#player0").find("div.pe-poster").css("width", "11%");
      $("#player0").find("div.pe-poster").css("margin-top", "16%");
      $("#player0").find("div.pe-poster").css("height", "22%");
      $("#player0").find("div.pe-poster").css("margin-left", "42%");
      $("#player0").find("div.pe-poster").css("vertical-align", "middle");
    },
    playerrestart(fileurl, playerid, val) {
      let self = this;
      var container = document.getElementById(playerid);
      var ui =playease.ui(val);
      ui.setup(container, {
        autoplay: false,
        bufferLength: 1.5,       // sec.
        // level: 'error',    // debug, log, warn, error
        file: fileurl,
        lowlatency: self.playingType!=1?true:false,//false为服务器的点播功能
        maxBufferLength: 3.0,    // sec.
        maxRetries: 1, 
        mode: "live", //live
        module: 'FLV',
        objectfit: "fill",
        retrying: 0,
        loader: {
          name: "auto",
          mode: "cors", // cors, no-cors, same-origin
          credentials: "omit", // omit, include, same-origin
        },
        service: {
          script: 'js/sw.js',
          scope: 'js/',
          enable: false,
        },
        plugins: [
          {
            kind: "Poster",
            file: this.logoimg,
            // cors: 'anonymous',
            objectfit: 'contain', // fill, contain, cover, none, scale-down
            visibility: true,
          },
          {
            kind: "Display",
            layout: "",
            ondouBleclick: "fullscreen",
            visibility: true,
          },
          {
            kind: "Controlbar",
            layout: "||[Slider:timebar=Preview]|[Button:play=播放][Button:pause=暂停][Button:reload=重新加载][Button:stop=停止][Label:time=00:00/00:00][Button:capture=Capture][Button:mute=静音][Button:unmute=取消静音][Slider:volumebar=80][Button:fullscreen=全屏][Button:exitfullscreen=退出全屏]",
            autohide: false,
            visibility: true,
          },
          {
            kind: "Logo",
            visibility: false,
          },{
            kind: 'ContextMenu',
            visibility: false,
            items: [{
              mode: '',
              icon: 'image/github.png',
              text: 'studease',
              shortcut: '',
              handler: function () {
              },
            }],
          }
        ],
      });
      ui.removeEventListener('error');
      ui.addEventListener("error", console.error);
      ui.removeEventListener('ended');
      ui.addEventListener('ended',function(res) {//用于处理自动播放完成时按钮状态回置
        if(self.playerstate&&!self.dragWaitting&&!self.stopApiLoad){//因为拖动视频时是需要reload的，这样也会触发ended，所以要过滤掉这种情况
          self.stopApiLoad = true;
          self.toStop(function(){self.stopApiLoad = false;});
        }
      });
    },
    memoryTypeFormat(row, column) {
      var name = "";
      if (typeof row.memoryType == "undefined") {
        name = "设备";
      } else if (row.memoryType == 0) {
        name = "设备";
      } else if (row.memoryType == 1) {
        name = "服务器";
      }
      return name;
    },
    setDownloadSpeed() {
      var self = this;
      $.get(self.$store.state.baseUrl + "/sysParamSet/getParamInfo", {}).then(
        (ret) => {
          if (ret.code == "0") {
            self.downloadspeed = ret.data.speed;
          }
        }
      );
    },
    stateFormat() {
      return this.channelnamestr;
    },
    stateFormatStartTime(row, column) {
      var time = "";
      if (typeof row.startTime != "undefined") {
        time = row.startTime.replace("T", " ");
      }
      return time;
    },
    stateFormatEndTime(row, column) {
      var time = "";
      if (typeof row.endTime != "undefined") {
        time = row.endTime.replace("T", " ");
      }
      return time;
    },
    openSocket() {
      var self = this;
      if (typeof WebSocket == "undefined") {
        self.$message({
          type: "error",
          message: "您的浏览器不支持WebSocket",
        });
      } else {
        console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        var socketUrl = WEB_Socket + 10;
        console.log(socketUrl);
        if (self.socket != null) {
          self.socket.close();
          self.socket = null;
        }
        self.socket = new WebSocket(socketUrl);
        //打开事件
        self.socket.onopen = function () {
          console.log("websocket已打开");
          //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        self.socket.onmessage = function (msg) {
          var serverMsg = "收到服务端信息：" + msg.data;
          var obj = eval("(" + msg.data + ")");
          self.channelnamestr = self.channelname;
          self.channelCodestr = self.valueId;
          self.deviceIdstr = self.deviceId;
          self.tableDataList = self.tableDataList.concat(obj);
        };
        //关闭事件
        self.socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        self.socket.onerror = function () {
          console.log("websocket发生了错误");
        };
      }
    },
    setDownloadTime(opt) {
      var self = this;
      var date1 = new Date(opt.startTime.replace("T", " "));
      var date2 = new Date(opt.endTime.replace("T", " "));
      var s1 = date1.getTime(),
        s2 = date2.getTime();
      var total = (s2 - s1) / 1000;
      self.downloadTime = total / (self.form.speed + 1);
    },
    getPlatfromPlayBackVideo(opt, index) {
      var self = this;
      $.get(self.$store.state.baseUrl + "/getPlatfromPlayBackVideo", {
        d_gb_id: self.d_gb_id,
        gb_id: self.channelCodestr,
        startTime: opt.startTime.replace("T", " "),
        endTime: opt.endTime.replace("T", " "),
        connectNumber: self.connectNumber
      }).then((ret) => {
        var obj = eval("(" + ret + ")");
        if (obj.url != null) {
          clearInterval(self.dtimer);
          opt.press = "上传完成";
          opt.url = obj.url;
          self.$set(self.tableDataList, index, opt);
          self.downs(opt);
          self.downloadOpt = "";
          self.downloadIndex = "";
        }
      });
    },
    downLoadVideo(opt, index) {//table的下载按钮
      var self = this;
      if (self.downloadIndex !== "") {
        if (confirm("已有正在下载的视频，是否停止?")){ //并开始新视频下载！")) {
          self.downloadOpt.press = "已停止";
          self.$set(self.tableDataList, self.downloadIndex, self.downloadOpt);
          clearInterval(self.dtimer);
          $.get(self.$store.state.baseUrl + "/stopDownload", {
            d_gb_id: self.d_gb_id,
            gb_id: self.channelCodestr
          }).then((ret) => {});
          self.downloadIndex = "";
        }else{

        }
        return;
      }
      self.setDownloadTime(opt);

      if (typeof opt.url == "undefined") {
        $.get(self.$store.state.baseUrl + "/getPlatfromPlayBackVideo", {
          d_gb_id: self.d_gb_id,
          gb_id: self.channelCodestr,
          startTime: opt.startTime.replace("T", " "),
          endTime: opt.endTime.replace("T", " "),
          connectNumber: self.connectNumber
        }).then((ret) => {
          if (ret === "404") {
            //服务器查询出错了
          } else {
            try {
              var self = this;
              var json = JSON.parse(ret);
              var url = json["url"];
              if (typeof url == "undefined") {
	              var code =0;
                 $.get(self.$store.state.baseUrl + "/fileUpload", {
                    d_gb_id: self.d_gb_id,
                    gb_id: self.channelCodestr,
                    startTime: opt.startTime.replace("T", " "),
                    endTime: opt.endTime.replace("T", " "),
                    connectNumber : self.connectNumber,
                    speed: this.form.speed,
                 }).then((ret2) => {
                    code = ret2.code;
                     if(code == -3){
                        opt.press = "繁忙";
                        self.$set(self.tableDataList, index, opt);
                        self.downloadIndex = "";
                        clearInterval(self.dtimer);
                        return;
                     }
                     self.downloadOpt = opt;
                     self.downloadIndex = index;
                     //服务器没有对应的
                     self.isdevice = true;
                     opt.press = "0%";
                     self.$set(self.tableDataList, index, opt);
                     self.speedTime = 0;
                     var bfb = 0;
                     var status =1;
                     self.dtimer = setInterval(function () {
                        $.get(self.$store.state.baseUrl + "/queryVideoRecordTime", {
                           d_gb_id: self.d_gb_id,
                           gb_id: self.channelCodestr,
                           startTime: opt.startTime.replace("T", " "),
                           endTime: opt.endTime.replace("T", " "),
                           connectNumber: self.connectNumber
                        }).then((ret3) => {
                            var json = JSON.parse(ret3);
                            bfb = json["percent"];
                            status = json["status"];
                            if(status==-1){
                                opt.press = "下载失败";
                                self.$set(self.tableDataList, index, opt);
                            }
                            if(status==-1){
                                self.downloadIndex = "";
                                clearInterval(self.dtimer);
                                return;
                            }
                            if (bfb >= 100) {
                                opt.press = "100%";
                            } else {
                                opt.press = bfb + "%";
                            }
                            self.$set(self.tableDataList, index, opt);
                            if (bfb >= 100) {
                                self.getPlatfromPlayBackVideo(opt, index);
                            }
                        })
                     }, 5000);
                 })
              } else {
                opt.url = url;
                self.downs(opt);
              }
            } catch (err) {}
          }
        });
      } else {
        console.log(opt.url);
        self.downs(opt);
      }
    },
    downs(opt) {
      var self = this;
      fetch(opt.url)
        .then((res) => res.blob())
        .then((blob) => {
          download(
            blob,
            self.channelnamestr + "(" + opt.startTime.replace("T", " ") + "---" + opt.endTime.replace("T", " ") + ").mp4",
            "video"
          );
        });
    },
    playerTime(pauseToplay) {//显示的播放时间进度
      var self = this;
      if(pauseToplay)self.valuepress = 0;
      clearInterval(self.timer);
      let keepIn = self.$store.state.keepTime;
      let accidentTime = 0;//处理意外情况，如最后一秒卡住或者网络原因卡住，5秒后作重置播放处理,拖动的话是3分钟
      let drapTime = 180;//拖动的话是3分钟后要恢复5秒的等待处理
      self.timer = setInterval(function () {
        keepIn--;
        if(keepIn<=0){
          self.keepLogin().then(res=>{keepIn = self.$store.state.keepTime;});
        }
        var ui2 = playease.ui(0);
        var video = ui2.element();
        var playerTime = parseInt(video.currentTime);
        // console.log("显示的播放时间进度===",self.valuepress,playerTime);
        if(!self.dragWaitting){//如果是拖拽等待中，跳过
          playerTime += self.offsetTime;
          if(self.playWattingTime==180){
            drapTime--;
            if(drapTime<=0){
              self.playWattingTime = 5;
              drapTime = 180;
            }
          } 
          if(playerTime === self.valuepress){//没变化
            accidentTime++;
          }else{
            accidentTime = 0;
          }
          if (playerTime >= 3600) {
            let hourText = parseInt(playerTime/3600);
            let minText = parseInt((playerTime-hourText*3600)/60);
            let miaoText = playerTime-hourText*3600-minText*60;
            $("#playerTextTime").html("<p style='color: #000000;font-size: 1vh;margin-top: -1%;'>" + hourText + "小时" + minText + "分" + miaoText + "秒/" + self.timeText + "</p>");
          } else if (playerTime >= 60) {
            let minText = parseInt(playerTime/60);
            let miaoText = playerTime-minText*60;
            $("#playerTextTime").html("<p style='color: #000000;font-size: 1vh;margin-top: -1%;'>" + minText + "分" + miaoText + "秒/" + self.timeText + "</p>");
          } else {
            $("#playerTextTime").html("<p style='color: #000000;font-size: 1vh;margin-top: -1%;'>" + playerTime + "秒/" + self.timeText + "</p>");
          }
          self.valuepress = playerTime;
          if (self.valuepress >= self.timelength || accidentTime > self.playWattingTime) {
            // console.log("播放结束触发停止",self.valuepress,self.timelength)
            clearInterval(self.timer);
            ui2.stop();
            $("#playerTextTime").html("<p style='color: #000000;font-size: 1vh;margin-top: -1%;'>0/0</p>");
          }
        }
      }, 1000);
    },
    setTimeLength() {
      var self = this;
      var date1 = new Date(self.playerStartTime);
      var date2 = new Date(self.playerEndTime);
      var s1 = date1.getTime(),
        s2 = date2.getTime();
      var total = (s2 - s1) / 1000;
      self.timelength = total;
      var timeText = "";
      if (Number(self.timelength) >= 3600) {
        var hourtext = parseInt(self.timelength / 3600);
        timeText = hourtext + "小时";
        var mintext = parseInt((Number(self.timelength) - Number(hourtext) * 3600) / 60);
        timeText = timeText + mintext + "分";
        var miaotext = Number(self.timelength) - Number(hourtext) * 3600 - Number(mintext) * 60;
        timeText = timeText + miaotext + "秒";
        self.timeText = timeText;
      } else if (Number(self.timelength) >= 60) {
        var mintext = parseInt(self.timelength / 60);
        timeText = mintext + "分";
        var miaotext = Number(self.timelength) - Number(mintext) * 60;
        timeText = timeText + miaotext + "秒";
        self.timeText = timeText;
      } else {
        timeText = self.timelength + "秒";
        self.timeText = timeText;
      }
    },
    playBackplayer(opt) {//table的播放按钮-1
      var self = this;
      self.dragType = 0;
      self.offsetTime = 0;
      let backFunc = function(){
        self.playerchannelId = self.channelCodestr;
        self.playerStartTime = opt.startTime.replace("T", " ");
        self.playerEndTime = opt.endTime.replace("T", " ");
        self.playingType = opt.memoryType;
        self.setTimeLength();
        $("#player0").html("");
        self.reloadPlayer();
        if (opt.memoryType != 1) {
          $.get(self.$store.state.baseUrl + "/playBack", {
            d_gb_id: self.d_gb_id,
            gb_id: self.channelCodestr,
            streamType: 0,
            memoryType: opt.memoryType,
            startTime: opt.startTime.replace("T", " "),
            endTime: opt.endTime.replace("T", " "),
            record: self.form.record,
          }).then((ret) => {
            if(self.form.record==1){//如果播放的视频类型是设备类型且是边录像边播放，则禁止拖动播放进度条
              self.currentPlayingCanDrag = false;
            }
            self.currentPlayUrl = ret;
            self.startPlay(
              ret,
              self.deviceIdstr,
              self.channelCodestr,
              opt.startTime.replace("T", " "),
              opt.endTime.replace("T", " ")
            );
          });
        } else {
          self.startPlay(
            opt.url,
            self.deviceIdstr,
            self.channelCodestr,
            opt.startTime.replace("T", " "),
            opt.endTime.replace("T", " ")
          );
        }
      }
      self.toStop(backFunc);//这样写是因为同一通道的停止->播放需要反应时间的
    },
    startPlay(url, deviceId, channelId, startTime, endTime) {//table的播放按钮-2
      var height = $("#player0").height();
      var ui2 = playease.ui(0);
      ui2.stop();
      ui2.play(url);
      this.playerTime();
      $("#player0").find(".pe-slider-rail").css("margin-left", " -50%");
      $("#playerTextName").html("<p style='color: #000000;font-size: 1vh;'>" + this.devicenameStr + "/" + this.channelnamestr + "</p>");
      $("#playerTextTime").html("<p style='color: #000000;font-size: 1vh;margin-top: -1%;'>0/" + this.timeText + "</p>");
      $("#player0").height(height);
      this.playerstate = true;
      this.isplay = true;
      this.fFstate = 0;
    },
    changeHandler(value) {
      this.memoryType = value;
    },
    selectChanged(value) {
      this.gb_id = value;
    },
    searchList() {//点击搜索按钮
      var self = this;
      if (self.deviceId == "") {
        self.$message({
          type: "error",
          message: "请选择设备！",
        });
        return;
      }
      var startTime = $("#startTime").val();
      if (startTime == "" || startTime == null) {
        self.$message({
          type: "error",
          message: "请选择开始时间！",
        });
        return;
      }
      var endTime = $("#endTime").val();
      if (endTime == "" || endTime == null) {
        self.$message({
          type: "error",
          message: "请选择结束时间！",
        });
        return;
      }
      if (startTime >= endTime) {
        self.$message({
          type: "error",
          message: "开始时间要小于结束时间！",
        });
        return;
      }
      if (self.memoryType != 1) {
        self.openSocket();
      }
      self.searchLoading = true;
      $.get(self.$store.state.baseUrl + "/queryVedioList", {
        d_gb_id: this.d_gb_id,
        gb_id: this.valueId,
        memoryType: this.memoryType,
        startTime: startTime,
        endTime: endTime,
      }).then((ret) => {
        //if (self.memoryType != 0) {
        self.searchLoading = false;
        self.channelnamestr = self.channelname;
        self.channelCodestr = self.valueId;
        self.deviceIdstr = self.deviceId;
        self.tableDataList = eval("(" + ret + ")");
        //}
      }).catch(()=>{self.searchLoading = false;});
    },
    treeLoad(data, resolve) {
      var self = this;
      var parentid = "";
      if (typeof data.devicename == "undefined") {
        parentid = data.deptid || "-1";
        var deptlist = [];
        if (typeof data.channelname == "undefined") {
          $.ajax({
            url: self.$store.state.baseUrl + "/dept/getChildDeptList", // 请求路径
            data: {
              parentid: parentid,
            }, // 参数
            type: "get", // 请求类型
            async: false,
            contentType: "application/json;charset=utf-8",
            error: function (request, textStatus, errorThrown) {
              // 设置表单提交出错
            },
            success: function (ret) {
              deptlist = ret.data;
              if (parentid == "-1") {
                resolve((deptlist || []).map((v) => {
                  return Object.assign(v, {
                    key: v.deptid,
                  });
                }));
                if(data.level==0){//让它默认展开第一级
                  setTimeout(function(){
                    data.childNodes[0].expanded = true;
                    data.childNodes[0].loadData();
                  },100);
                }
              }
            },
          });

          if (parentid != "-1") {
            $.ajax({
              url: self.$store.state.baseUrl + "/deviceInfo/list", // 请求路径
              data: {
                deptid: parentid,
                q: "",
                page: 1,
                limit: 10,
                online: "",
                sort: "id",
                order: "asc",
              }, // 参数
              type: "get", // 请求类型
              async: false,
              contentType: "application/json;charset=utf-8",
              error: function (request, textStatus, errorThrown) {
                // 设置表单提交出错
              },
              success: function (rett) {
                var devicelist = rett.data;
                // alert(JSON.stringify(rett.data));
                if (devicelist != null) {
                  for (var i = 0; i < devicelist.length; i++) {
                    devicelist[i].parentid = devicelist[i].deptid;
                    devicelist[i].deptname = devicelist[i].devicename;
                    devicelist[i].deptid =
                      Math.round(Math.random() * 999) +
                      Math.round(Math.random() * 999);
                  }
                  if (deptlist != null) {
                    deptlist = deptlist.concat(devicelist);
                    resolve(
                      (deptlist || []).map((v) => {
                        return Object.assign(v, {
                          key: v.deptid,
                        });
                      })
                    );
                  } else {
                    resolve(
                      (devicelist || []).map((v) => {
                        return Object.assign(v, {
                          key: v.deptid,
                        });
                      })
                    );
                  }
                } else {
                  resolve(
                    (deptlist || []).map((v) => {
                      return Object.assign(v, {
                        key: v.deptid,
                      });
                    })
                  );
                }
              },
            });
          }
        }
      } else {
        parentid = data.id;
        $.ajax({
          url: self.$store.state.baseUrl + "/deviceChannelInfo/list", // 请求路径
          data: {
            deviceid: parentid,
            q: "",
            online: "",
            sort: "id",
            order: "asc",
          }, // 参数
          type: "get", // 请求类型
          async: false,
          contentType: "application/json;charset=utf-8",
          error: function (request, textStatus, errorThrown) {
            // 设置表单提交出错
          },
          success: function (ret) {
            let list = [];
            for (let i = 0; i < ret.data.length; i++) {
              if(!ret.data[i].type){//过滤掉非视频通道----0：代表视频通道  1：代表语音输出通道 2 代表报警通道 3：语音输入通道  4：其他
                ret.data[i].parentid = ret.data[i].deviceid;
                ret.data[i].deptname = ret.data[i].channelname;
                ret.data[i].deptid = Math.round(Math.random() * 999) + Math.round(Math.random() * 999);
                list.push(ret.data[i]);
              }
            }
            resolve(
              list.map((v) => {
                return Object.assign(v, {
                  key: v.deptid,
                });
              })
            );
          },
        });
      }
    },
    handleNodeClick(node) {//选中节点
      if (typeof node.channelname == "undefined") {
        return;
      } else {
        var devicename = "";
        $.get(this.$store.state.baseUrl + "/deviceInfo/details", {
          id: node.deviceid,
        }).then((ret) => {
          if (ret.code == 0) {
            devicename = ret.data.devicename;
            this.devicenameStr = ret.data.devicename;
          }
          this.valueTitle = node.deptname; //获取label
          this.valueId = node.gb_id; //获取value
          this.deviceId = node.deviceid;
          this.d_gb_id = node.d_gb_id;
          this.channelname = node.channelname;
          this.$emit("getValue", this.valueId); //传值给父组件
          $("div .is-focus").click();
          setTimeout(function () {
            $("#treeselectLi").find("input.el-input__inner").val(devicename + "/" + node.deptname);
          }, 50);
        });
      }
    },
    setPlayerPlay(val) {//播放控制--按钮
      var self = this;
      if (!self.playerstate) {
        self.$message({
          type: "error",
          message: "请先播放视频！",
        });
        return;
      }
      if (val == 1) {//暂停或者播放
        var ui1 = playease.ui(0);
        if (self.isplay) {
          if (self.playingType != 1) {
            self.playBackControl(1, self.playerchannelId);
          } else {
            self.isplay = false;
          }
          clearInterval(self.timer);
          ui1.pause();
        } else {
          if (self.playingType != 1) {
            self.playBackControl(1, self.playerchannelId);
          } else {
            self.isplay = true;
          }
          self.playerTime(true);
          ui1.play();
        }
      } else if (val == 2) {//停止
        self.toStop();
      } else if (val == 3) {
      } else if (val == 4) {//拍照
        self.flv_screenshot(0);
      } else if (val == 5) {//静音或者非静音
        var ui1 = playease.ui(0);
        if (self.issilence) {
          ui1.muted(true);
          self.issilence = false;
        } else {
          ui1.muted(false);
          self.issilence = true;
        }
      } else if (val == 6) {//慢进
        if (self.playingType != 1) {//设备
          self.playBackControl(6, self.playerchannelId);
        }else{//服务器
          let video = playease.ui(0).element();
          let rate = 1;
          if (!self.fFstate||self.fFstate == 100) {
            rate = 0.5;
            self.fFstate = 50;
          }else if (self.fFstate == 50) {
            rate = 0.25;
            self.fFstate = 25;
          }else{
            rate = 1;
            self.fFstate = 100;
          }
          video.playbackRate = rate;
        }
      } else if (val == 7) {//快进
        if (self.playingType != 1) {//设备
          self.playBackControl(7, self.playerchannelId);
        }else{//服务器
          let video = playease.ui(0).element();
          let rate = 1;
          if (!self.fFstate||self.fFstate == 100) {
            rate = 2;
            self.fFstate = 200;
          } else if (self.fFstate == 200) {
            rate = 4;
            self.fFstate = 400;
          } else {
            rate = 1;
            self.fFstate = 100;
          }
          video.playbackRate = rate;
        }
      }
    },
    changemute(index) {//拖动---音量
      var ui1 = playease.ui(0);
      if (index === 0) {
        ui1.muted(true);
        this.issilence = true;
      } else {
        ui1.muted(false);
        this.issilence = false;
        var step = index / 100;
        step = step.toFixed(1);
        ui1.volume(step);
      }
    },
    changepress(index) {//拖动---进度
      var self = this;
      if (!self.playerstate) {
        self.$message({
          type: "error",
          message: "请先播放视频！",
          duration: 1000
        });
        self.valuepress = 0;
        return;
      }
      index = parseInt(index);
      if (self.playingType != 1) {//0设备，1服务器
        self.dragWaitting = true;
        self.playWattingTime = 180;
        $.get(self.$store.state.baseUrl + "/playBackControl", {
          d_gb_id: self.d_gb_id,
          gb_id: self.playerchannelId,
          cmd: 4,
          param: index,
        }).then((ret) => {
          let ui1 = playease.ui(0);
          let time = parseInt(ui1.element().currentTime);
          if(time>index){//时间往前拖-左
            setTimeout(function(){
              ui1.reload();
              self.offsetTime = index+1;
              self.dragWaitting = false;
            },1000);
          }else{//时间往后拖-右
            setTimeout(function(){
              ui1.reload();
              self.offsetTime = index+1;
              self.dragWaitting = false;
            },1000);
          }
          if(time>index){//往前拖
            self.dragType = 2;
          }else{//往后拖
            self.dragType = 1;
          }
          if (index >= 3600) {
            let hourText = parseInt(index/3600);
            let minText = parseInt((index-hourText*3600)/60);
            let miaoText = index-hourText*3600-minText*60;
            $("#playerTextTime").html("<p style='color: #000000;font-size: 1vh;margin-top: -1%;'>" + hourText + "小时" + minText + "分" + miaoText + "秒/" + self.timeText + "</p>");
          } else if (index >= 60) {
            let minText = parseInt(index/60);
            let miaoText = index-minText*60;
            $("#playerTextTime").html("<p style='color: #000000;font-size: 1vh;margin-top: -1%;'>" + minText + "分" + miaoText + "秒/" + self.timeText + "</p>");
          } else {
            $("#playerTextTime").html("<p style='color: #000000;font-size: 1vh;margin-top: -1%;'>" + index + "秒/" + self.timeText + "</p>");
          }
        }).catch(()=>{
          self.offsetTime = 0;
          self.dragWaitting = false;
        });
      } else {
        var ui1 = playease.ui(0);
        ui1.seek(Number(index));
      }
    },
    setrightbtnshow(type) {
      if (type == 1) {
        this.showplayertable = true;
        this.showdownloadtable = false;
      } else if (type == 2) {
        this.showplayertable = false;
        this.showdownloadtable = true;
      }
    },
    toStop(callbackF) {//停止
      var self = this;
      if (self.isplay) {
        var ui1 = playease.ui(0);
        clearInterval(self.timer);
        $("#playerTextName").html("");
        $("#playerTextTime").html("<p style='color: #000000;font-size: 1vh;margin-top: -1%;'>0/0</p>");
        self.valuepress = 0;
        self.dragWaitting = false;
        self.currentPlayingCanDrag = true;
        if (self.playingType != 1) {
          $.get(self.$store.state.baseUrl + "/playBackControl", {
            d_gb_id: self.d_gb_id,
            gb_id: self.playerchannelId,
            cmd: 0,
            param: 0,
          }).then((ret) => {
            self.isplay = false;
            self.playerstate = false;
            self.fFstate = 0;
            ui1.stop();
            if(!!callbackF){
              if(self.valueId==self.playerchannelId){//要重新播放的是同一个视频，需要加个延时时间给设备反应
                setTimeout(function(){callbackF();},3000);
              }else{
                callbackF();
              }
            }
          }).catch(()=>{
            self.isplay = false;
            self.playerstate = false;
            self.fFstate = 0;
            ui1.stop();
            if(!!callbackF){
              callbackF();
            }
          });
        }else{
          self.isplay = false;
          self.playerstate = false;
          self.fFstate = 0;
          ui1.stop();
          if(!!callbackF){
            callbackF();
          }
        }
      }else{
        if(!!callbackF){
          callbackF();
        }
      }
    },
    setPlayerLength(playerNum) {
      for (var i = 0; i < playerNum; i++) {
        $("#player" + i).removeAttr("style");
        if (playerNum == 1) {
          $("#player" + i).attr("class", "col-sm-12 video-show");
          $("#player" + i).attr("class", "col-sm-12 video-show");
          var playerheight = ((window.innerHeight - 130) * 0.7).toFixed(2) + "px";
          $("#player" + i).css("height", playerheight);
        } else if (playerNum == 2 || playerNum == 4) {
          $("#player" + i).attr("class", "col-sm-6");
        } else if (playerNum == 9) {
          $("#player" + i).attr("class", "col-sm-4");
        } else if (playerNum == 16) {
          $("#player" + i).attr("class", "col-sm-3");
        } else if (playerNum == 25) {
          $("#player" + i).attr("class", "col-smxx-5");
        } else if (playerNum == 36) {
          $("#player" + i).attr("class", "col-sm-2");
        } else if (playerNum == 64) {
          $("#player" + i).attr("class", "col-smxx-8");
        }
        var ui3 = playease.ui(i);
        ui3.play("ws://www.car-eye.cn:4025/ws?port=10077&app=live&stream=13751093611_channel_2");
        ui3.stop();
      }
    },
    flv_screenshot(i) {
      var api = playease(i);
      var video = api.element();
      var scale = 1;
      var canvas = document.createElement("canvas");
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      var img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.src = canvas.toDataURL("image/png");
      var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      this.saveFile(image, "file_" + new Date().getTime() + ".png");
    },
    saveFile(data, filename) {
      var save_link = document.createElementNS("http://www.w3.org/1999/xhtml","a");
      save_link.href = data;
      save_link.download = filename;
      var event = document.createEvent("MouseEvents");
      event.initMouseEvent("click",true,false,window,0,0,0,0,0,false,false,false,false,0,null);
      save_link.dispatchEvent(event);
    },
    getQueryString(name, defVal = "") {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return defVal;
    },
    playBackControl(val, channelid) {
      var paramvalues = 0;
      var cmd = 0;
      var self = this;
      if (val == 1) {
        if (self.isplay) {
          cmd = 5;
          self.isplay = false;
        } else {
          cmd = 1;
          self.isplay = true;
        }
      } else if (val == 6) {//慢进
        if (!self.fFstate||self.fFstate == 100) {
          paramvalues = 50;
        }else if (self.fFstate == 50) {
          paramvalues = 25;
        }else{
          paramvalues = 100;
        }
        self.fFstate = paramvalues;
        cmd = 3;
      } else if (val == 7) {//快进
        if (!self.fFstate||self.fFstate == 100) {
          paramvalues = 200;
        } else if (self.fFstate == 200) {
          paramvalues = 400;
        } else {
          paramvalues = 100;
        }
        self.fFstate = paramvalues;
        cmd = 2;
      }
      $.get(self.$store.state.baseUrl + "/playBackControl", {
        d_gb_id: self.d_gb_id,
        gb_id: channelid,
        cmd: cmd,
        param: paramvalues,
      }).then((ret) => {});
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.protocol = vm.getQueryString("protocol", "");
    });
  },
};
</script>
<style>
.tableTextList {
  overflow: auto;
  background-color: #ffffff;
}

.forinput {
  padding-left: 0;
}

.video-show {
  padding-right: 0px;
  padding-left: 0;
}

.paddingdiv {
  padding-left: 15px;
  padding-right: 3px;
}

.el-table td,
.el-table th {
  padding: 5px 0;
}

.channeloffline {
  color: grey;
}

.channelonline {
  color: green;
}

.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
}

.my-select .el-scrollbar .el-select-dropdown__wrap.el-scrollbar__wrap{
  overflow: hidden;
}

.my-select-tree{
  padding: 0 10px 10px 0;
  max-height: 260px;
  overflow: auto;
}


.el-select-dropdown__item.selected {
  font-weight: normal;
}

ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}

.el-tree-node__label {
  font-weight: normal;
}

.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}

.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}

.el-slider__bar {
  background-color: rgb(30, 159, 255);
}

.el-slider__button {
  border: 2px solid rgb(30, 159, 255);
}

.selectDiv {
  box-sizing: border-box;
  border: #1e90ff solid 3px;
}

.qxselectDiv {
  box-sizing: border-box;
  border: #ffffff solid 3px;
}

ul {
  padding-left: 0;
  margin-left: 0;
}

.controlmenulist {
  float: left;
  list-style: none;
  margin-left: 0;
  margin-right: 1px;
}

.controlmenulistt {
  float: left;
  list-style: none;
  margin-left: 0;
  margin-right: 1px;
  cursor: pointer;
  position: relative;
}
.controlmenulistt .alert-tip{
  position: absolute;
  top: -23px;
  left: -26%;
  display: none;
  color: #1e9fff;
  border: 1px solid #1e9fff;
  border-radius: 4px;
  padding: 0 6px;
  white-space: nowrap;
  background-color: #fff;
  z-index: 9;
}
.controlmenulistt:hover .alert-tip{
  display: block;
}

.controlbtnmenulist {
  width: 100%;
}

.controlbtnmenulistt {
  width: 100%;
}

.btnmenulist {
  width: 18px;
  height: 18px;
}

.col-smxx-5 {
  width: 19.9999992%;
  float: left;
  padding-right: 3px;
  padding-left: 0;
  padding-top: 3px;
}

.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-6 {
  padding-right: 3px;
  padding-left: 0;
  padding-top: 3px;
}

.col-smxx-8 {
  width: 12.4444442%;
  float: left;
  padding-right: 3px;
  padding-left: 0;
  padding-top: 3px;
}

.right-menu {
  position: fixed;
  background: #fff;
  border: solid 1px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  z-index: 999;
  display: none;
}

.right-menu a {
  width: 100px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: block;
  color: #1a1a1a;
}

.right-menu a:hover {
  background: #eee;
  color: #fff;
}

.right-menu {
  border: 1px solid #eee;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
  border-radius: 1px;
}

a {
  text-decoration: none;
}

.right-menu a {
  padding: 2px;
}

.right-menu a:hover {
  background: #42b983;
}

.marleft {
  margin-left: 2%;
}
</style>

<style lang="less" scoped>
@import url(~assets/css/style.css);
@import url(~assets/css/classic.css);
@import url(~assets/css/prettify.css);
.the-box{
  height: 100%;
  width:100%;
  background-color:#fff;
  border-radius: 3px;
  padding: 10px;
  box-sizing: border-box;
  .form-group{
    label{
      font-weight: normal;
      white-space: nowrap;
      min-width: 70px;
    }
    .forinput{
      min-width: 210px;
    }
  }
  .ctrbox{
    height: 100%;
    overflow: auto;
  }
  .playbox{
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    >div{
      flex-grow: 0;
      &.tableTextList{
        flex-grow: 1;
      }
    }
  }
  .my-table{
    -webkit-overflow-scrolling: touch;
    th,td{
      padding: 6px 0;

    }
  }
  &.ismobile{
    height: 100% !important;
    min-height: 1300px !important;
    .playbox{
      height: 60%;
      padding-bottom: 10px;
    }
    .ctrbox{
      height: 40%;
    }
  }
}
@media screen and(max-width: 1199px){
  .the-box {
    min-height: 1255px;
    .ctrbox{
      height: 28.5%;
    }
    .playbox{
      height: 71.5%;
    }
  }
}
@media screen and(max-width: 767px){
  .the-box {
    min-height: 1555px;
    .ctrbox{
      height: 34%;
    }
    .playbox{
      height: 66%;
    }
  }
}
</style>

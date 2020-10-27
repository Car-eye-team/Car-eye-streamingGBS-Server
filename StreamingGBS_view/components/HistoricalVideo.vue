<template>
    <div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-3">
            <div class="form-group row">
                <label for="deptid" class="col-sm-4 control-label text-right mobilefont">摄像头
                </label>
                <div class="col-sm-8">
                    <el-select style="width:100%;" :value="valueTitle" :placeholder="placeholder" ref="select">
                        <el-option :value="valueTitle" :label="valueTitle" class="options">
                            <el-tree ref="devTree" id="dev-tree" node-key="deptid" v-if="showTree" :props="treeProps"
                                     :load="treeLoad" lazy
                                     @node-click="handleNodeClick">
                                  <span class="custom-tree-node" slot-scope="{node, data}">
                                    <span>
                                      <i :class="['fa', {'fa-sitemap':typeof data.parentid != 'undefined'&&typeof data.channelname == 'undefined',
                                        'fa-camera channeloffline': typeof data.channelname != 'undefined'&&data.status===0,'fa-camera channelonline': typeof data.channelname != 'undefined'&&data.status===1}]"></i>
                                        <span class="ellipsis mobilefont" :title="node.label">{{node.label}}</span>
                                    </span>
                                  </span>
                            </el-tree>
                        </el-option>
                    </el-select>
                </div>
            </div>


            <div class="form-group row">
                <label for="startTime" class="col-sm-4 control-label text-right mobilefont">开始时间
                </label>
                <div class="col-sm-8">
                    <el-date-picker class="mobilefont" style="width:100%;" id="startTime" name="startTime"
                                    type="datetime"
                                    placeholder="选择日期" v-model.trim="form.startTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </div>
            </div>

            <div class="form-group row">
                <label for="endTime" class="col-sm-4 control-label text-right">结束时间
                </label>
                <div class="col-sm-8">
                    <el-date-picker class="mobilefont" style="width:100%;" id="endTime" name="endTime" type="datetime"
                                    placeholder="选择日期" v-model.trim="form.endTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </div>
            </div>
            <div class="form-group row">
                <label for="input-usersex" class="col-sm-4 control-label text-right">存储位置
                </label>
                <div class="col-sm-8">
                    <el-radio-group class="text-left mobilefont" v-model.trim="form.memoryType" @change="changeHandler"
                                    :active-value="0">
                        <el-radio label="0">设备</el-radio>
                        <br/>
                        <el-radio label="1">服务器</el-radio>
                        <br/>
                        <el-radio label="2">设备和服务器</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="row text-center">
                <button type="button" class="btn btn-md btn-success" @click.prevent="searchList">
                    <i class="fa fa-search mobilefont"></i> 搜索
                </button>
            </div>
        </div>
        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-9">
            <div class="view-list row">
                <div class="video-show col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div id="car-eye-player">
                        <a @click='choseplayer(0)'>
                            <div class='col-smxx-8' id='player0'></div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12 col-sm-10 col-md-10 col-lg-10 text-left">
                    <ul>
                        <li @click.prevent="setPlayerPlay(1)" class="controlmenulistt">
                            <img class="controlbtnmenulist" src="../assets/images/play.png" v-show="!isplay"/>
                            <img class="controlbtnmenulist" src="../assets/images/pause.png" v-show="isplay"/>
                        </li>
                        <li @click.prevent="setPlayerPlay(2)" class="controlmenulistt">
                            <img class="controlbtnmenulist" src="../assets/images/stop.png"/>
                        </li>
                        <!--                        <li @click.prevent="setPlayerPlay(3)" class="controlmenulistt">-->
                        <!--                            <img class="controlbtnmenulist" src="../assets/images/keyframes.png"/>-->
                        <!--                        </li>-->
                        <li @click.prevent="setPlayerPlay(4)" class="controlmenulistt">
                            <img class="controlbtnmenulist" src="../assets/images/capture.png"/>
                        </li>
                        <li @click.prevent="setPlayerPlay(5)" class="controlmenulistt">
                            <img class="controlbtnmenulist" src="../assets/images/mute.png" v-show="!issilence"/>
                            <img class="controlbtnmenulist" src="../assets/images/unmute.png" v-show="issilence"/>
                        </li>
                        <li style="width:10%;" class="controlmenulistt yltcls">

                            <el-slider v-model="value1" @change="changemute"></el-slider>
                            <!--<img class="btnmenulist" src="../assets/images/unmute.png"/>-->
                        </li>
                        <li @click.prevent="setPlayerPlay(6)" class="controlmenulistt">
                            <img class="controlbtnmenulist" src="../assets/images/backward.png"/>
                        </li>
                        <li @click.prevent="setPlayerPlay(7)" class="controlmenulistt">
                            <img class="controlbtnmenulist" src="../assets/images/forward.png"/>
                        </li>

                    </ul>
                </div>

                <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 text-right">
                    <ul>
                        <li @click.prevent="setrightbtnshow(1)" class="controlmenulistt downloadbtn">
                            <img class="controlbtnmenulistt" src="../assets/images/video-file.png"/>
                        </li>
                        <li @click.prevent="setrightbtnshow(2)" class="controlmenulistt downloadbtn">
                            <img class="controlbtnmenulistt" src="../assets/images/video-down.png"/>
                        </li>


                    </ul>
                </div>
            </div>

            <div class="row">
                <el-scrollbar :style="{'height':scrllerheight}">
                    <el-table :data="tableDataList" v-show="showplayertable" style="width:100%;">

                        <el-table-column class="mobilefont" label="设备/通道名称" :formatter="stateFormat"></el-table-column>
                        <el-table-column class="mobilefont" prop="startTime" :formatter="stateFormatTime"
                                         label="开始时间"></el-table-column>
                        <el-table-column class="mobilefont" prop="endTime" :formatter="stateFormatTime"
                                         label="结束时间"></el-table-column>
                        <el-table-column class="mobilefont" label="操作">
                            <template slot-scope="props">
                                <div class="btn-group btn-group-xs">
                                    <button type="button" class="btn btn-warning mobilefont"
                                            @click.prevent="playBackplayer(props.row)">
                                        <i class="fa fa-play"></i> 播放
                                    </button>
                                    <button type="button" class="btn btn-danger mobilefont"
                                            @click.prevent="downLoadVideo(props.row)">
                                        <i class="fa fa-download"></i> 下载
                                    </button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--<table class="table table-bordered" id="backplayertable">-->
                    <!--<thead>-->
                    <!--<tr class="active">-->
                    <!--<td>设备/通道名称</td>-->
                    <!--<td>开始时间</td>-->
                    <!--<td>结束时间</td>-->
                    <!--&lt;!&ndash;<td>文件大小(Mb)</td>&ndash;&gt;-->
                    <!--<td>操作</td>-->
                    <!--</tr>-->
                    <!--</thead>-->
                    <!--<tbody id="backplayerlist"></tbody>-->
                    <!--</table>-->
                    <div v-show="showdownloadtable">
                        <table class="table table-bordered" id="backdownloadtable">
                            <thead>
                            <tr class="active">
                                <td>通信SIM卡号码</td>
                                <td>逻辑通道号</td>
                                <td>开始时间</td>
                                <td>结束时间</td>
                                <td>流水号</td>
                                <td>文件路径</td>
                                <td>文件大小(Mb)</td>
                                <td>已上传大小(Mb)</td>
                                <td>文件状态</td>
                                <td>操作</td>
                            </tr>
                            </thead>
                            <tbody id="downloadlist"></tbody>
                        </table>
                    </div>
                </el-scrollbar>
            </div>

        </div>

    </div>
</template>
<script>
    import $ from 'jquery'
    import {mapState} from "vuex";
    import "assets/css/classic.css";
    import "assets/css/style.css";
    import {component as VueContextMenu} from '@xunlei/vue-context-menu'
    import ElementUI from "element-ui"
    import {WEB_Socket} from '../assets/config/linkparam.js'
    import logo from "../assets/images/logo.png";
    export default {
        components: {VueContextMenu, ElementUI},
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
                showplayertable: true,
                showdownloadtable: false,
                logoimg: logo,
                deviceId: '',
                channelCode: '',
                memoryType: 0,
                value1: 100,
                issilence: false,
                isplay: false,
                showTree: true,
                scrllerheight: "150",
                fastForwardstate: 0,
                fFstate: 0,
                playerstate:false,
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
                                node.channelcode = data.channelcode;
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
                        // return false;
                        // console.log(data);
                        if (typeof data.channelname != "undefined") {
                            return true;
                        } else {
                            if (typeof data.devicename != "undefined") {
                                return data.channels == 0;

                            } else {
                                return (Number(data.subCount) + Number(data.subDeviceCount)) == 0;
                            }
                        }

                    },
                    disabled:
                        (data, node) => {
                            return false;
                        }
                },
                valueId: '',// 初始值
                valueTitle: '',
                socket: null,
                tableDataList: [],
                channelname: '',
                channelnamestr: '',
                deviceIdstr: '',
                channelCodestr: '',

            };

        }
        ,
        computed: {
            ...
                mapState(["userInfo", "serverInfo"]),
        }
        ,
        mounted() {
            // console.log(this.$store.state.deptOptions);
            // scrllerheight
            // $("#car-eye-player").html("");
            this.scrllerheight = document.documentElement.clientHeight * 0.2 + "px";
            this.playerrestart("", "player0", 0);
            $("#player0").find(".pe-wrapper").css("border", "#FFFFFF solid 2px");
            $("#player0").find("div.pe-controlbar").html("");
            $("#player0").find("div.pe-logo").remove();
            this.setPlayerLength(this.playerLength);
            this.form.memoryType = '0';
            if (this.isMobile()) {
                $(".controlmenulistt").css("width", "13.2%")
                $(".yltcls").css("margin-right", "3%")
                $(".yltcls").css("margin-top", "-3%")
                $(".downloadbtn").css("width", "10%");
                $(".downloadbtn").css("float", "right");
                $("#startTime").css("font-size","1.5vh");
                $("#startTime").css("padding-right","0");
                $("#endTime").css("font-size","1.5vh");
                $("#endTime").css("padding-right","0");
                $("#player0").css("padding-right","0");
                $("#player0").css("padding-left","0");
                // $(".mobilefont").css("font-size", "0.1em");
            } else {
                $(".yltcls").css("margin-right", "1%")
                $(".yltcls").css("margin-top", "-0.3%")
                $(".downloadbtn").css("width", "10%");
            }
        }
        ,
        methods: {
            stateFormat() {
                return this.channelnamestr;
            },
            stateFormatTime(row, column) {
                var time = "";
                if (typeof row.startTime != 'undefined') {
                    time = row.startTime.replace('T', ' ');
                }
                if (typeof row.endTime != 'undefined') {
                    time = row.endTime.replace('T', ' ');
                }
                return time;
            },
            openSocket() {
                var self = this;
                if (typeof (WebSocket) == "undefined") {
                    self.$message({
                        type: 'error',
                        message: "您的浏览器不支持WebSocket"
                    })
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
                        var obj = eval('(' + msg.data + ')');
                        self.channelnamestr = self.channelname;
                        self.channelCodestr = self.valueId;
                        self.deviceIdstr = self.deviceId;
                        self.tableDataList = obj;

                    };
                    //关闭事件
                    self.socket.onclose = function () {
                        console.log("websocket已关闭");
                    };
                    //发生了错误事件
                    self.socket.onerror = function () {
                        console.log("websocket发生了错误");
                    }
                }
            },
            downLoadVideo(opt) {
                var self = this;
                // alert(JSON.stringify(opt));
                $.get(self.$store.state.baseUrl + "/downLoadVideo", {
                    deviceId: self.deviceIdstr,
                    channelId: self.channelCodestr,
                    vedioType: 0,
                    streamType: 0,
                    memoryType: self.memoryType,
                    startTime: opt.startTime.replace("T", " "),
                    endTime: opt.endTime.replace("T", " ")
                }).then(ret => {
                    // alert(ret.data);
                    // this.startPlay(ret,channelId,startTime,endTime);

                })
            },
            startPlay(url, deviceId, channelId, startTime, endTime) {
                var ui2 = playease.ui(0);
                ui2.stop();
                ui2.play(url);
                $("#player0").find("div#souga").remove();
                $("#player0").find("div.pe-controlbar").append("<div id='souga' style='float: left;position: absolute; color:#FFFFFF;margin-top:2%;font-size: 1vh;'>" + this.channelnamestr + ":(" + startTime + "——" + endTime + ")"
                    + "</div>"
                );
                this.playerstate = true;
                this.isplay = true;
            },
            playBackplayer(opt) {
                var self = this;
                $.get(self.$store.state.baseUrl + "/playBack", {
                    deviceId: self.deviceIdstr,
                    channelId: self.channelCodestr,
                    vedioType: 0,
                    streamType: 0,
                    memoryType: self.memoryType,
                    startTime: opt.startTime.replace('T', ' '),
                    endTime: opt.endTime.replace('T', ' ')
                }).then(ret => {
                    // alert(ret.data);
                    this.startPlay(ret, self.deviceIdstr, self.channelCodestr, opt.startTime.replace('T', ' '), opt.endTime.replace('T', ' '));
                })
            },
            changeHandler(value) {
                this.memoryType = value;
            },
            selectChanged(value) {
                this.channelCode = value;
            },
            searchList() {
                if (this.deviceId == "") {
                    this.$message({
                        type: 'error',
                        message: "请选择设备！"
                    })
                    return;
                }
                var startTime = $("#startTime").val();
                if (startTime == "" || startTime == null) {
                    this.$message({
                        type: 'error',
                        message: "请选择开始时间！"
                    })
                    return;
                }
                var endTime = $("#endTime").val();
                if (endTime == "" || endTime == null) {
                    this.$message({
                        type: 'error',
                        message: "请选择结束时间！"
                    })
                    return;
                }
                this.openSocket();
                $.get(this.$store.state.baseUrl + "/queryVedioList", {
                    deviceId: this.deviceId,
                    channelId: this.valueId,
                    memoryType: this.memoryType,
                    startTime: startTime,
                    endTime: endTime
                }).then(ret => {
                    // alert(ret.data);

                })
            },
            treeLoad(data, resolve) {
                //
                var self = this;
                // console.log(data);
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
                            contentType: 'application/json;charset=utf-8',
                            error: function (request, textStatus, errorThrown) { // 设置表单提交出错

                            },
                            success: function (ret) {
                                deptlist = ret.data;
                                if (parentid == "-1") {
                                    resolve((deptlist || []).map(v => {
                                        return Object.assign(v, {
                                            key: v.deptid,
                                        })
                                    }));
                                }
                            }
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
                                contentType: 'application/json;charset=utf-8',
                                error: function (request, textStatus, errorThrown) { // 设置表单提交出错

                                },
                                success: function (rett) {
                                    var devicelist = rett.data;
                                    // alert(JSON.stringify(rett.data));
                                    if (devicelist != null) {
                                        for (var i = 0; i < devicelist.length; i++) {

                                            devicelist[i].parentid = devicelist[i].deptid;
                                            devicelist[i].deptname = devicelist[i].devicename;
                                            devicelist[i].deptid = Math.round(Math.random() * 999)
                                                + Math.round(Math.random() * 999);
                                        }
                                        if (deptlist != null) {
                                            deptlist = deptlist.concat(devicelist);

                                            resolve((deptlist || []).map(v => {
                                                return Object.assign(v, {
                                                    key: v.deptid,
                                                })
                                            }));
                                        } else {
                                            resolve((devicelist || []).map(v => {
                                                return Object.assign(v, {
                                                    key: v.deptid,
                                                })
                                            }));
                                        }
                                    } else {
                                        resolve((deptlist || []).map(v => {
                                            return Object.assign(v, {
                                                key: v.deptid,
                                            })
                                        }));
                                    }
                                }
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
                            order: "asc"
                        }, // 参数
                        type: "get", // 请求类型
                        async: false,
                        contentType: 'application/json;charset=utf-8',
                        error: function (request, textStatus, errorThrown) { // 设置表单提交出错

                        },
                        success: function (ret) {
                            for (var i = 0; i < ret.data.length; i++) {

                                ret.data[i].parentid = ret.data[i].deviceid;
                                ret.data[i].deptname = ret.data[i].channelname;
                                ret.data[i].deptid = Math.round(Math.random() * 999)
                                    + Math.round(Math.random() * 999);
                            }
                            resolve((ret.data || []).map(v => {
                                return Object.assign(v, {
                                    key: v.deptid,
                                })
                            }));
                        }
                    });

                }

            }
            ,
            handleNodeClick(node) {
                if (typeof node.channelname == "undefined") {
                    // this.$message({
                    //     type: 'error',
                    //     message: "请选择摄像头！！"
                    // })
                    return;
                } else {
                    this.valueTitle = node.deptname//获取label
                    this.valueId = node.channelcode//获取value
                    this.deviceId = node.deviceid;
                    this.channelname = node.channelname;
                    this.$emit('getValue', this.valueId)//传值给父组件
                    $("div .is-focus").click();
                }
            },
            setPlayerPlay(val) {
                var self = this;
                if(!self.playerstate){
                    this.$message({
                        type: 'error',
                        message: "请先播放视频！"
                    })
                    return;
                }
                if (val == 1) {
                    var ui1 = playease.ui(0);
                    if (self.isplay) {
                        self.playBackControl(1, self.channelCodestr);
                    } else {
                        self.playBackControl(1, self.channelCodestr);

                    }

                } else if (val == 2) {
                    var ui1 = playease.ui(0);
                    ui1.stop();
                    $("#player0").find("div#souga").remove();
                    $.get(self.$store.state.baseUrl + "/playControl", {
                       deviceId: self.deviceIdstr,
                       channelId: self.channelCodestr,
                       command: 0
                    }).then(ret => {
                        self.isplay = false;
                        self.playerstate = false;
                    })

                } else if (val == 3) {

                } else if (val == 4) {
                    self.flv_screenshot(0);
                } else if (val == 5) {
                    var ui1 = playease.ui(0);
                    if (self.issilence) {
                        ui1.muted(true);
                        self.issilence = false;
                    } else {
                        ui1.muted(false);
                        self.issilence = true;
                    }
                } else if (val == 6) {
                    self.playBackControl(6, self.channelCodestr);
                } else if (val == 7) {
                    self.playBackControl(7, self.channelCodestr);
                }

            },
            changemute(index) {
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
            setrightbtnshow(type) {
                if (type == 1) {
                    this.showplayertable = true;
                    this.showdownloadtable = false;
                } else if (type == 2) {
                    this.showplayertable = false;
                    this.showdownloadtable = true;
                }
            },
            stopAll() {
                var self = this;
                if(self.isplay){
                        // 发送停止播放的命令
                        var param = j.split("_");
                        // closePlay(param[0], param[1], 1, param[3]);
                        var ui3 = playease.ui(0);
                        $("#player0").find("div#souga").remove();
                        ui3.stop();
                        $.get(self.$store.state.baseUrl + "/playBackControl", {
                            deviceId: self.deviceIdstr,
                            channelId: self.channelCodestr,
                            command: 0
                        }).then(ret => {
                            // return;
                            self.playerstate = false;
                            self.isplay = false;
                            self.fastForwardstate = 0;
                            self.fFstate = 0;
                        })
                }
            },
            defForm() {
                return {
                    deptid: '',
                    channelId: '',
                    memoryType: '',
                    startTime: '',
                    endTime: ''
                }
            },
            setPlayerLength(playerNum) {
                for (var i = 0; i < playerNum; i++) {
                    if (playerNum == 1) {
                        $("#player" + i).attr("class", "col-sm-12");
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
                    $("#player" + i).removeAttr("style");
                    var ui3 = playease.ui(i);
                    ui3.play("ws://www.car-eye.cn:4025/ws?port=10077&app=live&stream=13751093611_channel_2");
                    ui3.stop();
                }
            }, playerrestart(fileurl, playerid, val) {


                var container = document.getElementById(playerid);
                // var ui.setup(container, {})
                var ui = playease.ui(val);
                ui.setup(container, {
                    mode: 'live',
                    file: fileurl,
                    // module: 'FLV',
                    loader: {
                        name: 'auto',
                        mode: 'cors',        // cors, no-cors, same-origin
                        credentials: 'omit', // omit, include, same-origin
                    },

                    plugins: [
                        {
                            kind: 'Poster',
                            file: this.logoimg,
                            visibility: true
                        },
                        {
                            kind: 'Display',
                            layout: '',
                            ondouBleclick: 'fullscreen',
                            visibility: true
                        }, {
                            kind: 'Controlbar',
                            layout: '||[Slider:timebar=Preview]|[Button:play=播放][Button:pause=暂停][Button:reload=重新加载][Button:stop=停止][Label:time=00:00/00:00][Button:capture=Capture][Button:mute=静音][Button:unmute=取消静音][Slider:volumebar=80][Button:fullscreen=全屏][Button:exitfullscreen=退出全屏]',
                            autohide: false,
                            visibility: true,
                        }, {
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
                        }],
                });
                ui.addEventListener('error', console.error);
            }
            ,
            flv_screenshot(i) {
                var api = playease(i);
                var video = api.element();
                var scale = 1;
                // var vid = "video"+i;
                var canvas = document.createElement("canvas");
                // var video = document.getElementById("video");
                canvas.width = video.videoWidth * scale;
                canvas.height = video.videoHeight * scale;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                var img = document.createElement("img");
                img.crossOrigin = 'anonymous';
                img.src = canvas.toDataURL("image/png");
                //$output.prepend(img);
                var image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                this.saveFile(image, 'file_' + new Date().getTime() + '.png');
            }
            ,
            saveFile(data, filename) {
                var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                save_link.href = data;
                save_link.download = filename;
                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                save_link.dispatchEvent(event);
            }
            ,
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
                        cmd = 0;
                        self.isplay = false;
                    } else {
                        cmd = 1;
                        self.isplay = true;
                    }
                } else if (val == 7) {
                    if (self.fastForwardstate == 25) {
                        self.fastForwardstate = 50;
                    } else if (self.fastForwardstate == 50) {
                        self.fastForwardstate = 100;
                    } else if (self.fastForwardstate == 100) {
                        self.fastForwardstate = 200;
                    } else if (self.fastForwardstate == 200) {
                        self.fastForwardstate = 400;
                    } else if (self.fastForwardstate == 400) {
                        return;
                    }else {
                        self.fastForwardstate = 25;
                    }
                    cmd = 2
                } else if (val == 6) {
                    if (self.fFstate == 25) {
                        self.fFstate = 50;
                    } else if (self.fFstate == 50) {
                        self.fFstate = 100;
                    } else if (self.fFstate == 100) {
                        self.fFstate = 200;
                    } else if (self.fFstate == 200) {
                        self.fFstate = 400;
                    } else if (self.fFstate == 400) {
                        return;
                    }else {
                        self.fFstate = 25;
                    }
                    cmd = 3
                }
                $.ajax({
                    url: self.$store.state.baseUrl + "/playBackControl", // 请求路径
                    data: {
                        channelId: channelid,
                        cmd: cmd,
                        param: paramvalues
                    }, // 参数
                    type: "get", // 请求类型
                    async: false,
                    contentType: 'application/json;charset=utf-8',
                    error: function (request, textStatus, errorThrown) { // 设置表单提交出错

                    },
                    success: function (data) {

                        this.$message({
                            type: 'success',
                            message: "操作成功！"
                        })
                    }
                });
            }

        }
        ,
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.protocol = vm.getQueryString("protocol", "");
            });
        }
        ,


    }
    ;
</script>
<style>
    .video-show{
        padding-right: 0px;
    }
    .paddingdiv {
        padding-left: 15px;
        padding-right: 3px;
    }

    .el-table td, .el-table th {
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
        overflow-y: auto;
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
        color: #409EFF;
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
        border: #1E90FF solid 3px;
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

    .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-6 {
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
        border: solid 1px rgba(0, 0, 0, .2);
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
        box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, .1);
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

    video {
        object-fit: fill;
    }
</style>

<style lang="less" scoped>
    @import url(~assets/css/style.css);
    @import url(~assets/css/classic.css);
    @import url(~assets/css/prettify.css);
</style>

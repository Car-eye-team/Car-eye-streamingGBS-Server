<template>
    <div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-3">
            <!--show-checkbox-->
            <div id="tab-tree-wrapper">

                    <el-tree ref="devTree" class="flow-tree" id="dev-tree" node-key="key" v-if="showTree" :props="treeProps"
                             :load="treeLoad" :style="`${isMobile() ? 'max-height:200px' : 'max-height:800px'};min-height:200px;overflow:auto;max-width:400px;margin:auto;`"
                             :filter-node-method="treeFilter" lazy
                             @node-click="treeNodeClick" @node-contextmenu="treeNodeRightClick" >
                      <span class="custom-tree-node" slot-scope="{node, data}">
                        <span> <!--:class="{'text-green': data.subCount === 0||data.channels===0}"'fa-taxi': typeof data.devicename != 'undefined'&&data.online===1-->
                          <i :class="['fa', {'fa-sitemap':typeof data.parentid != 'undefined'&&typeof data.channelname == 'undefined',
                            'fa-camera channeloffline': typeof data.channelname != 'undefined'&&data.status===0,'fa-camera channelonline': typeof data.channelname != 'undefined'&&data.status===1}]"></i>
                            <span class="ellipsis" :title="node.label">{{node.label}}</span>
                        </span>
                      </span>
                    </el-tree>
            </div>
            <VueContextMenu class="right-menu" :target="contextMenuTarget" :show="contextMenuVisible"
                            @update:show="(show) => contextMenuVisible = show">
                <a href="javascript:;" @click="playAll" v-show="popup==1" style="color: #000000;">
                    <i class="fa fa-caret-square-o-right"></i>预览全部
                </a>
                <a href="javascript:;" @click="voiceintercom" style="color: #000000;" v-show="popup==2">
                    <i class="fa fa-microphone"></i> 开启对讲
                </a>
                <a href="javascript:;" @click="setYuntai" style="color: #000000;" v-show="popup==2">
                    <i class="fa fa-mixcloud"></i> 云台设置
                </a>
                <a href="javascript:;" @click="gbControl" style="color: #000000;" v-show="popup==2">
                    <i class="fa fa-hand-o-right"></i> 设备控制
                </a>
            </VueContextMenu>

        </div>
        <div class="col-xs-8 col-sm-8 col-md-8 col-lg-9">
            <div class="col-xs-12 text-left">
                <ul>
                    <li class="btnmenuli" v-for="list in playerBtnGroup" :key="list.num"
                        @click.prevent="setPlayerLength(list.num)">
                        <img class="btnmenulist" :src="list.img"/>
                    </li>

                    <li class="btnmenuli" @click="isshowstop">
                        <img class="btnmenulist" src="../assets/images/closebtn.png"/>
                        <VueContextMenu class="right-menu" :show="showstop">
                            <a href="javascript:;" @click="stopAll" style="color: #000000;">
                                <!--<i class="fa fa-stop-circle"></i>-->
                                关闭所有视频
                            </a>
                        </VueContextMenu>
                    </li>
                </ul>
            </div>
            <div class="view-list row">
                <div class="video-show col-xs-12 col-sm-12 col-md-12 col-lg-12" style="padding-right:3px;">
                    <!--<div class="no-margin no-padding video" v-for="(player,index) in players" :key="index"-->
                    <!--id="{{index}}"-->
                    <!--@mousemove="resetCloseTimer(player)" @touchstart="resetCloseTimer(player)"-->
                    <!--:class="{'col-sm-12': playerLength == 1,'col-sm-6': playerLength == 2,'col-sm-6': playerLength == 4,'col-sm-4': playerLength == 9,'col-sm-3': playerLength == 16,'col-smxx-5': playerLength == 25,'col-sm-2': playerLength == 36,'col-smxx-8': playerLength == 64}">-->

                    <!--</div>-->
                    <div id="car-eye-player">
                    </div>
                </div>
            </div>

        </div>
        <LiveYuntai ref="liveYuntai" id="liveyuntai"></LiveYuntai>
        <VoiceInterCom ref="voiceInterCom" id="voiceintercom"></VoiceInterCom>
        <LiveGbControl ref="liveGbControl" id="liveGbControl"></LiveGbControl>
    </div>
</template>
<script>
    import $ from "jquery";
    import "assets/css/classic.css";
    import "assets/css/style.css";
    import {component as VueContextMenu} from '@xunlei/vue-context-menu' // var lastnum = "";
    import LiveYuntai from 'components/LiveYuntai.vue'
    import LiveGbControl from 'components/LiveGbControl.vue'
    import VoiceInterCom from 'components/VoiceInterCom.vue'
    import con1 from "../assets/images/1.png";
    import con2 from "../assets/images/2.png";
    import con4 from "../assets/images/4.png";
    import con9 from "../assets/images/9.png";
    import con16 from "../assets/images/16.png";
    import con25 from "../assets/images/25.png";
    import con36 from "../assets/images/36.png";
    import con64 from "../assets/images/64.png";
    import logo from "../assets/images/logo.png";
    import  fastClick from 'fastclick'
    fastClick.attach(document.body);
    // var lastnum = "";
    export default {
        components: {VueContextMenu, LiveYuntai, VoiceInterCom,LiveGbControl},
        data() {
            return {
                players: [],
                playerLength: this.isMobile() ? 2 : 4,
                protocol: "",
                lastnum: 0,
                q: "",
                online: "",
                total: 0,
                pageSize: 10,
                currentPage: 1,
                sort: "id",
                order: "desc",
                showTree: true,
                nodedeviceid: null,
                nodechannelcode: null,
                nodeprotocol: null,
                nodechannelname: null,
                vedioType: 0,
                popup: 0,
                contextMenuTarget: null,
                contextMenuVisible: false,
                contextMenuNodeData: null,
                playerindex: 0,
                treeClickCount: 0,
                channelcount: 0,
                showstop: false,
                terminals: new Array(),
                logoimg: logo,
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
                }
            }
                ;

        }
        ,
        computed: {
            //     mapState(["userInfo", "serverInfo"]),
            playerBtnGroup() {
                var list = [{
                    num: 1,
                    img: con1
                }, {
                    num: 2,
                    img: con2
                }, {
                    num: 4,
                    img: con4
                }, {
                    num: 9,
                    img: con9
                }, {
                    num: 16,
                    img: con16
                }, {
                    num: 25,
                    img: con25
                }, {
                    num: 36,
                    img: con36
                }, {
                    num: 64,
                    img: con64
                }];

                return list;
            }
        }
        ,
        mounted() {
            //this.getDeptOptions();
            // this.getDeviceList();
            this.contextMenuTarget = document.querySelector('#tab-tree-wrapper');
            $("#car-eye-player").html("");
            for (var i = 0; i < 64; i++) {//<a onclick='choseplayer("+i+")'></a>
                $("#car-eye-player").append("<div class='col-smxx-8' id='player" + i + "' style='display:none;'></div>");
                this.playerrestart("", "player" + i, i);
                $("#player"+i).find("div.pe-logo").remove();

            }
            this.setPlayerLength(this.playerLength);
        }
        ,
        methods: {
            phonetouch(data){
                this.$message({
                    type: 'success',
                    message: JSON.stringify(data)
                })
            },
            isshowstop() {
                if (this.showstop) {
                    this.showstop = false;
                } else {
                    this.showstop = true;
                }
            },
            playAll() {
                var self = this;
                $.get(self.$store.state.baseUrl + "/deviceChannelInfo/list", {
                    deviceid: self.nodedeviceid,
                    q: "",
                    online: "",
                    sort: "id",
                    order: "asc"
                }).then(ret => {
                    var channellist = ret.data;
                    for (var z = 0; z < channellist.length; z++) {
                        var url = "";
                        var deviceidd = channellist[z].deviceid;
                        var channelidd = channellist[z].channelcode;
                        var channenamee = channellist[z].channelname;
                        // await this.hbJson();
                        var isaddterminls = 0;
                        var terminalslist = self.terminals;
                        var playerindexx = self.playerindex;
                        $.ajax({
                            url: self.$store.state.baseUrl + "/play", // 请求路径
                            data: {
                                deviceId: deviceidd,
                                channelId: channelidd,
                                vedioType: 0
                            }, // 参数
                            type: "get", // 请求类型
                            async: false,
                            contentType: 'application/json;charset=utf-8',
                            error: function (request, textStatus, errorThrown) { // 设置表单提交出错

                            },
                            success: function (data) {
                                url = data;
                                // url = "ws://www.car-eye.cn:4025/ws?port=10077&app=live&stream=34020000001310000001_GB28181";
                                if (terminalslist != null && terminalslist.length > 0) {
                                    var playerindex = null;
                                    $.each(terminalslist, function (i, j) {
                                        // 发送停止播放的命令
                                        var param = j.split("_");
                                        // closePlay(param[0], param[1], 1, param[3]);
                                        if (param[1] == channelidd) {
                                            playerindex = param[2];
                                            return;
                                        }
                                    });
                                    if (playerindex != null) {
                                        var ui2 = playease.ui(playerindex);
                                        ui2.stop();
                                        ui2.play(url);
                                    } else {
                                        if (self.isMobile()) {
                                            if (self.playerindex >= 2) {
                                                this.$message({
                                                    type: 'error',
                                                    message: "手机端最多支持二个同时播放！"
                                                })
                                                return;
                                            }
                                        }


                                        if (self.playerLength == self.playerindex) {
                                            if (self.playerLength == 1) {
                                                self.setPlayerLength(2);
                                            } else if (self.playerLength == 2) {
                                                self.setPlayerLength(4);
                                            } else if (self.playerLength == 4) {
                                                self.setPlayerLength(9);
                                            } else if (self.playerLength == 9) {
                                                self.setPlayerLength(16);
                                            } else if (self.playerLength == 16) {
                                                self.setPlayerLength(25);
                                            } else if (self.playerLength == 25) {
                                                self.setPlayerLength(36);
                                            } else if (self.playerLength == 36) {
                                                self.setPlayerLength(64);
                                            } else if (self.playerLength == 64) {
                                                return;
                                            }
                                        }
                                        isaddterminls = 1
                                        var ui3 = playease.ui(playerindexx);
                                        ui3.play(url);

                                        $("#player" + playerindexx).find("div#souga").remove();

                                        $("#player" + playerindexx).find("div.pe-controlbar").append("<div id='souga' style='float: left;position: absolute; color:#FFFFFF;margin-top:-3.5%;font-size: 1vh;'>" + channenamee
                                            + "</div>"
                                        );
                                        playerindexx = playerindexx + 1;
                                    }

                                } else {
                                    if (self.isMobile()) {
                                        if (self.playerindex >= 2) {
                                            this.$message({
                                                type: 'error',
                                                message: "手机端最多支持二个同时播放！"
                                            })
                                            return;
                                        }
                                    }
                                    if (self.playerLength == self.playerindex) {
                                        if (self.playerLength == 1) {
                                            self.setPlayerLength(2);
                                        } else if (self.playerLength == 2) {
                                            self.setPlayerLength(4);
                                        } else if (self.playerLength == 4) {
                                            self.setPlayerLength(9);
                                        } else if (self.playerLength == 9) {
                                            self.setPlayerLength(16);
                                        } else if (self.playerLength == 16) {
                                            self.setPlayerLength(25);
                                        } else if (self.playerLength == 25) {
                                            self.setPlayerLength(36);
                                        } else if (self.playerLength == 36) {
                                            self.setPlayerLength(64);
                                        } else if (self.playerLength == 64) {
                                            return;
                                        }
                                    }
                                    isaddterminls = 1;
                                    var ui3 = playease.ui(playerindexx);
                                    ui3.play(url);

                                    $("#player" + playerindexx).find("div.pe-controlbar").append("<div id='souga' style='float: left;position: absolute; color:#FFFFFF;margin-top:-3.5%;font-size: 1vh;'>" + channenamee
                                        + "</div>"
                                    );
                                    playerindexx = playerindexx + 1;

                                }

                            }
                        });
                        if (isaddterminls == 1) {
                            self.playerindex = self.playerindex + 1;
                            var xyindex = self.playerindex - 1;
                            self.terminals.push(deviceidd + "_" + channelidd + "_" + xyindex);
                            for (var i = 0; i < self.lastnum; i++) {
                                $("#player" + i).height($("#player" + xyindex).height());
                            }
                        }

                    }

                })
            },
            setYuntai() {
                var self = this;
                self.$refs["liveYuntai"].show({
                    deviceId: self.nodedeviceid,
                    channelId: self.nodechannelcode
                });
            },
            gbControl() {
                var self = this;
                self.$refs["liveGbControl"].show({
                    deviceId: self.nodedeviceid,
                    channelId: self.nodechannelcode
                });
            },
            voiceintercom() {
                var self = this;
                self.$refs["voiceInterCom"].show({
                    deviceId: self.nodedeviceid,
                    channelId: self.nodechannelcode
                });
            },
            playOne() {
                $.get(this.$store.state.baseUrl + "/play", {
                    deviceId: this.nodedeviceid,
                    channelId: this.nodechannelcode,
                    vedioType: this.vedioType
                }).then(ret => {
                    this.startplay(ret)
                })
            },
            startplay(url) {
                var channelidd = this.nodechannelcode;
                if (null != this.terminals && this.terminals.length > 0) {
                    var playerindex = null;
                    $.each(this.terminals, function (i, j) {
                        // 发送停止播放的命令
                        var param = j.split("_");
                        // closePlay(param[0], param[1], 1, param[3]);
                        if (param[1] == channelidd) {
                            playerindex = param[2];
                            return;
                        }
                    });
                    if (playerindex != null) {
                        var ui2 = playease.ui(playerindex);
                        ui2.stop();
                        ui2.play(url);
                    } else {
                        if (this.isMobile()) {
                            if (this.playerindex >= 2) {
                                this.$message({
                                    type: 'error',
                                    message: "手机端最多支持二个同时播放！"
                                })
                                return;
                            }
                        }
                        if (this.playerLength == this.playerindex) {
                            if (this.playerLength == 1) {
                                this.setPlayerLength(2);
                            } else if (this.playerLength == 2) {
                                this.setPlayerLength(4);
                            } else if (this.playerLength == 4) {
                                this.setPlayerLength(9);
                            } else if (this.playerLength == 9) {
                                this.setPlayerLength(16);
                            } else if (this.playerLength == 16) {
                                this.setPlayerLength(25);
                            } else if (this.playerLength == 25) {
                                this.setPlayerLength(36);
                            } else if (this.playerLength == 36) {
                                this.setPlayerLength(64);
                            } else if (this.playerLength == 64) {
                                return;
                            }
                        }
                        this.terminals.push(this.nodedeviceid + "_" + this.nodechannelcode + "_" + this.playerindex);
                        var ui3 = playease.ui(this.playerindex);
                        ui3.play(url);

                        $("#player" + this.playerindex).find("div#souga").remove();

                        $("#player" + this.playerindex).find("div.pe-controlbar").append("<div id='souga' style='float: left;position: absolute; color:#FFFFFF;margin-top:-3.5%;font-size: 1vh;'>" + this.nodechannelname
                            + "</div>"
                        );
                        this.playerindex = this.playerindex + 1;
                    }

                } else {
                    if (this.isMobile()) {
                        if (this.playerindex >= 2) {
                            this.$message({
                                type: 'error',
                                message: "手机端最多支持二个同时播放！"
                            })
                            return;
                        }
                    }
                    if (this.playerLength == this.playerindex) {
                        if (this.playerLength == 1) {
                            this.setPlayerLength(2);
                        } else if (this.playerLength == 2) {
                            this.setPlayerLength(4);
                        } else if (this.playerLength == 4) {
                            this.setPlayerLength(9);
                        } else if (this.playerLength == 9) {
                            this.setPlayerLength(16);
                        } else if (this.playerLength == 16) {
                            this.setPlayerLength(25);
                        } else if (this.playerLength == 25) {
                            this.setPlayerLength(36);
                        } else if (this.playerLength == 36) {
                            this.setPlayerLength(64);
                        } else if (this.playerLength == 64) {
                            return;
                        }
                    }
                    this.terminals.push(this.nodedeviceid + "_" + this.nodechannelcode + "_" + this.playerindex);
                    var ui3 = playease.ui(this.playerindex);
                    ui3.play(url);

                    $("#player" + this.playerindex).find("div.pe-controlbar").append("<div id='souga' style='float: left;position: absolute; color:#FFFFFF;margin-top:-3.5%;font-size: 1vh;'>" + this.nodechannelname
                        + "</div>"
                    );
                    this.playerindex = this.playerindex + 1;
                }


                // alert($("#player" + this.playerindex).height());
                for (var i = 0; i < this.lastnum; i++) {
                    $("#player" + i).height($("#player" + this.playerindex).height());
                }

            },
            stopAll() {
                // this.showstop = false;
                var self = this;
                if (null != self.terminals && self.terminals.length > 0) {
                    $.each(self.terminals, function (i, j) {
                        // 发送停止播放的命令
                        var param = j.split("_");
                        // closePlay(param[0], param[1], 1, param[3]);
                        var ui3 = playease.ui(param[2]);
                        ui3.stop();
                        $("#player" + param[2]).find("div#souga").remove();
                        $.get(self.$store.state.baseUrl + "/playControl", {
                            deviceId: param[0],
                            channelId: param[1],
                            command: 0
                        }).then(ret => {

                        })
                        // $.ajax({
                        //     url: self.$store.state.baseUrl + "/playControl", // 请求路径
                        //     data: {
                        //         deviceId: param[0],
                        //         channelId: param[1],
                        //         command: 0
                        //     }, // 参数
                        //     type: "POST", // 请求类型
                        //     async: false,
                        //     contentType: 'application/json;charset=utf-8',
                        //     error: function (request, textStatus, errorThrown) { // 设置表单提交出错
                        //
                        //     },
                        //     success: function (data) {
                        //
                        //
                        //     }
                        // });
                    });
                }
                self.terminals = new Array();
                self.playerindex = 0;
            },
            treeNodeClick(data, node, c) {

                // if(this.isMobile()){
                //     if (typeof data.channelname != "undefined") {
                //         this.nodedeviceid = node.deviceId;
                //         this.nodechannelcode = node.channelcode;
                //         this.nodechannelname = node.channelname;
                //         this.playOne();
                //     }
                // }else{
                this.treeClickCount++;
                //单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件

                //计时器,计算300毫秒为单位,可自行修改
                this.timer = window.setTimeout(() => {
                    // if (this.treeClickCount == 1) {
                    //     //把次数归零
                    //     this.treeClickCount = 0;
                    //     //单击事件处理
                    //     this.console('单击事件,可在此处理对应逻辑')
                    //
                    // } else
                    if (this.treeClickCount > 1) {
                        //把次数归零
                        this.treeClickCount = 0;
                        if (typeof data.channelname != "undefined") {
                            this.nodedeviceid = node.deviceId;
                            this.nodechannelcode = node.channelcode;
                            this.nodechannelname = node.channelname;
                            this.playOne();
                        }
                    } else {
                        this.treeClickCount = 0;
                    }
                }, 300);
                // }
            }
            ,
            treeNodeRightClick(event, data, node, c) {
                if (typeof data.channelname == "undefined" && typeof data.devicename == "undefined") {
                    return;
                } else {
                    if (typeof data.channelname != "undefined") {
                        this.nodedeviceid = node.id;
                        this.nodechannelcode = node.channelcode;
                        this.nodechannelname = node.channelname;
                        this.popup = 2;
                    } else if (typeof data.devicename != "undefined") {
                        this.nodedeviceid = node.id;
                        this.channelcount = node.channelcount;
                        this.popup = 1;
                        if (node.channelcount == 0) {
                            return;
                        }
                    }

                    var new_event = new MouseEvent(event.type, event);
                    this.contextMenuTarget.dispatchEvent(new_event);
                }

            }
            ,
            treeLoad(data, resolve) {
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
                            sort: "id",
                            order: "asc",
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
                window.setTimeout(() => {
                    $("#dev-tree").find("div.el-tree-node__children").removeClass("el-tree-node__children");
                }, 300);
            }
            ,
            treeFilter(value, data) {
                if (!value) return true;
                return data.deptid.indexOf(value) !== -1 || data.deptname.indexOf(value) !== -1;
            }
            ,
            treeNodeRefresh(key) {
                let node = this.$refs['devTree'].getNode(key);
                if (!node) return;
                node.loaded = false;
                node.expand();
            }
            ,
            setPlayerLength(playerNum) {
                if (this.isMobile()) {
                    if (playerNum > 2) {
                        this.$message({
                            type: 'error',
                            message: "手机端最多支持二个同时播放！"
                        })
                        return;
                    }
                }

                if (playerNum == this.lastnum) {
                    return
                }

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
                    ui3.play("ws://www.car-eye.cn:4025/ws?port=10077&app=live&stream=34020000001310000001_GB28181");
                    ui3.stop();
                }
                for (var i = playerNum; i < 64; i++) {
                    $("#player" + i).css("display", "none");
                }
                this.lastnum = playerNum;
                this.playerLength = playerNum;

            }
            ,
            getDeviceList() {
                this.loading = true;
                $.get(this.$store.state.baseUrl + "/deviceInfo/list", {
                    q: this.q,
                    page: this.currentPage,
                    limit: this.pageSize,
                    online: this.online,
                    sort: this.sort,
                    order: this.order
                })
                    .then(ret => {
                        this.total = ret.count;
                        this.devices = ret.data;
                        // alert(JSON.stringify(ret.data));
                    })
                    .always(() => {
                        this.loading = false;
                    });
            }
            ,
            playerrestart(fileurl, playerid, val) {


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
            getQueryString(name, defVal = "") {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return defVal;
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

    .flow-tree {
        overflow: auto;

    }

    /*.el-tree-node__children{*/
    /*    overflow:visible !important;*/
    /*}*/
    .channeloffline {
        color: grey;
    }

    .channelonline {
        color: green;
    }

    ul {
        padding-left: 0;
        margin-left: 0;
    }

    .btnmenuli {
        float: left;
        list-style: none;
        padding-left: 0;
        padding-right: 1%;
    }


    .btnmenulist {
        width: 16px;
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

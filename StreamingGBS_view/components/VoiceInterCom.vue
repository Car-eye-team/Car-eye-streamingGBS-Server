<template>
    <FormDlg title="对讲" @hide="onHide" @show="onShow" ref="dlg" :disabled="errors.any()">
        <div class="row">
            <div class="col-lg-12 col-xs-12 col-md-12">
                <div class="col-lg-4 col-xs-4 col-md-4">
                    <div class="row">

                    </div>
                </div>
                <div class="col-lg-4 col-xs-4 col-md-4" align="center">
                    <div class="row">
                        <i class="fa fa-microphone-slash fa-6 mksize" aria-hidden="true" v-show="!isdj"></i>
                        <i class="fa fa-microphone fa-6 mksize" aria-hidden="true" v-show="isdj"></i>
                    </div>
                    <div class="row">
                        <button type="button" class="btn btn-xs btn-success" @click="startDj" v-show="!isdj">开启对讲
                        </button>
                        <button type="button" class="btn btn-xs btn-success" @click="shuntDownDj" v-show="isdj">关闭对讲
                            <!---->
                        </button>
                        <!--                        <button type="button" class="btn btn-xs btn-success" @click="startPlayVoice">连接socket-->
                        <!--                        </button>-->
                        <!--                        <button type="button" class="btn btn-xs btn-success" @click="sendMessage">发送消息-->
                        <!--                        </button>-->
                    </div>
                </div>
                <div class="col-lg-5 col-xs-5 col-md-4">
                    <div class="row">

                    </div>
                </div>
            </div>
            <div id="car-eye-playervoice" style="display: none;">
            </div>
        </div>
    </FormDlg>
</template>

<script>
    import $ from 'jquery'
    import FormDlg from 'components/FormDlg.vue'
    import {WEB_Socket} from '../assets/config/linkparam.js'
    import {Recorder} from '../assets/config/voiceconfig.js'
    import logot from "../assets/images/logo.png";

    export default {
        data() {
            return {
                isdj: false,
                deviceId: '',
                channelId: '',
                d_gb_id: '',
                record: null,
                socket: null,
                logoimgt: logot,
            }
        },
        components: {
            FormDlg
        },
        mounted() {
            $("#voiceintercom").find("div.modal-footer").remove();
            window.sendMessage = this.sendMessage;
            $("#car-eye-playervoice").html("");
            $("#car-eye-playervoice").append("<div class='row' id='player10089'></div>");
        },
        methods: {
            onHide() {
                this.$emit("hide");
            },
            onShow() {
                this.$emit("show");
            },
            async show(data) {
                this.channelId = data.channelId;
                this.deviceId = data.deviceId;
                this.d_gb_id= data.d_gb_id;
                this.$nextTick(() => {
                    this.$refs['dlg'].show();
                })
            },
            shuntDownDj() {
                var self = this;
                self.isdj = false;
                if (self.socket) {
                    self.socket.close();
                    self.record.stop();
                    var ui3 = playease.ui(10089);
                    ui3.stop();
                    $.get(self.$store.state.baseUrl + "/playControl", {
                        gb_id: self.channelId,
                        d_gb_id: self.d_gb_id,
                        command: 0
                    }).then(ret => {

                    })
                    console.log('关闭对讲以及WebSocket');
                }
            },
            startDj() {
                var self = this;
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                if (!navigator.getUserMedia) {
                    alert('浏览器不支持音频输入');
                } else {
                    navigator.getUserMedia({
                            audio: true
                        },
                        function (mediaStream) {
                            self.init(new Recorder(mediaStream));

                            self.isdj = true;
                            console.log('开始对讲');
                            self.useWebSocket();
                        },
                        function (error) {
                            console.log(error);
                            switch (error.message || error.name) {
                                case 'PERMISSION_DENIED':
                                case 'PermissionDeniedError':
                                    console.info('用户拒绝提供信息。');
                                    break;
                                case 'NOT_SUPPORTED_ERROR':
                                case 'NotSupportedError':
                                    console.info('浏览器不支持硬件设备。');
                                    break;
                                case 'MANDATORY_UNSATISFIED_ERROR':
                                case 'MandatoryUnsatisfiedError':
                                    console.info('无法发现指定的硬件设备。');
                                    break;
                                default:
                                    console.info('无法打开麦克风。异常信息:' + (error.code || error.name));
                                    break;
                            }
                        }
                    )
                }

            },
            async useWebSocket() {
                // alert(data);
                var self = this;
                if (typeof (WebSocket) == "undefined") {
                    console.log("您的浏览器不支持WebSocket");
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
                    self.socket.binaryType = 'arraybuffer'
                    //打开事件
                    self.socket.onopen = function () {
                        console.log("websocket已打开");
                        self.startPlayVoice();
                        self.record.start();

                    };
                    //获得消息事件
                    self.socket.onmessage = function (msg) {
                        var serverMsg = "收到服务端信息：" + msg.data;
                        console.log(serverMsg);
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
            async init(rec) {
                this.record = rec;
            },
            async sendMessage(data) {
                var self = this;
                var msg = '{"deviceId":"' + self.deviceId + '","channelId":"' + self.channelId + '","data":"' + data + '"}';
                self.socket.send(msg);
            },
            playerrestart(fileurl, playerid, val) {
              var container = document.getElementById(playerid);
              var ui = playease.ui(val);
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
                  name: 'auto',
                  mode: 'cors',        // cors, no-cors, same-origin
                  credentials: 'omit', // omit, include, same-origin
                },
                service: {
                  script: 'js/sw.js',
                  scope: 'js/',
                  enable: false,
                },
                plugins: [
                  {
                    kind: 'Poster',
                    file: this.logoimgt,
                    objectfit: 'contain', // fill, contain, cover, none, scale-down
                    visibility: true
                  },{
                    kind: 'Display',
                    layout: '',
                    ondouBleclick: 'fullscreen',
                    visibility: true
                  },{
                    kind: 'Controlbar',
                    layout: '[Slider:timebar=Preview]|[Button:play=播放][Button:pause=暂停][Button:reload=重新加载][Button:stop=停止][Label:time=00:00/00:00]||[Button:mute=静音][Button:unmute=取消静音][Slider:volumebar=80][Button:fullscreen=全屏][Button:exitfullscreen=退出全屏]',
                    autohide: false,
                    visibility: true,
                  },{
                    kind: 'ContextMenu',
                    visibility: false,
                    items: [{
                      mode: '',
                      icon: 'image/github.png',
                      text: 'studease',
                      shortcut: '',
                      handler: function () {}
                    }]
                  }
                ]
              });
              ui.removeEventListener('error');
              ui.addEventListener('error', console.error);
            },
            startPlayVoice() {
                var self = this;
                var url = "";
                $.ajax({
                    url: self.$store.state.baseUrl + "/play", // 请求路径
                    data: {
                        gb_id: self.channelId,
                        vedioType: 2
                    }, // 参数
                    type: "get", // 请求类型
                    async: false,
                    contentType: 'application/json;charset=utf-8',
                    error: function (request, textStatus, errorThrown) { // 设置表单提交出错

                    },
                    success: function (data) {
                        url = data;
                        // var ui3 = playease.ui(0);
                        // ui3.play(url);
                        self.playerrestart(url, "player10089", 10089);
                    }
                });
            }
        }
    }
</script>

<style>
    .djicon {
        width: 30%;
        height: 100%;
    }

    .mksize {
        font-size: 9vh;
    }
</style>
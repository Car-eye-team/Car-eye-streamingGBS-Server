<template>
<div class="qcontent">
    <div class="qcontent-header hidden-xs">服务器概览 <button type="button" class="btn btn-xs btn-default full-btn" @click.prevent="fullscreen" title="点击大屏展示"><i class="fa fa-arrows-alt"></i></button></div>
    <div class="container-fluid">
        <div class="col-xs-12 col-md-6">
            <div class="view-dashboard view-left">
                <div class="panel">
                    <div class="panel-body">
                        <div class="col-md-12 panel-title">
                            通道信息
                        </div>
                        <div class="col-xs-6 auth-view" style="text-align:center;">
                            <el-progress color="#337ab7" type="circle" :height="this.authViewHeight" :width="this.authViewHeight" :percentage="authData.DeviceTotal == 0 ? 0:  parseFloat((authData.DeviceOnline/authData.DeviceTotal*100).toFixed(2))"></el-progress>
                            <div class="auth-title">在线数:<span class="auth-num">{{authData.DeviceOnline}}</span><br>总设备:<span class="auth-num">{{authData.DeviceTotal}}</span></div>
                        </div>
                        <div class="col-xs-6 auth-view" style="text-align:center">
                            <el-progress color="#337ab7" type="circle" :height="this.authViewHeight" :width="this.authViewHeight" :percentage="authData.ChannelTotal == 0 ? 0:  parseFloat((authData.ChannelOnline/authData.ChannelTotal*100).toFixed(2))"></el-progress>
                            <div class="auth-title">在线数:<span class="auth-num">{{authData.ChannelOnline}}</span><br>总通道:<span class="auth-num">{{authData.ChannelTotal}}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="view-dashboard  view-left view-split">
                <div class="panel">
                    <div class="panel-body">
                        <ve-bar ref="storeChart" height="100%" :colors="chartColors" :data="storeData" :settings="storeSettings" legend-position="bottom" :title="{text:'存储使用', left: 'center'}"></ve-bar>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12 col-md-6">
            <div class="view-dashboard view-right view-split-m">
                <div class="panel">
                    <div class="panel-body">
                        <ve-line ref="cpuChart" height="100%" :colors="chartColors" :data="cpuData" :settings="memSettings" :legend-visible="false" :title="{text:'CPU使用', left: 'center'}"></ve-line>
                    </div>
                </div>
            </div>
            <div class="view-dashboard view-right view-split">
                <div class="panel">
                    <div class="panel-body">
                        <ve-line ref="memChart" height="100%" :colors="chartColors" :data="memData" :settings="memSettings" :legend-visible="false" :title="{text:'内存使用', left: 'center'}"></ve-line>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import {
    mapState
} from "vuex";

import fullscreen from 'vue-fullscreen'
Vue.use(fullscreen);

export default {
    computed: {
        ...mapState(["serverInfo", "userInfo"])
    },
    components: {},
    data() {
        return {
            chartColors: ["#337ab7", "#7FFFD4"],
            pageHeight: 0,
            protocol: location.protocol,
            authViewHeight: 80,
            timer: 0,
            vods: {},
            duration: 30,
            memData: {
                columns: ["time", "use"],
                rows: [
                    {'time':'2020-09-03 00:00','use':'0.1'},
                    {'time':'2020-09-03 06:00','use':'0.05'},
                    {'time':'2020-09-03 12:00','use':'0.5'},
                    {'time':'2020-09-03 18:00','use':'0.2'}
                ]
            },
            memSettings: {
                area: true,
                xAxisType: "time",
                yAxisType: ["percent"],
                min: [0],
                max: [1],
                labelMap: {
                    use: '使用'
                },
            },
            cpuData: {
                columns: ["time", "use"],
                rows: [
                    {'time':'2020-09-03 00:00','use':'0.1'},
                    {'time':'2020-09-03 06:00','use':'0.5'},
                    {'time':'2020-09-03 12:00','use':'0.2'},
                    {'time':'2020-09-03 18:00','use':'0.3'}
                    ]
            },
            vodData: {
                columns: ["type", "count"],
                rows: []
            },
            vodSettings: {
                label: {
                    show: true,
                    formatter: "{b}: {c}"
                },
                roseType: "area" //'radius'
            },
            storeData: {
                columns: ["Name", "Used", "FreeSpace"],
                rows: [
                    {'Name': 'server_1', 'Used': '100', 'FreeSpace': '300'},
                    {'Name': 'server_2', 'Used': '30', 'FreeSpace': '330'},
                    {'Name': 'server_3', 'Used': '280', 'FreeSpace': '120'}
                ]
            },
            storeSettings: {
                dimension: ["Name"],
                metrics: ["Used", "FreeSpace"],
                stack: {
                    store: ["Used", "FreeSpace"]
                },
                legendName: {
                    Used: '已使用(G)',
                    FreeSpace: '剩余(G)'
                },
                labelMap: {
                    Used: '已使用(G)',
                    FreeSpace: '剩余(G)'
                }
            },
            authData: {
                ChannelOnline: 0,
                ChannelTotal: 100,
                DeviceOnline: 0,
                DeviceTotal: 100,
            },
            bandwidthData: {
                columns: ["time", "use"],
                rows: []
            },
            bandwidthSettings: {
                area: true,
                xAxisType: "time",
                labelMap: {
                    use: "使用(Mbps)"
                }
            }
        };
    },
    mounted() {
         this.top();
         this.timer1 = setInterval(() => {
             this.top();
         }, 2000);
        this.store();
         this.timer2 = setInterval(() => {
             this.store();
        }, 5000);
        $(".qcontent").css("height","calc(100% + 20px)");
        $(document).on('expanded.pushMenu', this.resizeCharts);
        $(document).on('collapsed.pushMenu', this.resizeCharts);
    },
    beforeDestroy() {
        if (this.timer1) {
            clearInterval(this.timer1);
            this.timer1 = 0;
        }
        if (this.timer2) {
            clearInterval(this.timer2);
            this.timer2 = 0;
        }
        $(document).off('expanded.pushMenu', this.resizeCharts);
        $(document).off('collapsed.pushMenu', this.resizeCharts);
    },
    methods: {
        fullscreen() {
            this.$fullscreen.enter(this.$el.querySelector(".container-fluid"), {
                wrap: false
            })
        },
        top() {
            $.get(this.$store.state.baseUrl + "/dashboard/top").then(result => {
                var data = result.data;
                this.memData.rows = data.memData;
                this.cpuData.rows = data.cpuData;
            });
        },
        store() {
            $.get(this.$store.state.baseUrl + "/dashboard/store").then(result => {
                var data = result.data;
                this.storeData.rows = data;
            });

            $.get(this.$store.state.baseUrl + "/dashboard/auth").then(result => {
                var data = result.data;
                this.authData =  data;
            });
        },
        resizeCharts() {
            this.$refs["storeChart"].resize();
            this.$refs["cpuChart"].resize();
            this.$refs["memChart"].resize();
        }
    }
};
</script>

<style lang="less" scoped>
.content{
    padding: 0;
}
.qcontent {
    margin: -16px -15px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.qcontent .fullscreen {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #ecf0f5;
}

.qcontent .full-btn {
    margin-left: 2px;
    margin-top: -3px;
}

.qcontent .col-md-6 {
    padding-left: 0px;
    padding-right: 0px;
    height: 100%;
    min-height: 500px;
}

.qcontent .panel {
    height: 100%;
}

.qcontent .panel-body {
    height: 100%;
    box-sizing: border-box;
}

.qcontent .panel-title {
    text-align: center;
    font-weight: bold;
    font-size: 18px;
}

.qcontent .container-fluid {flex-grow: 1;
    min-height:500px;
    box-sizing: border-box;
    overflow: auto;
    width: 100%;
    padding: 10px 10px 0 10px;
}

.view-dashboard {
    height: 50%;
}

.view-left {
    margin-right: 5px;
}

.view-right {
    margin-left: 5px;
}

.view-split {
    margin-top: 10px;
}

.auth-vlive,
.auth-live {
    margin-top: 6%;
}

.auth-num {
    margin-top: 20%;
    font-size: 14px;
    font-weight: bold;
    color: #337ab7;
}

.auth-view {
    min-height: 200px;
    height: 95%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.auth-title {
    font-size: 12px;
    color: #1d3b55;
}

.auth-promt-div {
    margin-top: 10%;
}

@screen-md-min: 992px;
@media (max-width: @screen-md-min) {
    .col-md-6 {
        width: 100%;
    }
    .container-fluid {
        height: 100% !important;
    }
    
    .container-fluid > div:last-child {
        margin-top: 10px;
    }

    .view-left {
        margin-right: 0;
    }

    .view-right {
        margin-left: 0;
    }

    .view-split-m,
    .view-split {
        margin-top: 10px;
    }

    .auth-vlive,
    .auth-live {
        margin-top: 0%;
    }

    .auth-num {
        margin-top: 20%;
        font-size: 14px;
        font-weight: bold;
        color: #337ab7;
    }
}
</style>

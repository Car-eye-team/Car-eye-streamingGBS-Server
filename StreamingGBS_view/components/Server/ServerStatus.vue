<template>
<div class="qcontent">
    <div class="qcontent-header">
        服务器概览 <button type="button" class="btn btn-xs btn-default full-btn" @click.prevent="fullscreen" title="点击大屏展示"><i class="fa fa-arrows-alt"></i></button>
        <select v-if="servers && servers.length" class="form-control server-selector" v-model="activeServerId">
            <option v-for="server in servers" :key="server.id" :value="server.id">
                {{ server.name ? server.name + '(' + server.publicIp + ')' : server.publicIp }}
            </option>
        </select>
    </div>
    <div class="container-fluid" ref="containerFluid">
        <div class="col-xs-12 col-md-4" style="padding-right: 0;padding-left: 10px;">
            <div class="view-dashboard">
                <div class="panel">
                    <div class="panel-body">
                        <div class="col-md-12 panel-title">
                            通道信息
                        </div>
                        <div class="col-xs-6 auth-view" style="text-align:center;">
                            <el-progress 
                                color="#337ab7" 
                                type="circle" 
                                :height="80" 
                                :width="80" 
                                :percentage="authData.DeviceTotal == 0 ? 0: +(authData.DeviceOnline / authData.DeviceTotal * 100).toFixed(2)"
                            />
                            <div class="auth-title">
                                在线数：<span class="auth-num">{{authData.DeviceOnline}}</span>
                                <br>
                                总设备：<span class="auth-num">{{authData.DeviceTotal}}</span>
                            </div>
                        </div>
                        <div class="col-xs-6 auth-view" style="text-align:center">
                            <el-progress
                                color="#337ab7"
                                type="circle"
                                :height="80"
                                :width="80" 
                                :percentage="authData.ChannelTotal == 0 ? 0: +(authData.ChannelOnline / authData.ChannelTotal * 100).toFixed(2)"
                            />
                            <div class="auth-title">
                                在线数：<span class="auth-num">{{authData.ChannelOnline}}</span>
                                <br>
                                总通道：<span class="auth-num">{{authData.ChannelTotal}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="view-dashboard" data-chart="disk">
                <div class="panel">
                    <div class="panel-body">
                        <div class="chart-box" ref="diskChartDOM"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12 col-md-4">
            <div class="view-dashboard" data-chart="cpu">
                <div class="panel">
                    <div class="panel-body">
                        <div class="chart-box" ref="cpuChartDOM"></div>
                    </div>
                </div>
            </div>
            <div class="view-dashboard" data-chart="bandwidth">
                <div class="panel">
                    <div class="panel-body">
                        <div class="chart-box" ref="bandwidthChartDOM"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12 col-md-4" style="padding-left: 0;padding-right: 10px;">
            <div class="view-dashboard" data-chart="memory">
                <div class="panel">
                    <div class="panel-body">
                        <div class="chart-box" ref="memoryChartDOM"></div>
                    </div>
                </div>
            </div>
            <div class="view-dashboard" data-chart="flow">
                <div class="panel">
                    <div class="panel-body">
                        <div class="chart-box" ref="flowChartDOM"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import * as echarts from '../../libs/echarts'
import {
    memoryOption,
    cpuOption,
    diskOption,
    bandwidthOption,
    flowOption,
    getSuitableUnit
} from './chart-options'
import { bind, clear } from 'size-sensor'


export default {
    data() {
        return {
            activeServerId: null,
            servers: [],
            authData: {
                ChannelOnline: 0,
                ChannelTotal: 0,
                DeviceOnline: 0,
                DeviceTotal: 0
            }
        };
    },
    watch: {
        activeServerId(n) {
            if (n) {
                this.initCharts()
            }
        }
    },
    methods: {
        fullscreen() {
            this.$fullscreen.enter(this.$refs.containerFluid, { wrap: false })
        },
        async loadChannelChart() {
            try {
                const ajax = $.get(this.$store.state.baseUrl + '/dashboard/auth')
                this.putTask(ajax)
                const res = await ajax
                this.authData.ChannelOnline = res.data && res.data.ChannelOnline || 0
                this.authData.ChannelTotal = res.data && res.data.ChannelTotal || 0
                this.authData.DeviceOnline = res.data && res.data.DeviceOnline || 0
                this.authData.DeviceTotal = res.data && res.data.DeviceTotal || 0
            } catch (e) {
                if (!(e instanceof Error)) {
                    return
                }
                console.error('failed to fetch channel data', e)
                this.$message.error({
                    message: '获取通道信息失败',
                    center: true
                })
            }
        },
        async fetchServerList() {
            try {
                const ajax = $.get(this.$store.state.baseUrl + '/server/all', { enabled: 1 })
                this.putTask(ajax)
                const res = await ajax
                this.servers = res.data || []
                const queryServerId = this.$route.query.id
                this.activeServerId = queryServerId
                    && !this.activeServerId
                    && this.servers.findIndex(s => s.id === queryServerId) > -1 
                        ? queryServerId
                        : this.servers[0] && this.servers[0].id
            } catch (e) {
                if (!(e instanceof Error)) {
                    return
                }
                console.error('failed to fetch server list', e)
                this.$message.error({
                    message: '获取服务器信息失败',
                    center: true
                })
            }
        },
        async loadMemoryCpuChart() {
            try {
                const ajax = $.get(this.$store.state.baseUrl + '/server/status/top', { serverId: this.activeServerId })
                this.putTask(ajax)
                const res = await ajax
                if (!res.data) {
                    this.$message.error({
                        message: '获取CPU/内存信息失败',
                        center: true
                    })
                    return console.error('failed to load memory and cpu chart', res)
                }

                res.data.cpu.sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
                res.data.memory.sort((a, b) => Date.parse(a.time) - Date.parse(b.time))

                const cpuTime = res.data.cpu.map(t => t.time)
                const cpuData = res.data.cpu.map(t => t.used)
                const memoryTime = res.data.memory.map(t => t.time)
                const memoryData = res.data.memory.map(t => t.used)

                let cpuUpdateOption = {
                    title: {
                        subtext: cpuData.length 
                            ? cpuData[cpuData.length - 1].toFixed(2) + ' %'
                            : ''
                    },
                    xAxis: {
                        data: cpuTime
                    },
                    yAxis: {
                        show: !!cpuData.length
                    },
                    series: {
                        data: cpuData
                    }
                }
                
                if (!this._charts.cpu || this._charts.cpu.isDisposed()) {
                    const dom = this.$refs.cpuChartDOM
                    if (!dom) {
                        return
                    }
                    this._charts.cpu = echarts.init(dom)
                    cpuUpdateOption = echarts.util.merge(
                        echarts.util.clone(cpuOption),
                        {
                            ...cpuUpdateOption,
                            animationDuration: 0,
                            animationDurationUpdate: 2e3
                        },
                        true
                    )
                }
                this._charts.cpu.setOption(cpuUpdateOption)

                let memoryUpdateOption = {
                    title: {
                        subtext: memoryData.length 
                            ? memoryData[memoryData.length - 1].toFixed(2) + ' %'
                            : ''
                    },
                    xAxis: {
                        data: memoryTime
                    },
                    yAxis: {
                        show: !!memoryData.length
                    },
                    series: {
                        data: memoryData
                    }
                }
                
                if (!this._charts.memory || this._charts.memory.isDisposed()) {
                    const dom = this.$refs.memoryChartDOM
                    if (!dom) {
                        return
                    }
                    this._charts.memory = echarts.init(dom)
                    memoryUpdateOption = echarts.util.merge(
                        echarts.util.clone(memoryOption),
                        {
                            ...memoryUpdateOption,
                            animationDuration: 0,
                            animationDurationUpdate: 2e3
                        },
                        true
                    )
                }
                this._charts.memory.setOption(memoryUpdateOption)
                
            } catch (e) {
                if (!(e instanceof Error)) {
                    return
                }
                console.error('failed to load memory and cpu chart', e)
                this.$message.error({
                    message: '获取CPU/内存信息失败',
                    center: true
                })
            }
        },
        async loadDiskChart() {
            try {
                const ajax = $.get(this.$store.state.baseUrl + '/server/status/disk', { serverId: this.activeServerId })
                this.putTask(ajax)
                const res = await ajax
                if (!res.data) {
                    this.$message.error({
                        message: '获取存储使用信息失败',
                        center: true
                    })
                    return console.error('failed to load disk chart', res)
                }

                const ratio = 1024 * 1024 * 1.0
                const yAxisData = []
                const seriesData0 = []
                const seriesData1 = []

                Object.keys(res.data).forEach(key => {
                    const value = res.data[key]
                    yAxisData.unshift(key)
                    seriesData0.unshift(
                        (value.used / ratio).toFixed(2).toString().replace('.00', '')
                    )
                    seriesData1.unshift(
                        (value.available / ratio).toFixed(2).toString().replace('.00', '')
                    )
                })

                let diskUpdateOption = {
                    yAxis: {
                        data: yAxisData
                    },
                    legend: {
                        show: yAxisData.length > 0
                    },
                    series: [
                        { data: seriesData0 },
                        { data: seriesData1 }
                    ]
                }
                
                if (!this._charts.disk || this._charts.disk.isDisposed()) {
                    const dom = this.$refs.diskChartDOM
                    if (!dom) {
                        return
                    }
                    this._charts.disk = echarts.init(dom)
                    diskUpdateOption = echarts.util.clone(diskOption)
                    diskUpdateOption.yAxis.data = yAxisData
                    diskUpdateOption.legend.show = diskUpdateOption.legend.show
                    diskUpdateOption.series[0].data = seriesData0
                    diskUpdateOption.series[1].data = seriesData1
                }

                this._charts.disk.setOption(diskUpdateOption)
            } catch (e) {
                if (!(e instanceof Error)) {
                    return
                }
                console.error('failed to load disk chart', e)
                this.$message.error({
                    message: '获取存储使用信息失败',
                    center: true
                })
            }
        },
        async loadBandwidthChart() {
            try {
                const ajax = $.get(this.$store.state.baseUrl + '/server/status/bandwidth', { serverId: this.activeServerId })
                this.putTask(ajax)
                const res = await ajax
                if (!res.data) {
                    this.$message.error({
                        message: '获取带宽信息失败',
                        center: true
                    })
                    return console.error('failed to load bandwidth chart', res)
                }

                res.data.forEach(t => {
                    if (t.down < 0) {
                        t.down = 0
                    }
                })
                res.data.sort((a, b) => Date.parse(a.time) - Date.parse(b.time))

                const latestData = res.data[res.data.length - 1]

                let bandwidthUpdateOption = {
                    title: {
                        subtext: latestData 
                            ? latestData.down.toFixed(3) + ' ' + latestData.unit
                            : ''
                    },
                    dataset: {
                        source: res.data
                    }
                }

                if (!this._charts.bandwidth || this._charts.bandwidth.isDisposed()) {
                    const dom = this.$refs.bandwidthChartDOM
                    if (!dom) {
                        return
                    }
                    this._charts.bandwidth = echarts.init(dom)
                    const option = echarts.util.clone(bandwidthOption)
                    option.title.subtext = bandwidthUpdateOption.title.subtext
                    option.dataset.source = bandwidthUpdateOption.dataset.source
                    bandwidthUpdateOption = option
                }

                this._charts.bandwidth.setOption(bandwidthUpdateOption)
            } catch (e) {
                if (!(e instanceof Error)) {
                    return
                }
                console.error('failed to load bandwidth chart', e)
                this.$message.error({
                    message: '获取带宽信息失败',
                    center: true
                })
            }
        },
        async loadFlowChart() {
            try {
                const ajax = $.get(this.$store.state.baseUrl + '/server/status/flow', { serverId: this.activeServerId })
                this.putTask(ajax)
                const res = await ajax
                if (!res.data) {
                    this.$message.error({
                        message: '获取流量信息失败',
                        center: true
                    })
                    return console.error('failed to load flow chart', res)
                }

                let flowUpdateOption = {
                    title: {
                        subtext: res.data.upSpeed != null
                            ? '{bold|↑} '
                                + getSuitableUnit(res.data.upSpeed)
                                + '  {bold|↓} '
                                + getSuitableUnit(res.data.downSpeed)
                            : ''
                    },
                    legend: {
                        show: res.data.upSpeed != null
                    },
                    xAxis: {
                        data: ['截至 ' + res.data.time]
                    },
                    series: [
                        {
                            data: res.data.up != null
                                ? [(res.data.up / 1024.0 / 1024.0 / 1024.0).toFixed(2)]
                                : []
                        },
                        {
                            data: res.data.down != null
                                ? [(res.data.down / 1024.0 / 1024.0 / 1024.0).toFixed(2)]
                                : []
                        }
                    ]
                }

                if (!this._charts.flow || this._charts.flow .isDisposed()) {
                    const dom = this.$refs.flowChartDOM
                    if (!dom) {
                        return
                    }
                    this._charts.flow  = echarts.init(dom)

                    const option = echarts.util.merge(
                        echarts.util.clone(flowOption),
                        {
                            title: flowUpdateOption.title,
                            xAxis: flowUpdateOption.xAxis,
                            legend: flowUpdateOption.legend
                        },
                        true
                    )
                    option.series[0].data = flowUpdateOption.series[0].data
                    option.series[1].data = flowUpdateOption.series[1].data
                    flowUpdateOption = option
                }

                this._charts.flow.setOption(flowUpdateOption)
            } catch (e) {
                if (!(e instanceof Error)) {
                    return
                }
                console.error('failed to load flow chart', e)
                this.$message.error({
                    message: '获取流量信息失败',
                    center: true
                })
            }
        },
        clearCharts(entire) {
            if (this._timers) {
                this._timers.forEach(t => clearInterval(t))
                entire ? delete this._timers : (this._timers.length = 0)
            }

            if (this._tasks) {
                this._tasks.forEach(t => t.abort())
                entire ? delete this._tasks : (this._tasks.length = 0)
            }

            if (this._charts) {
                Object.keys(this._charts).forEach(k => {
                    const chart = this._charts[k]
                    chart.isDisposed() || chart.dispose()
                    entire || delete this._charts[k]
                })
                entire && delete this._charts
            }
        },
        initCharts() {
            this.clearCharts()

            this._charts = this._charts || {}

            this.loadChannelChart(),
            this.loadMemoryCpuChart(),
            this.loadDiskChart(),
            this.loadBandwidthChart(),
            this.loadFlowChart()

            this._timers = this._timers || []

            this._timers.push(setInterval(() => this.loadChannelChart(), 1e4))
            this._timers.push(setInterval(() => this.loadMemoryCpuChart(), 2e3))
            this._timers.push(setInterval(() => this.loadDiskChart(), 1e4))
            this._timers.push(setInterval(() => this.loadBandwidthChart(), 3e3))
            this._timers.push(setInterval(() => this.loadFlowChart(), 5e3))
        },
        dispose() {
            this.clearCharts(true)

            // clear resize sensor
            this.$el
                .querySelectorAll('.view-dashboard')
                .forEach(container => clear(container))
        },
        putTask(ajax) {
            if (this._tasks) {
                for (let i = this._tasks.length - 1, task; i > -1; i--) {
                    task = this._tasks[i]
                    if (task.readyState === 4) {
                        this._tasks.splice(i, 1)
                    }
                }
            } else {
                this._tasks = []
            }
            if (ajax.readyState !== 4) {
                this._tasks.push(ajax)
            }
        }
    },
    mounted() {
        // resize sensor
        this.$el
            .querySelectorAll('.view-dashboard')
            .forEach(container => {
                bind(container, e => {
                    const chartName = e.getAttribute('data-chart')
                    const chart = chartName && this._charts && this._charts[chartName]
                    chart && !chart.isDisposed() && chart.resize()
                })
            })

        // 获取服务器列表
        this.fetchServerList()
    },
    beforeDestroy() {
        this.dispose()
        this.servers = null
        this.authData = null
        this.activeServerId = null
    }
};
</script>

<style scoped>
.content{
    padding: 0;
}
.qcontent {
    margin: -16px -15px;
    height: calc(100% + 30px);
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

.qcontent .col-xs-12 {
    height: 100%;
    min-height: 450px;
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

.qcontent .container-fluid {
    flex-grow: 1;
    box-sizing: border-box;
    overflow: auto;
    width: 100%;
    padding: 20px 10px 20px 10px;
    overflow-x: hidden;
}

.view-dashboard {
    height: 50%;
}

.col-xs-12 .view-dashboard:last-child {
    padding-top: 20px;
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
    height: 95%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.auth-title {
    margin-top: 10px;
    font-size: 12px;
    color: #1d3b55;
}

.auth-promt-div {
    margin-top: 10%;
}

.server-selector {
    display: inline-block;
    width: 180px;
    margin-left: 10px;
    padding: 0;
    height: 25px;
    font-size: 12px;
}

.chart-box {
    height: 100%;
}

@media (max-width: 992px) {

    .container-fluid {
        height: 100% !important;
        padding-bottom: 20px!important;
        padding-right: 5px!important;
        margin-bottom: 20px;
    }
    
    .container-fluid > .col-xs-12 {
        padding-top: 25px;
        padding-left: 10px!important;
        padding-right: 10px!important;
    }

    .container-fluid > .col-xs-12:first-child {
        padding-top: 0;
    }

    .container-fluid > .col-xs-12:last-child {
        margin-top: 25px;
    }

    .qcontent .col-xs-12 {
        min-height: 550px!important;
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

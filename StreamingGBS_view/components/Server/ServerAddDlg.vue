<template>
    <FormDlg title="添加服务器" ref="dlg"
        @hide="onHide"
        @show="onShow"
        @submit="onSubmit"
        :disabled="errors.any()">
        <div class="form-group">
            <label class="col-sm-4 control-label">服务器状态</label>
            <div class="col-sm-7">
                <el-switch style="margin-top: 7px"
                    v-model="form.enabled"
                    :active-text="form.enabled ? '启用' : '禁用'"
                />
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('name')}">
            <label for="input-name" class="col-sm-4 control-label">服务器名称</label>
            <div class="col-sm-7">
                <input 
                    type="text"
                    class="form-control"
                    id="input-name" 
                    name="name"
                    v-model.trim="form.name"
                    data-vv-as="服务器名称"
                    maxlength="50"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('publicIp')}">
            <label for="input-publicip" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                公网IP
            </label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-publicip"
                    name="publicIp"
                    v-model.trim="form.publicIp"
                    data-vv-as="公网IP"
                    v-validate="'required'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('localIp')}">
            <label for="input-localip" class="col-sm-4 control-label">内网IP</label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-localip"
                    name="localIp"
                    v-model.trim="form.localIp"
                    data-vv-as="内网IP"
                    v-validate="'ip'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('httpPort')}">
            <label for="input-httpport" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                HTTP播放端口
            </label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-httpport"
                    name="httpPort"
                    v-model.number="form.httpPort"
                    data-vv-as="HTTP播放端口"
                    min="0"
                    max="65535"
                    v-validate="'required|numeric|between:0,65535'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('rtmpPort')}">
            <label for="input-rtmpport" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                RTMP播放端口
            </label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-rtmpport"
                    name="rtmpPort"
                    v-model.number="form.rtmpPort"
                    data-vv-as="RTMP播放端口"
                    v-validate="'required|numeric|between:0,65535'"
                    min="0"
                    max="65535"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('stateCheckIp')}">
            <label for="input-statecheckip" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                状态检测IP
            </label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-statecheckip"
                    name="stateCheckIp"
                    v-model.trim="form.stateCheckIp"
                    data-vv-as="状态检测IP"
                    v-validate="'required|ip'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('stateCheckPort')}">
            <label for="input-statecheckport" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                状态检测端口
            </label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-statecheckport"
                    name="stateCheckPort"
                    v-model.number="form.stateCheckPort"
                    data-vv-as="状态检测端口"
                    v-validate="'required|numeric|between:0,65535'"
                    min="0"
                    max="65535"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('voiceTalkIp')}">
            <label for="input-voicetalkip" class="col-sm-4 control-label">语音对讲IP</label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-voicetalkip"
                    name="voiceTalkIp"
                    v-model.trim="form.voiceTalkIp"
                    data-vv-as="语音对讲IP"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('voiceTalkPort')}">
            <label for="input-voicetalkport" class="col-sm-4 control-label">语音对讲端口</label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-voicetalkport"
                    name="voiceTalkPort"
                    v-model.number="form.voiceTalkPort"
                    data-vv-as="语音对讲端口"
                    min="0"
                    max="65535"
                    v-validate="'numeric|between:0,65535'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('fileServerIp')}">
            <label for="input-fileserverip" class="col-sm-4 control-label">文件服务器IP</label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-fileserverip"
                    name="fileServerIp"
                    v-model.trim="form.fileServerIp"
                    data-vv-as="文件服务器IP"
                    v-validate="'ip'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('fileServerPort')}">
            <label for="input-fileserverport" class="col-sm-4 control-label">文件服务器端口</label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-fileserverport"
                    name="fileServerPort"
                    v-model.number="form.fileServerPort"
                    data-vv-as="文件服务器端口"
                    min="0"
                    max="65535"
                    v-validate="'numeric|between:0,65535'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('maxBandwidth')}">
            <label for="input-maxbandwidth" class="col-sm-4 control-label">最大带宽(Mbps)</label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-maxbandwidth"
                    name="maxBandwidth"
                    v-model.number="form.maxBandwidth"
                    data-vv-as="最大带宽"
                    min="0"
                    v-validate="'numeric|min_value:0'"
                >
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">录像</label>
            <div class="col-sm-7">
                <el-switch style="margin-top: 7px"
                    v-model="form.record"
                    :active-text="form.record ? '开启' : '关闭'"
                />
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('recordFileDir')}">
            <label for="input-recordfiledir" class="col-sm-4 control-label">录像文件存放目录</label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-recordfiledir"
                    name="recordFileDir"
                    v-model.trim="form.recordFileDir"
                    data-vv-as="录像文件存放目录"
                >
            </div>
        </div>
    </FormDlg>
</template>

<script>
import FormDlg from 'components/FormDlg.vue'
import $ from 'jquery'

export default {
    data() {
        return {
            form: this.defForm()
        }
    },
    components: {
        FormDlg
    },
    methods: {
        defForm() {
            return {
                name: '',
                publicIp: '',
                localIp: '',
                httpPort: null,
                rtmpPort: null,
                stateCheckIp: '',
                stateCheckPort: null,
                record: false,
                recordFileDir: '',
                maxBandwidth: null,
                fileServerIp: '',
                fileServerPort: null,
                enabled: true,
                voiceTalkIp: '',
                voiceTalkPort: null
            }
        },
        onHide() {
            this.form = this.defForm()
            this.$emit('hide')
        },
        onShow() {
            this.errors.clear()
            this.$emit('show')
        },
        async onSubmit() {
            if (!await this.$validator.validateAll()) {
                const e = this.errors.items[0]
                this.$message.error(e.msg)
                $(`[name=${e.field}]`).focus()
                return
            }
            const data = {}
            Object.keys(this.form).forEach(key => {
                let v = this.form[key]
                if (v !== '' && v != null) {
                    data[key] = v
                }
            })
            $.ajax({
                url: this.$store.state.baseUrl + '/server/add',
                method: 'post',
                data: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json;charset=utf-8'
                }
            })
            .then(res => {
                if (res.data){
                    this.$refs.dlg.hide()
                    this.$emit('submit')
                    this.$message.success({
                        message: '已添加',
                        center: true
                    })
                } else {
                    this.$message.error({
                        message: '添加失败',
                        center: true
                    })
                }
            })
            .catch(() => {
                this.$message.error({
                    message: '添加失败，请稍后再试！',
                    center: true
                })
            })
        },
        show(data) {
            this.errors.clear()
            this.$nextTick(() => this.$refs.dlg.show())
        }
    }
}
</script>

<template>
    <FormDlg title="编辑服务器" ref="dlg"
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
        <div class="form-group" :class="{'has-error': errors.has('name0')}">
            <label for="input-name-edit" class="col-sm-4 control-label">服务器名称</label>
            <div class="col-sm-7">
                <input 
                    type="text"
                    class="form-control"
                    id="input-name-edit" 
                    name="name0"
                    v-model.trim="form.name"
                    data-vv-as="服务器名称"
                    maxlength="50"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('publicIp0')}">
            <label for="input-publicip-edit" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                公网IP
            </label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-publicip-edit"
                    name="publicIp0"
                    v-model.trim="form.publicIp"
                    data-vv-as="公网IP"
                    v-validate="'required'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('localIp0')}">
            <label for="input-localip-edit" class="col-sm-4 control-label">内网IP</label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-localip-edit"
                    name="localIp0"
                    v-model.trim="form.localIp"
                    data-vv-as="内网IP"
                    v-validate="'ip'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('httpPort0')}">
            <label for="input-httpport-edit" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                HTTP播放端口
            </label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-httpport-edit"
                    name="httpPort0"
                    v-model.number="form.httpPort"
                    data-vv-as="HTTP播放端口"
                    min="0"
                    max="65535"
                    v-validate="'required|numeric|between:0,65535'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('rtmpPort0')}">
            <label for="input-rtmpport-edit" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                RTMP播放端口
            </label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-rtmpport-edit"
                    name="rtmpPort0"
                    v-model.number="form.rtmpPort"
                    data-vv-as="RTMP播放端口"
                    v-validate="'required|numeric|between:0,65535'"
                    min="0"
                    max="65535"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('stateCheckIp0')}">
            <label for="input-statecheckip-edit" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                状态检测IP
            </label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-statecheckip-edit"
                    name="stateCheckIp0"
                    v-model.trim="form.stateCheckIp"
                    data-vv-as="状态检测IP"
                    v-validate="'required|ip'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('stateCheckPort0')}">
            <label for="input-statecheckport-edit" class="col-sm-4 control-label">
                <span class="text-red">*</span>
                状态检测端口
            </label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-statecheckport-edit"
                    name="stateCheckPort0"
                    v-model.number="form.stateCheckPort"
                    data-vv-as="状态检测端口"
                    v-validate="'required|numeric|between:0,65535'"
                    min="0"
                    max="65535"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('voiceTalkIp0')}">
            <label for="input-voicetalkip-edit" class="col-sm-4 control-label">语音对讲IP</label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-voicetalkip-edit"
                    name="voiceTalkIp0"
                    v-model.trim="form.voiceTalkIp"
                    data-vv-as="语音对讲IP"

                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('voiceTalkPort0')}">
            <label for="input-voicetalkport-edit" class="col-sm-4 control-label">语音对讲端口</label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-voicetalkport-edit"
                    name="voiceTalkPort0"
                    v-model.number="form.voiceTalkPort"
                    data-vv-as="语音对讲端口"
                    min="0"
                    max="65535"
                    v-validate="'numeric|between:0,65535'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('fileServerIp0')}">
            <label for="input-fileserverip-edit" class="col-sm-4 control-label">文件服务器IP</label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-fileserverip-edit"
                    name="fileServerIp0"
                    v-model.trim="form.fileServerIp"
                    data-vv-as="文件服务器IP"
                    v-validate="'ip'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('fileServerPort0')}">
            <label for="input-fileserverport-edit" class="col-sm-4 control-label">文件服务器端口</label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-fileserverport-edit"
                    name="fileServerPort0"
                    v-model.number="form.fileServerPort"
                    data-vv-as="文件服务器端口"
                    min="0"
                    max="65535"
                    v-validate="'numeric|between:0,65535'"
                >
            </div>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('maxBandwidth0')}">
            <label for="input-maxbandwidth-edit" class="col-sm-4 control-label">最大带宽(Mbps)</label>
            <div class="col-sm-7">
                <input
                    type="number"
                    class="form-control" 
                    id="input-maxbandwidth-edit"
                    name="maxBandwidth0"
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
        <div class="form-group" :class="{'has-error': errors.has('recordFileDir0')}">
            <label for="input-recordfiledir-edit" class="col-sm-4 control-label">录像文件存放目录</label>
            <div class="col-sm-7">
                <input
                    type="text"
                    class="form-control" 
                    id="input-recordfiledir-edit"
                    name="recordFileDir0"
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
                id: '',
                name: '',
                publicIp: '',
                localIp: '',
                httpPort: '',
                rtmpPort: '',
                stateCheckIp: '',
                stateCheckPort: '',
                record: '',
                recordFileDir: '',
                maxBandwidth: '',
                fileServerIp: '',
                fileServerPort: '',
                enabled: '',
                voiceTalkIp: '',
                voiceTalkPort: ''
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
                $(`[name=${e.field}0]`).focus()
                return
            }
            $.ajax({
                url: this.$store.state.baseUrl + '/server/update',
                method: 'put',
                data: JSON.stringify(this.form),
                headers: {
                    'content-type': 'application/json;charset=utf-8'
                }
            })
            .then(res => {
                if (res.data){
                    this.$refs.dlg.hide()
                    this.$emit('submit')
                    this.$message.success({
                        message: '编辑成功',
                        center: true
                    })
                } else {
                    this.$message.error({
                        message: '编辑失败',
                        center: true
                    })
                }
            })
            .catch(() => {
                this.$message.error({
                    message: '编辑失败，请稍后再试！',
                    center: true
                })
            })
        },
        show(data) {
            this.errors.clear()
            data && Object.assign(this.form, data);
            this.$nextTick(() => this.$refs.dlg.show())
        }
    }
}
</script>

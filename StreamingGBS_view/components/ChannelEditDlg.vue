<template>
    <FormDlg title="编辑通道" @hide="onHide" @show="onShow" @submit="onSubmit" ref="dlg" :disabled="errors.any()">
        <div :class="{'form-group':true,'has-error': errors.has('channelcode')}">
            <label for="input-channelcode" class="col-sm-4 control-label">通道编码
                <span class="text-red">*</span>
            </label>
            <div class="col-sm-7">
                <input type="text" class="form-control" id="input-channelcode" name="channelcode" v-model.trim="form.channelcode" data-vv-as="通道编码" v-validate="'required'" @keydown.enter="$el.querySelector('#input-channelcode').focus()">
            </div>
        </div>
        <div :class="{'form-group':true,'has-error': errors.has('channelname')}">
            <label for="input-channelname" class="col-sm-4 control-label">通道名称
                <span class="text-red">*</span>
            </label>
            <div class="col-sm-7">
                <input type="text" class="form-control" id="input-channelname" name="channelname" v-model.trim="form.channelname" data-vv-as="通道名称" v-validate="'required'" @keydown.enter="$el.querySelector('#input-channelname').focus()">
            </div>
        </div>
        <div :class="{'form-group':true,'has-error': errors.has('ptzEnable')}">
            <label for="input-ptzEnable" class="col-sm-4 control-label">是否支持云台
                <span class="text-red">*</span>
            </label>
            <div class="col-sm-7">
                <select class="form-control" id="input-ptzEnable" name="ptzEnable" v-model.trim="form.ptzEnable" data-vv-as="是否支持云台" v-validate="'required'">
                    <option value="1">支持</option>
                    <option value="0">不支持</option>
                </select>
            </div>
        </div>
        <div :class="{'form-group':true,'has-error': errors.has('talkEnbale')}">
            <label for="input-talkEnbale" class="col-sm-4 control-label">是否支持对讲
                <span class="text-red">*</span>
            </label>
            <div class="col-sm-7">
                <select class="form-control" id="input-talkEnbale" name="talkEnbale" v-model.trim="form.talkEnbale" data-vv-as="是否支持对讲" v-validate="'required'">
                    <option value="1">支持</option>
                    <option value="0">不支持</option>
                </select>
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
            form: this.defForm(),
            smsList: [],
        }
    },
    components: {
        FormDlg
    },
    methods: {
        defForm() {
            return {
                id: '',
                deviceid: '',
                channelcode: '',
                channelname: '',
                ptzEnable: '',
                talkEnbale: ''
            }
        },
        onHide() {
            this.form = this.defForm();
            this.$emit("hide");
        },
        onShow() {
            this.errors.clear();
            this.$emit("show");
        },
        async onSubmit() {
            var ok = await this.$validator.validateAll();
            if(!ok) {
                var e = this.errors.items[0];
                this.$message({
                    type: 'error',
                    message: e.msg
                })
                $(`[name=${e.field}]`).focus();
                return;
            }
            $.post(this.$store.state.baseUrl + '/deviceChannelInfo/edit', this.form).then(data => {
                if(data.code >= 0){
                    this.$refs['dlg'].hide();
                    this.$emit("submit");
                }else{
                    this.$message({
                        message: data.msg,
                        type: 'warning',
                    });
                    return;
                }
            })
        },
        async show(data) {
            this.errors.clear();
            if(data) {
                Object.assign(this.form, data);
            }
            this.$nextTick(() => {
                this.$refs['dlg'].show();
            })
        }
    }
}
</script>

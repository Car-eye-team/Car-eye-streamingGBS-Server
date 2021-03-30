<template>
<div class="container-fluid no-padding">
  <section class="content">
    <div class="nav-tabs-custom no-padding">
      <ul class="nav nav-tabs">
        <li class="active"><a href="#base-config" data-toggle="tab">流媒体服务配置</a></li>
      </ul>
      <div class="tab-content" style="height: calc(100% - 44px);">
        <div class="tab-pane  active" id="base-config">
          <form role="form" class="form-horizontal" autocomplete="off" @submit.prevent="onSubmit">
            <div :class="['form-group' , {'has-error':  errors.has('videoServerIp')}]">
              <label for="sip-videoServerIp" class="col-sm-4 control-label">视频服务器IP</label>
              <div class="col-sm-7">
                <input id="sip-videoServerIp" type="text" class="form-control" name="videoServerIp" data-vv-as="视频服务器IP" v-validate="'ip'" v-model.trim="videoServerIp">
                <span class="help-block">{{errors.first('videoServerIp')}}</span>
              </div>
            </div>
            <div :class="['form-group' , {'has-error': errors.has('rtmpPort')}]">
              <label for="sip-rtmpPort" class="col-sm-4 control-label">RTMP播放端口</label>
              <div class="col-sm-7">
                <input id="sip-rtmpPort" type="text" class="form-control" name="rtmpPort" data-vv-as="RTMP播放端口" v-validate="'numeric'" v-model.trim="rtmpPort">
                <span class="help-block">{{errors.first('Realm')}}</span>
              </div>
            </div>
            <div :class="['form-group' , {'has-error': errors.has('httpPort')}]">
              <label for="sip-httpPort" class="col-sm-4 control-label">http播放端口</label>
              <div class="col-sm-7">
                <input type="text" id="sip-httpPort" class="form-control" name="httpPort" data-vv-as="http播放端口" v-validate="'numeric'" v-model.trim="httpPort">
                <span class="help-block">{{errors.first('Host')}}</span>
              </div>
            </div>
            <div :class="['form-group' , {'has-error': errors.has('closeDelay')}]">
              <label for="sip-closeDelay" class="col-sm-4 control-label">视频关闭延迟(秒)</label>
              <div class="col-sm-7">
                <input type="text" id="sip-closeDelay" class="form-control" name="closeDelay" data-vv-as="视频关闭延迟" v-validate="'numeric'" v-model.trim="closeDelay">
                <span class="help-block">{{errors.first('closeDelay')}}</span>
              </div>
            </div>
            <div :class="['form-group' , {'has-error': errors.has('stateCheckIp')}]">
              <label for="sip-stateCheckIp" class="col-sm-4 control-label">状态检测IP</label>
              <div class="col-sm-7">
                <input type="text" id="sip-stateCheckIp" class="form-control" name="stateCheckIp" data-vv-as="状态检测IP" v-validate="'ip'" v-model.trim="stateCheckIp">
                <span class="help-block">{{errors.first('stateCheckIp')}}</span>
              </div>
            </div>
            <div :class="['form-group' , {'has-error': errors.has('stateCheckPort')}]">
              <label for="sip-stateCheckPort" class="col-sm-4 control-label">状态检测端口</label>
              <div class="col-sm-7">
                <input type="text" id="sip-stateCheckPort" class="form-control" name="stateCheckPort" data-vv-as="状态检测端口" v-validate="'numeric'" v-model.trim="stateCheckPort">
                <span class="help-block">{{errors.first('stateCheckPort')}}</span>
              </div>
            </div>
            <div :class="['form-group' , {'has-error': errors.has('voiceTalkIp')}]">
              <label for="sip-voiceTalkIp" class="col-sm-4 control-label">语音对讲IP</label>
              <div class="col-sm-7">
                <input type="text" id="sip-voiceTalkIp" class="form-control" name="voiceTalkIp" data-vv-as="状态检测IP" v-validate="'ip'" v-model.trim="voiceTalkIp">
                <span class="help-block">{{errors.first('voiceTalkIp')}}</span>
              </div>
            </div>
            <div :class="['form-group' , {'has-error': errors.has('voiceTalkPort')}]">
              <label for="sip-voiceTalkPort" class="col-sm-4 control-label">语音对讲端口</label>
              <div class="col-sm-7">
                <input type="text" id="sip-voiceTalkPort" class="form-control" name="voiceTalkPort" data-vv-as="状态检测端口" v-validate="'numeric'" v-model.trim="voiceTalkPort">
                <span class="help-block">{{errors.first('voiceTalkPort')}}</span>
              </div>
            </div>
            <div :class="{'form-group': true, 'has-error': errors.has('clearVideoPeriod')}">
              <label for="input-clearVideoPeriod" class="col-sm-4 control-label">历史视频清理周期(天)<span class="text-red">*</span></label>
              <div class="col-sm-7">
                <input type="text" id="sip-clearVideoPeriod" class="form-control" name="clearVideoPeriod" data-vv-as="历史视频清理周期(天)" v-validate="'numeric'" v-model.trim="clearVideoPeriod">
                <span class="help-block">{{errors.first('clearVideoPeriod')}}</span>
              </div>
            </div>
            <div :class="{'form-group': true, 'has-error': errors.has('sessionTimeOut')}">
              <label for="input-sessionTimeOut" class="col-sm-4 control-label">登录超时(分钟)<span class="text-red">*</span></label>
              <div class="col-sm-7">
                <input type="text" id="sip-sessionTimeOut" class="form-control" name="sessionTimeOut" data-vv-as="登录超时(分钟)" v-validate="'numeric'" v-model.trim="sessionTimeOut">
                <span class="help-block">{{errors.first('sessionTimeOut')}}</span>
              </div>
            </div>
            <div class="form-group mybtn">
              <button type="submit" class="btn btn-primary" :disabled="isBasicNoChange || errors.any() || bCommitting">保&nbsp;&nbsp;存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import $ from "jquery";
import {
  mapState,
  mapActions
} from "vuex"
export default {
  data() {
    return {
      bCommitting: false,
      videoServerIp: "",
      rtmpPort: "",
      httpPort: "",
      closeDelay: 0,
      stateCheckIp: "",
      stateCheckPort: "",
      voiceTalkIp: '',
      voiceTalkPort: '',
      remoteBasicData: "",
      record: "",
      clearVideoPeriod: "",
      speed: 0,
      sessionTimeOut: 0,
    };
  },
  computed: {
    ...mapState([
      "menus",
      "serverInfo"
    ]),
    isBasicNoChange() {
      var localeData = JSON.stringify(this.getBasicCommitObject());
      return this.remoteBasicData.localeCompare(localeData) == 0;
    }
  },
  mounted() {
      this.getBaseConfig();
  },
  methods: {
    async onSubmit() {
      var ok = await this.$validator.validateAll();
      if (!ok) {
        var e = this.errors.items[0];
        this.$message({
          type: "error",
          message: e.msg
        });
        $(`[name=${e.field}]`).focus();
        return;
      }
      this.bCommitting = true;
      $.post(this.$store.state.baseUrl + "/sysParamSet/save", this.getBasicCommitObject()).then(data => {
        this.$message({
          type: "success",
          message: "配置成功！"
        });
        this.$parent.getSomeParams();
      }).always(() => {
        this.getBaseConfig()
        this.bCommitting = false;
      })
    },
    getBasicCommitObject() {
      return {
        videoServerIp: this.videoServerIp,
        rtmpPort: this.rtmpPort,
        httpPort: this.httpPort,
        closeDelay: this.closeDelay,
        stateCheckIp: this.stateCheckIp,
        stateCheckPort: this.stateCheckPort,
        voiceTalkIp: this.voiceTalkIp,
        voiceTalkPort: this.voiceTalkPort,
        record: this.record,
        clearVideoPeriod: this.clearVideoPeriod,
        speed: this.speed,
        sessionTimeOut: this.sessionTimeOut
      };
    },
    getBaseConfig() {
      $.get(this.$store.state.baseUrl + "/sysParamSet/getParamInfo").then(ret => {
        this.videoServerIp = ret.data.videoServerIp;
        this.rtmpPort = ret.data.rtmpPort;
        this.httpPort = ret.data.httpPort;
        this.closeDelay = ret.data.closeDelay;
        this.stateCheckIp = ret.data.stateCheckIp;
        this.stateCheckPort = ret.data.stateCheckPort;
        this.voiceTalkIp = ret.data.voiceTalkIp;
        this.voiceTalkPort = ret.data.voiceTalkPort;
        this.record = ret.data.record;
        this.clearVideoPeriod = ret.data.clearVideoPeriod;
        this.speed = ret.data.speed;
        this.sessionTimeOut = ret.data.sessionTimeOut;
        this.remoteBasicData = JSON.stringify(this.getBasicCommitObject());
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .container-fluid{
    width: 100%;
    height: 100%;
    .content{
      width: 100%;
      height: 100%;
      padding: 0;
      .nav-tabs-custom{
        width: 100%;
        height: 100%;
        margin: 0;
        .tab-pane{
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .mybtn{
          text-align: center;
        }
      }
    }
  }
  .fa.cfg-black-list, .fa.cfg-white-list {
    font-size: 14px;
    line-height: 19px;
    display: inline-block;
    color: #606266;
  }
</style>

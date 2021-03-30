<template>
  <div :style="boxHeight" v-loading="loading">
    <div class="box box-primary">
      <div class="box-header">
        <h4 class="text-primary text-center">服务器列表</h4>
      </div>
      <div class="box-body box-search">
        <form class="form-inline" autocomplete="off" spellcheck="false">
          <div class="form-group form-group-sm">
            <label style="width: auto; margin-left: 5px">服务器状态</label>
            <select class="form-control" v-model="enabled" style="width: 80px; margin-left: 5px">
              <option value="">全部</option>
              <option value="1">启用</option>
              <option value="0">禁用</option>
            </select>
          </div>
          <div class="form-group form-group-sm pull-right">
            <div class="input-group input-group-sm" v-if="hasAnyRole(buttons, userInfo, '756090393669533696')">
              <button type="button" class="btn btn-sm btn-primary" @click.prevent="$refs.serverAddDlg.show()">
                <i class="fa fa-plus"></i> 添加
              </button>
            </div>
          </div>
        </form>
        <br>
        <el-table height="100%" stripe :data="servers" class="my-table">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="name" label="名称" align="center" min-width="100" show-overflow-tooltip />
          <el-table-column prop="publicIp" label="公网IP" align="center" min-width="140" />
          <el-table-column prop="localIp" label="内网IP" align="center" min-width="140" />
          <el-table-column prop="httpPort" label="HTTP端口" align="center" width="65"  />
          <el-table-column prop="rtmpPort" label="RTMP端口" align="center" width="65" />
          <el-table-column prop="stateCheckIp" label="状态检测IP" align="center" min-width="140"/>
          <el-table-column prop="stateCheckPort" label="状态检测端口" align="center" width="85" />
          <el-table-column prop="record" label="录像" align="center" width="60">
            <template slot-scope="props">
              <span class="text-success" v-if="props.row.record">开启</span>
              <span class="text-gray" v-else>关闭</span>
            </template>
          </el-table-column>
          <el-table-column prop="recordFileDir" label="录像存放目录" align="center" min-width="160" show-overflow-tooltip />
          <el-table-column prop="maxBandwidth" label="最大带宽(Mbps)" align="center" width="85" />
          <el-table-column prop="enabled" label="状态" align="center" width="60">
            <template slot-scope="props">
              <span class="text-success" v-if="props.row.enabled">启用</span>
              <span class="text-gray" v-else>禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="190" fixed="right" align="center">
            <template slot-scope="props">
                <div class="btn-group btn-group-xs">
                    <button type="button" class="btn btn-info" @click.prevent="edit(props.row)" v-if="hasAnyRole(buttons, userInfo, '756090541694910464')">
                      <i class="fa fa-edit"></i> 编辑
                    </button>
                    <button type="button" class="btn btn-warning" @click.prevent="setStatus(props.row)" v-if="hasAnyRole(buttons, userInfo, '756090541694910464')">
                      <i class="fa fa-info"></i> {{ props.row.enabled ? '禁用' : '启用' }}
                    </button>
                    <button type="button" class="btn btn-danger" @click.prevent="del(props.row)" v-if="hasAnyRole(buttons, userInfo, '756090618203209728')">
                      <i class="fa fa-remove"></i> 删除
                    </button>
                </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="box-footer">
        <el-pagination layout="total" class="pull-right" :total="servers.length" />
      </div>
    </div>
    <ServerAddDlg ref="serverAddDlg" @submit="fetchServerList" />
    <ServerEditDlg ref="serverEditDlg" @submit="fetchServerList" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import $ from 'jquery'

export default {
  data() {
    return {
      boxHeight: "height: 100%;",
      enabled: '',
      servers: [],
      loading: false
    }
  },
  components: {
    ServerEditDlg: () => import('components/Server/ServerEditDlg.vue'),
    ServerAddDlg: () => import('components/Server//ServerAddDlg.vue')
  },
  computed: {
    ...mapState(['userInfo', 'buttons'])
  },
  watch: {
    enabled() {
      this.fetchServerList()
    }
  },
  methods: {
    fetchServerList() {
      if (this.loading) {
        return
      }
      this.loading = true
      const query = {}
      if (this.enabled != null && this.enabled !== '') {
        query.enabled = this.enabled
      }
      $.get(this.$store.state.baseUrl + '/server/all', query)
       .then(ret => {
         this.servers = ret.data
         if (this.isMobile() && ret.data.length) {
           this.boxHeight = 'height:calc(100% + ' + (ret.data.length * 30 + 50) + 'px);'
         }
       })
        .always(() => {
         this.loading = false
       })
    },

    setStatus(row) {
        console.log('setStatus', row)
        const act = row.enabled ? 'disable' : 'enable'
        const actTitle = row.enabled ? '禁用' : '启用'
        this.$confirm(`确认${actTitle}${row.name || '此服务器'}吗？`, '操作提示')
        .then(() => {
          $.ajax({
            url: this.$store.state.baseUrl + '/server/' + row.id + '/' + act,
            method: 'put'
          })
          .then(res => {
            if (res.data) {
              this.fetchServerList()
              this.$message.success({
                message: `已${actTitle}`,
                center: true
              })
            } else {
              this.$message.error({
                message: `${actTitle}失败`,
                center: true
              })
            }
          }).catch(() => {
            this.$message.error({
              message: `${actTitle}失败，请稍后再试！`,
              center: true
            })
          })
        })
        .catch(() => {})
    },

    del(row) {
      this.$confirm(`确认删除${row.name || '此服务器'}吗？`, '操作提示')
      .then(() => {
        $.ajax({
          url: this.$store.state.baseUrl + '/server/' + row.id,
          method: 'delete'
        })
        .then(res => {
          if (res.data) {
            this.fetchServerList()
            this.$message.success({
              message: '已删除',
              center: true
            })
          } else {
            this.$message.error({
              message: '删除失败',
              center: true
            })
          }
        })
        .catch(() => {
          this.$message.error({
            message: '删除失败，请稍后再试！',
            center: true
          })
        })
      })
      .catch(() => {})
    },

    edit(row) {
      this.$refs.serverEditDlg.show({
        id: row.id,
        name: row.name,
        publicIp: row.publicIp,
        localIp: row.localIp,
        httpPort: row.httpPort,
        rtmpPort: row.rtmpPort,
        closeDelay: row.closeDelay,
        stateCheckIp: row.stateCheckIp,
        stateCheckPort: row.stateCheckPort,
        record: row.record,
        recordFileDir: row.recordFileDir,
        clearVideoPeriod: row.clearVideoPeriod,
        maxBandwidth: row.maxBandwidth,
        fileServerIp: row.fileServerIp,
        fileServerPort: row.fileServerPort,
        enabled: row.enabled,
        voiceTalkIp: row.voiceTalkIp,
        voiceTalkPort: row.voiceTalkPort,
        sessionTimeout: row.sessionTimeout
      })
    }
  },

  beforeMount() {
    this.fetchServerList()
  }
}
</script>

<style scoped>

</style>
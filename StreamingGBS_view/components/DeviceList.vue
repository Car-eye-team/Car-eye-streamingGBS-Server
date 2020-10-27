<template>
  <div>
    <div class="box box-primary">
      <div class="box-header">
        <h4 class="text-primary text-center">设备列表</h4>
      </div>
      <div class="box-body">
        <form class="form-inline" autocomplete="off" spellcheck="false">
          <div class="input-group input-group-sm" v-if="hasAnyRole(buttons, userInfo, '756090393669533696')">
            <button type="button" class="btn btn-sm btn-primary" @click.prevent="$refs['deviceAddDlg'].show()">
              <i class="fa fa-plus"></i> 添加设备
            </button>
          </div>
          <span class="hidden-xs">&nbsp;&nbsp;</span>
          <div class="form-group form-group-sm search-dept">
            <label>组织机构</label>
            <SelectTreeSearch v-model.trim="deptid" :options="this.$store.state.deptOptions" :props="{parent:'parentid',value:'deptid',label:'deptname',children:'children'}"></SelectTreeSearch>
          </div>
          <span class="hidden-xs">&nbsp;&nbsp;</span>
          <div class="form-group form-group-sm">
            <label>搜索</label>
            <input type="text" class="form-control" placeholder="设备编码、名称" v-model.trim="q" @keydown.enter.prevent ref="q">
          </div>
          <span class="hidden-xs">&nbsp;&nbsp;</span>
          <div class="form-group form-group-sm">
            <label>在线状态</label>
            <select class="form-control" v-model.trim="online">
              <option value="">全部</option>
              <option value="1">在线</option>
              <option value="0">离线</option>
            </select>
          </div>
          <span class="hidden-xs">&nbsp;&nbsp;</span>
          <div class="input-group input-group-sm" v-if="hasAnyRole(buttons, userInfo, '756090393669533696')">
            <button type="button" class="btn btn-sm btn-primary" @click.prevent="$refs['deviceImportDlg'].show()">
              <i class="fa fa-cloud-upload"></i> 导入设备
            </button>
          </div>
        </form>
        <br>
        <div class="clearfix"></div>
        <el-table :data="devices" stripe :default-sort="{prop: 'id', order: 'desc'}" @sort-change="sortChange">
          <el-table-column prop="devicecode" label="设备编码" min-width="140" :formatter="formatName" sortable="custom">
            <template slot-scope="props">
              <span>{{props.row.devicecode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="160" v-if="isMobile()">
            <template slot-scope="props">
                <div class="btn-group btn-group-xs">
                    <router-link class="btn btn-info" :to="`/devices/channels/${props.row.id}/1`" v-if="hasAnyRole(buttons, userInfo, '756090917986893824')">
                        查看通道
                    </router-link>
                    <button type="button" class="btn btn-warning" @click.prevent="editDevice(props.row)" v-if="hasAnyRole(buttons, userInfo, '756090541694910464')">
                      <i class="fa fa-edit"></i> 编辑
                    </button>
                    <button type="button" class="btn btn-danger" @click.prevent="removeDevice(props.row)" v-if="!props.row.online && hasAnyRole(buttons, userInfo, '756090618203209728')">
                      <i class="fa fa-remove"></i> 删除
                    </button>
                </div>
            </template>
          </el-table-column>
          <el-table-column prop="devicename" label="设备名称" min-width="140" :formatter="formatName" show-overflow-tooltip></el-table-column>
          <el-table-column prop="deptname" label="组织机构" min-width="200" :formatter="formatName" show-overflow-tooltip></el-table-column>
          <el-table-column prop="devicetypename" label="设备类型" min-width="140" :formatter="formatName" show-overflow-tooltip></el-table-column>
          <el-table-column prop="channels" label="通道数" min-width="100" sortable="custom"></el-table-column>
          <el-table-column prop="status" label="在线状态" min-width="100">
            <template slot-scope="props">
              <span class="text-success" v-if="props.row.status === 1">在线</span>
              <span class="text-gray" v-else>离线</span>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP地址" min-width="120" :formatter="formatName"></el-table-column>
          <el-table-column prop="port" label="端口" min-width="80" :formatter="formatName"></el-table-column>
          <el-table-column prop="createDate" label="创建时间" min-width="160" sortable="custom" :formatter="formatDate"></el-table-column>
          <el-table-column label="操作" min-width="160" fixed="right" v-if="!isMobile()">
            <template slot-scope="props">
                <div class="btn-group btn-group-xs">
                    <router-link class="btn btn-info" :to="`/devices/channels/${props.row.id}/1`" v-if="hasAnyRole(buttons, userInfo, '756090917986893824')">
                       <i class="fa fa-info"></i> 查看通道
                    </router-link>
                    <button type="button" class="btn btn-warning" @click.prevent="editDevice(props.row)" v-if="hasAnyRole(buttons, userInfo, '756090541694910464')">
                      <i class="fa fa-edit"></i> 编辑
                    </button>
                    <button type="button" class="btn btn-danger" @click.prevent="removeDevice(props.row)" v-if="!props.row.online && hasAnyRole(buttons, userInfo, '756090618203209728')">
                      <i class="fa fa-remove"></i> 删除
                    </button>
                </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="box-footer" v-if="total > 0">
        <el-pagination layout="total,prev,pager,next" :pager-count="5" class="pull-right" :total="total" :page-size.sync="pageSize" :current-page.sync="currentPage"></el-pagination>
      </div>
    </div>
    
    <DeviceAddDlg ref="deviceAddDlg" @submit="getDeviceList"></DeviceAddDlg>
    <DeviceEditDlg ref="deviceEditDlg" @submit="getDeviceList"></DeviceEditDlg>
    <DeviceImportDlg ref="deviceImportDlg" @submit="getDeviceList"></DeviceImportDlg>
  </div>
</template>

<script>
import _ from "lodash";
import url from "url";
import DeviceEditDlg from 'components/DeviceEditDlg.vue'
import DeviceAddDlg from 'components/DeviceAddDlg.vue'
import SelectTreeSearch from 'components/SelectTreeSearch.vue'
import DeviceImportDlg from 'components/DeviceImportDlg.vue'
import { mapState } from "vuex"
export default {
  props: {},
  data() {
    return {
      deptid: '',
      q: "",
      online: "",
      total: 0,
      pageSize: 10,
      currentPage: 1,
      sort: "id",
      order: "desc",
      devices: [],
      loading: false,
      timer: 0
    };
  },
  components: {
    DeviceEditDlg,DeviceAddDlg,SelectTreeSearch,DeviceImportDlg
  },
  computed: {
    ...mapState(["userInfo", "buttons"])
  },
  mounted() {
    // this.$refs["q"].focus();
    this.getDeviceList();
    this.timer = setInterval(() => {
        this.getDeviceList();
    }, 3000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
  },
  watch: {
    deptid: function(newVal, oldVal) {
      this.doDelaySearch();
    },
    q: function(newVal, oldVal) {
      this.doDelaySearch();
    },
    online: function(newVal, oldVal) {
      this.doSearch();
    },
    currentPage: function(newVal, oldVal) {
      this.doSearch(newVal);
    },
  },
  methods: {
    isMobile() {
      return videojs.browser.IS_IOS || videojs.browser.IS_ANDROID;
    },
    doSearch(page = 1) {
      var query = {};
      if (this.deptid) query["deptid"] = this.deptid;
      if (this.q) query["q"] = this.q;
      if (this.online) query["online"] = this.online;
      this.$router.replace({
        path: `/devices/${page}`,
        query: query
      });
    },
    doDelaySearch: _.debounce(function() {
      this.doSearch();
    }, 500),
    getDeviceList() {
      this.loading = true;

      $.get(this.$store.state.baseUrl + "/deviceInfo/list", {
        deptid: this.deptid,
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
        })
        .always(() => {
          this.loading = false;
        });
    },
    sortChange(data) {
      this.sort = data.prop;
      this.order = data.order == "ascending" ? "asc" : "desc";
      this.getDeviceList();
    },
    removeDevice(row) {
      this.$confirm(`确认删除 ${row.devicename || row.devicecode}`, "提示").then(() => {
        $.post(this.$store.state.baseUrl + "/deviceInfo/delete", {
          id: row.id
        }).always(() => {
          this.getDeviceList();
        });
      }).catch(() => {});
    },
    editDevice(row) {
      this.$refs["deviceEditDlg"].show({
        id: row.id,
        deptid: row.deptid,
        devicecode: row.devicecode,
        devicename: row.devicename,
        channels: row.channels,
        devicetypeid: row.devicetypeid,
        ip: row.ip,
        port: row.port,
        password: row.password,
        installTimeStr: this.formatDay(null,row,row.installTime),
        location: row.location
      });
    },
    formatName(row, col, cell) {
      if (cell) return cell;
      return "-";
    },
    formatDate(row, col, cell) {
      if (cell){
        var date = new Date(cell) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' '
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':'
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':'
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds())
        return Y+M+D+h+m+s
      } 
      return "";
    },
    formatDay(row, col, cell) {
      if (cell){
        var date = new Date(cell) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate())
        return Y+M+D
      } 
      return "";
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.deptid = to.query.deptid || "";
      vm.q = to.query.q || "";
      vm.online = to.query.online || "";
      vm.currentPage = parseInt(to.params.page) || 1;
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
    next();
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.$nextTick(() => {
      this.deptid = to.query.deptid || "";
      this.q = to.query.q || "";
      this.online = to.query.online || "";
      this.currentPage = parseInt(to.params.page) || 1;
      this.devices = [];
      this.getDeviceList();
    });
  }
};
</script>


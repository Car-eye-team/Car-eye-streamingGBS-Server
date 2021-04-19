<template>
  <div :style="boxHeight">
    <div class="box box-primary">
      <div class="box-header">
        <h4 class="text-primary text-center">报警列表</h4>
      </div>
      <div class="box-body box-search">
        <form class="form-inline" autocomplete="off" spellcheck="false">
          <div class="form-group form-group-sm">
            <label>搜索</label>
            <input type="text" class="form-control" placeholder="国标编码" v-model.trim="q" @change="getAlarms" @keydown.enter.prevent ref="q">
          </div>
          <span class="hidden-xs">&nbsp;&nbsp;</span>
          <div class="form-group form-group-sm">
            <label>报警级别</label>
            <select class="form-control" v-model.trim="type" @change="getAlarms">
              <option value="">全部</option>
              <option value="1">一级警情</option>
              <option value="2">二级警情</option>
              <option value="3">三级警情</option>
              <option value="4">四级警情</option>
            </select>
          </div>
          <span class="hidden-xs">&nbsp;&nbsp;</span>
          <div class="form-group form-group-sm">
            <label>报警方式</label>
            <select class="form-control" v-model.trim="online" @change="getAlarms">
              <option value="">全部</option>
              <option value="1">电话报警</option>
              <option value="2">设备报警</option>
              <option value="3">短信报警</option>
              <option value="4">GPS报警</option>
              <option value="5">视频报警</option>
              <option value="6">设备故障报警</option>
              <option value="7">其他报警</option>
            </select>
          </div>
          <span class="hidden-xs">&nbsp;&nbsp;</span>
          <div class="form-group form-group-sm">
            <label>报警类型</label>
            <select class="form-control" v-model.trim="alarmtype" @change="getAlarms">
              <option value="">全部</option>
              <option value="1">视频丢失报警</option>
              <option value="2">设备防拆报警</option>
              <option value="3">存储设备磁盘满报警</option>
              <option value="4">设备高温报警</option>
              <option value="5">设备低温报警</option>
              <option value="6">人工视频报警</option>
              <option value="7">运动目标检测报警</option>
              <option value="8">遗留物检测报警</option>
              <option value="9">物体移除检测报警</option>
              <option value="10">绊线检测报警</option>
              <option value="11">入侵检测报警</option>
              <option value="12">逆行检测报警</option>
              <option value="13">徘徊检测报警</option>
              <option value="14">流量统计报警</option>
              <option value="15">密度检测报警</option>
              <option value="16">视频异常检测报警</option>
              <option value="17">快速移动报警</option>
              <option value="18">存储设备磁盘故障报警</option>
              <option value="19">存储设备风扇故障报警</option>
              <option value="20">其他报警</option>
            </select>
          </div>
          <span class="hidden-xs">&nbsp;&nbsp;</span>
          <div class="form-group form-group-sm date-from-control">
            <label>报警开始时间</label>
            <el-date-picker class="form-control date-input" v-model.trim="startDate" type="datetime" @change="getAlarms" placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </div>
          <span class="hidden-xs">&nbsp;&nbsp;</span>
          <div class="form-group form-group-sm date-from-control">
            <label>报警结束时间</label>
            <el-date-picker class="form-control date-input" v-model.trim="endDate" type="datetime" @change="getAlarms" placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </div>
          <div class="form-group form-group-sm pull-right">
            <div class="input-group input-group-sm">
              <button type="button" class="btn btn-sm btn-danger" @click.prevent="removeAllAlarm()">
                <i class="fa fa-remove"></i> 全部删除
              </button>
            </div>
          </div>
        </form>
        <br>
        <el-table class="my-table" height="100%" :data="alarms" stripe :default-sort="{prop: 'time', order: 'descending'}" @sort-change="sortChange" v-loading="loading" element-loading-text="加载中...">
          <el-table-column prop="gb_ID" label="国标编码" min-width="200" :formatter="formatName" show-overflow-tooltip></el-table-column>
          <el-table-column prop="level" label="报警级别" min-width="100" show-overflow-tooltip sortable="custom">
            <template slot-scope="props">
              <span class="text-primary" v-if="props.row.level === 1">一级警情</span>
              <span class="text-primary" v-else-if="props.row.level === 2">二级警情</span>
              <span class="text-primary" v-else-if="props.row.level === 3">三级警情</span>
              <span class="text-primary" v-else-if="props.row.level === 4">四级警情</span>
              <span class="text-primary" v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="alarmmethod" label="报警方式" min-width="100" show-overflow-tooltip>
            <template slot-scope="props">
              <span class="text-primary" v-if="props.row.alarmmethod === 1">电话报警</span>
              <span class="text-primary" v-else-if="props.row.alarmmethod === 2">设备报警</span>
              <span class="text-primary" v-else-if="props.row.alarmmethod === 3">短信报警</span>
              <span class="text-primary" v-else-if="props.row.alarmmethod === 4">GPS报警</span>
              <span class="text-primary" v-else-if="props.row.alarmmethod === 5">视频报警</span>
              <span class="text-primary" v-else-if="props.row.alarmmethod === 6">设备故障报警</span>
              <span class="text-primary" v-else-if="props.row.alarmmethod === 7">其他报警</span>
              <span class="text-primary" v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="alarmtype" label="报警类型" min-width="200" show-overflow-tooltip>
            <template slot-scope="props">
              <span class="text-primary" v-if="props.row.alarmtype === 1">视频丢失报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 2">设备防拆报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 3">存储设备磁盘满报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 4">设备高温报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 5">设备低温报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 6">人工视频报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 7">运动目标检测报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 8">遗留物检测报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 9">物体移除检测报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 10">绊线检测报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 11">入侵检测报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 12">逆行检测报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 13">徘徊检测报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 14">流量统计报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 15">密度检测报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 16">视频异常检测报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 17">快速移动报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 18">存储设备磁盘故障报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 19">存储设备风扇故障报警</span>
              <span class="text-primary" v-else-if="props.row.alarmtype === 20">其他报警</span>
              <span class="text-primary" v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="报警时间" min-width="160" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" min-width="70" fixed="right">
            <template slot-scope="props">
                <div class="btn-group btn-group-xs">
                    <button type="button" class="btn btn-danger" @click.prevent="removeAlarm(props.row)" v-if="hasAnyRole(buttons, userInfo, '765968992186793984')">
                      <i class="fa fa-remove"></i> 删除
                    </button>
                </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="box-footer">
        <el-pagination layout="total,prev,pager,next" :pager-count="pageBtnNum" class="pull-right" :total="total" :page-size.sync="pageSize" :current-page.sync="currentPage" @current-change="getAlarms"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
export default {
  props: {
  },
  data() {
    return {
      boxHeight: "height: 100%;",
      q: "",
      type: "",
      online: "",
      total: 0,
      pageSize: 20,
      currentPage: 1,
      sort: "time",
      order: "desc",
      loading: false,
      alarms: [],
      alarmtype: '',
      startDate: "",
      endDate: "",
    };
  },
  computed: {
    ...mapState(["userInfo", "buttons"])
  },
  watch: {
    // q: function(newVal, oldVal) {
    //   this.doDelaySearch();
    // },
    // type: function(newVal, oldVal) {
    //   this.doSearch();
    // },
    // online: function(newVal, oldVal) {
    //   this.doSearch();
    // },
    // alarmtype: function(newVal, oldVal) {
    //   this.doSearch();
    // },
    // startDate: function(newVal, oldVal) {
    //   this.doSearch();
    // },
    // endDate: function(newVal, oldVal) {
    //   this.doSearch();
    // },
    // currentPage: function(newVal, oldVal) {
    //   this.doSearch(newVal);
    // }
  },
  components: {
    
  },
  mounted() {
    this.startDate = this.formatTime(new Date().getTime(),"yyyy-MM-dd")+" 00:00:00";
    this.endDate = this.formatTime(new Date().getTime(),"yyyy-MM-dd")+" 23:59:59";
    this.getAlarms();
  },
  methods: {
    // doSearch(page = 1) {
    //   var query = {};
    //   if (this.q) query["q"] = this.q;
    //   if (this.type) query["type"] = this.type;
    //   if (this.online) query["online"] = this.online;
    //   if (this.alarmtype) query["alarmtype"] = this.alarmtype;
    //   if (this.startDate) query["startDate"] = this.startDate;
    //   if (this.endDate) query["endDate"] = this.endDate;
    //   this.$router.replace({
    //     path: `/alarms/${page}`,
    //     query: query
    //   });
    // },
    // doDelaySearch: _.debounce(function() {
    //   this.doSearch();
    // }, 500),
    getAlarms() {
      this.loading = true;
      $.get(this.$store.state.baseUrl + "/deviceAlarm/list", {
        q: this.q,
        page: this.currentPage,
        limit: this.pageSize,
        type: this.type,
        online: this.online,
        alarmtype: this.alarmtype,
        startDate: this.startDate,
        endDate: this.endDate,
        sort: this.sort,
        order: this.order
      }).then(ret => {
        this.total = ret.count;
        this.alarms = ret.data;
        if(this.isMobile()&&ret.data.length>0){
          this.boxHeight = "height:calc(100% + "+ (ret.data.length*30+50) +"px);"
        }
      }).always(() => {
        this.loading = false;
      });
    },
    sortChange(data) {
      this.sort = data.prop;
      this.order = data.order == "ascending" ? "asc" : "desc";
      this.getAlarms();
    },
    formatName(row, col, cell) {
      if (cell) return cell;
      return "-";
    },
    removeAlarm(row) {
      this.$confirm(`确认删除`, "提示").then(() => {
        $.post(this.$store.state.baseUrl + "/deviceAlarm/delete", {
          id: row.id
        }).always(() => {
          this.getAlarms();
        });
      }).catch(() => {});
    },
    removeAllAlarm() {
      this.$confirm(`确认全部删除`, "提示").then(() => {
        $.post(this.$store.state.baseUrl + "/deviceAlarm/deleteAll", {
        }).always(() => {
          this.getAlarms();
        });
      }).catch(() => {});
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.q = to.query.q || "";
  //     vm.type = to.query.type || "";
  //     vm.online = to.query.online || "";
  //     vm.alarmtype = to.query.alarmtype || "";
  //     vm.startDate = to.query.startDate || "";
  //     vm.endDate = to.query.endDate || "";
  //     vm.currentPage = parseInt(to.params.page) || 1;
  //   });
  // },
  beforeRouteUpdate(to, from, next) {
    next();
    // this.$nextTick(() => {
    //   this.q = to.query.q || "";
    //   this.type = to.query.type || "";
    //   this.online = to.query.online || "";
    //   this.alarmtype = to.query.alarmtype || "";
    //   this.startDate = to.query.startDate || "";
    //   this.endDate = to.query.endDate || "";
    //   this.currentPage = parseInt(to.params.page) || 1;
    //   this.alarms = [];
    //   this.getAlarms();
    // });
  }
};
</script>

<style>
.date-from-control .date-input{
  border: 0;
}
.date-from-control .date-input .el-input__inner{
  margin: -5px 0 0 -10px;
  height: 30px;
}
.date-from-control .el-input__icon{
  line-height: 30px;
}
</style>




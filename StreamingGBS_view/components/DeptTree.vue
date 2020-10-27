<template>
    <div class="box box-primary">
      <div class="box-header">
        <h4 class="text-primary text-center">机构管理</h4>
        <h6 class="text-success text-center" style="color:#006600;" v-if="!isMobile()">右键操作机构</h6>
        <h6 class="text-success text-center" style="color:#006600;" v-if="isMobile()">长按操作机构</h6>
      </div>
      <div class="box-body">
        <div class="content">
          <div class="tab-content" style="margin: 10px 0;" id="tab-tree-wrapper">
              <div class="tab-pane active" ref="devTreeWrapper" id="dev-tree-wrapper">
                <el-tree ref="devTree" id="dev-tree" node-key="key" v-if="showTree" :style="`${isMobile() ? 'max-height:200px' : 'max-height:800px'};min-height:200px;overflow:auto;max-width:400px;margin:auto;border:1px solid #D8D8D8`"
                  :props="treeProps" :load="treeLoad" :filter-node-method="treeFilter" lazy
                  @node-click="treeNodeClick" @node-contextmenu="treeNodeRightClick" >
                  <span class="custom-tree-node" slot-scope="{node, data}">
                    <span :class="{'text-green': data.subCount === 0}">
                      <i :class="['fa', {'fa-home' : data.parentid == -1,
                        'fa-sitemap' : data.parentid != -1 && data.subCount > 0,
                        'fa-group': data.parentid != -1 && data.subCount == 0}]"></i>
                      <span class="ellipsis" :title="node.label">{{node.label}}</span>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
          <VueContextMenu class="right-menu" :target="contextMenuTarget" :show="contextMenuVisible" @update:show="(show) => contextMenuVisible = show">
            <a href="javascript:;" @click="showDeptAddDlg" v-show="contextMenuNodeData" style="color: #6600FF;" v-if="hasAnyRole(buttons, userInfo, '756082824884387840')">
              <i class="fa fa-plus"></i> 添加机构
            </a>
            <a href="javascript:;" @click="showDeptEditDlg" v-show="contextMenuNodeData" style="color: #6600FF;" v-if="hasAnyRole(buttons, userInfo, '756082890063872000')">
              <i class="fa fa-pencil"></i> 编辑机构
            </a>
            <a href="javascript:;" @click="deptRemove" v-show="contextMenuNodeData" style="color: #FF0000;" v-if="hasAnyRole(buttons, userInfo, '756082958280032256')">
              <i class="fa fa-trash"></i> 删除机构
            </a>
          </VueContextMenu>
      </div>
      <DeptAddDlg ref="deptAddDlg" @submit="treeRefresh"></DeptAddDlg>
      <DeptEditDlg ref="deptEditDlg" @submit="treeRefresh"></DeptEditDlg>
      <resize-observer @notify="resetTreeMaxHeight"/>
    </div>
</template>

<script>
import _ from "lodash";
import url from "url";
import { mapState } from "vuex"
import { component as VueContextMenu } from '@xunlei/vue-context-menu'
import DeptAddDlg from 'components/DeptAddDlg.vue'
import DeptEditDlg from 'components/DeptEditDlg.vue'
export default {
  props: {},
  data() {
    return {
      loading: false,
      showTree: true,
      pnode: null,
      ppnode: null,
      contextMenuTarget: null,
      contextMenuVisible: false,
      contextMenuNodeData: null,
      treeProps: {
        label: (data, node) => {
          node.deptid = data.deptid;
          node.deptname = data.deptname;
          var label = data.deptname;
          if(data.subCount > 0) {
            label += ` [${data.subCount}]`;
          }
          return label;
        },
        isLeaf: (data, node) => {
          return data.subCount == 0;
        },
        disabled: (data, node) => {
          return false;
        }
      }
    };
  },
  components: {
    VueContextMenu,DeptAddDlg,DeptEditDlg
  },
  computed: {
    ...mapState(['userInfo', 'buttons'])
  },
  mounted() {
    this.contextMenuTarget = document.querySelector('#tab-tree-wrapper');
  },
  beforeDestroy() {
  },
  beforeRouteLeave(to, from, next) {
    next();
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  methods: {
    treeLoad(data, resolve) {
      var parentid = data.deptid||"-1";
      $.get(this.$store.state.baseUrl + "/dept/getChildDeptList", {
        parentid: parentid,
      }).then(ret => {
        resolve((ret.data||[]).map(v => {
          return Object.assign(v, {
            key: v.deptid,
          })
        }));
        this.$refs['devTree'].filter();
      })
    },
    treeFilter(value, data) {
       if (!value) return true;
       return data.deptid.indexOf(value) !== -1 || data.deptname.indexOf(value) !== -1;
    },
    treeNodeRefresh(key) {
      let node = this.$refs['devTree'].getNode(key);
      if(!node) return;
      node.loaded = false;
      node.expand();
    },
    treeNodeRightClick(event, data, node, c) {
      this.contextMenuNodeData = data;
      this.pnode = node.parent;
      this.ppnode = this.pnode.parent;
      var new_event = new MouseEvent(event.type, event);
      this.contextMenuTarget.dispatchEvent(new_event);
    },
    treeNodeClick(data, node, c) {
      this.contextMenuNodeData = null;
    },
    showDeptEditDlg() {
      this.contextMenuVisible = false;
      this.$refs["deptEditDlg"].show({
        deptid: this.contextMenuNodeData.deptid,
        deptname: this.contextMenuNodeData.deptname,
        parentid: this.contextMenuNodeData.parentid,
        parentname: this.pnode.deptname,
        code: this.contextMenuNodeData.code,
        depClass: this.contextMenuNodeData.depClass,
        contract: this.contextMenuNodeData.contract,
        tel: this.contextMenuNodeData.tel,
        address: this.contextMenuNodeData.address
      });
    },
    showDeptAddDlg() {
      this.contextMenuVisible = false;
      this.$refs["deptAddDlg"].show({
        parentid: this.contextMenuNodeData.deptid,
        parentname: this.contextMenuNodeData.deptname
      });
    },
    deptRemove(){
      this.contextMenuVisible = false;
      if(this.contextMenuNodeData.parentid == -1){
        this.$message({
          message: '顶级机构无法删除',
          type: 'warning',
        });
        return;
      }
      // if(this.contextMenuNodeData.subCount > 0){
      //   this.$message({
      //     message: '请先删除子机构',
      //     type: 'warning',
      //   });
      //   return;
      // }
      this.$confirm(`即将其下删除所有子机构、设备、通道信息，确认删除 ${this.contextMenuNodeData.deptname}`, "提示").then(() => {
        $.post(this.$store.state.baseUrl + "/dept/delete", {
          deptid: this.contextMenuNodeData.deptid
        }).always(() => {
          this.delTreeRefresh();
        });
      }).catch(() => {});
    },
    treeRefresh() {
      this.contextMenuVisible = false;
      if(this.pnode) {
        this.treeNodeRefresh(this.pnode);
        return;
      }
      this.showTree = false;
      this.$nextTick(() => {
        this.showTree = true;
      })
    },
    delTreeRefresh() {
      this.contextMenuVisible = false;
      if(this.ppnode) {
        this.treeNodeRefresh(this.ppnode);
        return;
      }
      this.showTree = false;
      this.$nextTick(() => {
        this.showTree = true;
      })
    },
    getParentData() {
      if(!this.contextMenuNodeData) return null;
      if(!this.$refs["devTree"]) return null;
      var pNode = this.$refs["devTree"].getNode(this.contextMenuNodeData);
      if(!pNode) return null;
      if(!pNode.parent) return null;
      return pNode.parent.data;
    },
    resetTreeMaxHeight() {
      var $tree = $("#dev-tree");
      if(this.isMobile()) {
        $tree.css("max-height", 200);
      } else {
        this.$nextTick(() => {
          var ph = $("#dev-tree-player").height() - 90;
          var wh = $(window).height() - 450;
          var th = wh > ph ? wh : ph;
          $tree.css("max-height", th);
        })
      }
    }
  }
};
</script>

<style lang="less" scoped>
.right-menu {
  position: fixed;
  background: #fff;
  border: solid 1px rgba(0, 0, 0, .2);
  border-radius: 3px;
  z-index: 999;
  display: none;
}
.right-menu a {
  width: 100px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: block;
  color: #1a1a1a;
}
.right-menu a:hover {
  background: #eee;
  color: #fff;
}
.right-menu {
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
    border-radius: 1px;
}
a {
    text-decoration: none;
}
.right-menu a {
    padding: 2px;
}
.right-menu a:hover {
    background: #42b983;
}
</style>



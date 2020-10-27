import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        baseUrl: '/api',
        serverInfo: {
            LogoText: 'StreamingGBS',
            LogoMiniText: 'GBS',
            versionText: '0.0.1',
            CopyrightText: ''
        },
        userInfo: null,
        deptOptions: [],
        menus: [],
        buttons: [],
        devicesOptions: [],
    },
    mutations: {
        updateUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        updateDeptOptions(state, deptOptions) {
            state.deptOptions = deptOptions;
        },
        getDeviceList(state, devicesOptions) {
            state.devicesOptions = devicesOptions;
        }
    },
    actions: {
        getUserInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                $.get(state.baseUrl + "/user/getUserInfo").then(ret => {
                    if (!ret.data || ret.data == null) {
                        window.location.href = `/login.html`;
                    }
                    state.menus = ret.data.menus;
                    state.buttons = ret.data.buttons;
                    var userInfo = ret.data.userInfo;
                    commit('updateUserInfo', userInfo);
                    resolve(userInfo);
                }).fail(() => {
                    window.location.href = `/login.html`;
                    resolve(null);
                })
            })
        },
        logout({commit, state}) {
            return new Promise((resolve, reject) => {
                $.get(state.baseUrl + "/logout").then(ret => {
                    commit('updateUserInfo', null);
                    resolve(null);
                }).fail(() => {
                    resolve(null);
                })
            })
        },
        getDeptOptions({commit, state}) {
            return new Promise((resolve, reject) => {
                $.get(state.baseUrl + "/dept/getSelectTreeDeptList").then(ret => {
                    var deptOptions = new Array;
                    deptOptions.push(ret.data);

                    commit('updateDeptOptions', deptOptions);
                    resolve(deptOptions);
                }).fail(() => {
                    resolve(null);
                })
            })
        },
        getDeviceList({commit, state}) {
            return new Promise((resolve, reject) => {
                $.get(state.baseUrl + "/deviceInfo/list"), {
                    q: "",
                    page: 1,
                    limit: 10,
                    online: "",
                    sort: "id",
                    order: "desc"
                }.then(ret => {
                    var devicesOptionst = new Array;
                    devicesOptionst.push(ret.data);

                    commit('devicesOptions', devicesOptionst);
                    resolve(devicesOptionst);
                }).fail(() => {
                    resolve(null);
                })
            })
        }
        ,
    }
})

export default store;
<template>
    <FormDlg title="云台控制" @hide="onHide" @show="onShow" ref="dlg" :disabled="errors.any()">
        <div class="row" style="overflow:hidden;">
            <div class="col-lg-12 col-xs-12 col-md-12">
                <div class="col-lg-3 col-xs-3 col-md-3">
                </div>
                <div class="col-lg-2 col-xs-3 col-md-3">
                    <div class="row">
                        <div class="row">
                            <div class="col-lg-offset-2 col-lg-3 col-xs-4 col-md-4 divmd" @click="setYdControl(1)"
                                 @mouseenter="sventerorleave(1,1)" @mouseleave="sventerorleave(1,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/zs-01.png" v-show="zsflag" title="坐上"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/zs-02.png" v-show="!zsflag" title="坐上"/>
                            </div>
                            <div class="col-lg-3 col-xs-4 col-md-4 divmd" @click="setYdControl(2)"
                                 @mouseenter="sventerorleave(2,1)" @mouseleave="sventerorleave(2,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/s-01.png" v-show="sflag" title="上"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/s-02.png" v-show="!sflag" title="上"/>
                            </div>
                            <div class="col-lg-offset-1 col-lg-3 col-xs-4 col-md-4 divmd" @click="setYdControl(3)"
                                 @mouseenter="sventerorleave(3,1)" @mouseleave="sventerorleave(3,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/ys-01.png" v-show="ysflag" title="右上"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/ys-02.png" v-show="!ysflag" title="右上"/>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-offset-2 col-lg-3 col-xs-4 col-md-4 divmd" @click="setYdControl(4)"
                                 @mouseenter="sventerorleave(4,1)" @mouseleave="sventerorleave(4,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/z-01.png" v-show="zflag" title="左"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/z-02.png" v-show="!zflag" title="左"/>
                            </div>
                            <div class="col-lg-3 col-xs-4 col-md-4 divmd">
                                <!--                                <img class="ytbtnmenurf" src="../assets/ytimages/sx-01.png" v-show="sxflag"/>-->
                                <!--                                <img class="ytbtnmenurf" src="../assets/ytimages/sx-02.png" v-show="!sxflag"/>-->
                            </div>
                            <div class="col-lg-offset-1 col-lg-3 col-xs-4 col-md-4 divmd" @click="setYdControl(6)"
                                 @mouseenter="sventerorleave(6,1)" @mouseleave="sventerorleave(6,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/y-01.png" v-show="yflag" title="右"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/y-02.png" v-show="!yflag" title="右"/>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-offset-2 col-lg-3 col-xs-4 col-md-4 divmd" @click="setYdControl(7)"
                                 @mouseenter="sventerorleave(7,1)" @mouseleave="sventerorleave(7,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/zx-01.png" v-show="zxflag" title="左下"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/zx-02.png" v-show="!zxflag" title="左下"/>
                            </div>
                            <div class="col-lg-3 col-xs-4 col-md-4 divmd" @click="setYdControl(8)"
                                 @mouseenter="sventerorleave(8,1)" @mouseleave="sventerorleave(8,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/x-01.png" v-show="xflag" title="下"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/x-02.png" v-show="!xflag" title="下"/>
                            </div>
                            <div class="col-lg-offset-1 col-lg-3 col-xs-4 col-md-4 divmd" @click="setYdControl(9)"
                                 @mouseenter="sventerorleave(9,1)" @mouseleave="sventerorleave(9,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/yx-01.png" v-show="yxflag" title="右下"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/yx-02.png" v-show="!yxflag" title="右下"/>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-11 col-xs-11 col-md-11 divmd">
                                <el-slider v-model="valuesp" :min="0" :max="255" label="移动速度"
                                           @change="changesp"></el-slider>
                            </div>
                            <div class="col-lg-1 col-xs-1 col-md-1 divmd"></div>

                        </div>
                    </div>
                </div>
                <div class="col-lg-1 col-xs-1 col-md-1"></div>
                <div class="col-lg-4 col-xs-4 col-md-4">
                    <div class="row">
                        <div class="col-lg-6 col-xs-6 col-md-6" @click="setYdControl(10)"
                             @mouseenter="sventerorleave(10,1)" @mouseleave="sventerorleave(10,2)">
                            <img src="../assets/ytimages/f-01.png" v-show="fjflag" title="焦距变小"/>
                            <img src="../assets/ytimages/f-02.png" v-show="!fjflag" title="焦距变小"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @click="setYdControl(11)"
                             @mouseenter="sventerorleave(11,1)" @mouseleave="sventerorleave(11,2)">
                            <img src="../assets/ytimages/f+01.png" v-show="fjjflag" title="焦距变大"/>
                            <img src="../assets/ytimages/f+02.png" v-show="!fjjflag" title="焦距变大"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @click="setYdControl(12)"
                             @mouseenter="sventerorleave(12,1)" @mouseleave="sventerorleave(12,2)">
                            <img src="../assets/ytimages/o-01.png" v-show="ojflag" title="光圈缩小"/>
                            <img src="../assets/ytimages/o-02.png" v-show="!ojflag" title="光圈缩小"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @click="setYdControl(13)"
                             @mouseenter="sventerorleave(13,1)" @mouseleave="sventerorleave(13,2)">
                            <img src="../assets/ytimages/o+01.png" v-show="ojjflag" title="光圈变大"/>
                            <img src="../assets/ytimages/o+02.png" v-show="!ojjflag" title="光圈变大"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @click="setYdControl(14)"
                             @mouseenter="sventerorleave(14,1)" @mouseleave="sventerorleave(14,2)">
                            <img src="../assets/ytimages/k-01.png" v-show="kjflag" title="焦点前调"/>
                            <img src="../assets/ytimages/k-02.png" v-show="!kjflag" title="焦点前调"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @click="setYdControl(15)"
                             @mouseenter="sventerorleave(15,1)" @mouseleave="sventerorleave(15,2)">
                            <img src="../assets/ytimages/k+01.png" v-show="kjjflag" title="焦点后调"/>
                            <img src="../assets/ytimages/k+02.png" v-show="!kjjflag" title="焦点后调"/>
                        </div>
                        <div class="col-lg-10 col-xs-10 col-md-10">
                            <!--                                <el-slider v-model="valuebjsp" :min="0" :max="15" @change="changebjsp" :label="变焦速度"></el-slider>-->

                        </div>
                        <div class="col-lg-2 col-xs-2 col-md-2"></div>
                        <!--                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(16,1)" @mouseleave="sventerorleave(16,2)">-->
                        <!--                            <img src="../assets/ytimages/d-01.png" v-show="dflag"/>-->
                        <!--                            <img src="../assets/ytimages/d-02.png" v-show="!dflag"/>-->
                        <!--                        </div>-->
                        <!--                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(17,1)" @mouseleave="sventerorleave(17,2)">-->
                        <!--                            <img src="../assets/ytimages/yk-01.png" v-show="ykflag"/>-->
                        <!--                            <img src="../assets/ytimages/yk-02.png" v-show="!ykflag"/>-->
                        <!--                        </div>-->
                    </div>
                </div>
                <div class="col-lg-2 col-xs-1 col-md-1"></div>
            </div>
            <div class="row">

                <div class="col-lg-2 col-xs-2 col-md-2">

                </div>
                <div class="col-lg-8 col-xs-8 col-md-8" style="border-top:solid 1px #ECECEC;">
                    <div class="row" style="margin-top:3%;">
                        <div class="col-lg-3 col-xs-4 col-md-4">
                            <input class="form-control" value="0" id="bjspeed"/>
                        </div>
                        <div class="col-lg-3 col-xs-3 col-md-3" style="margin-top:-1%;">
                            <div class="row">
                                <img src="../assets/ytimages/up-01.png" v-show="upflag" @click="changebjsp(1)"/>
                                <img src="../assets/ytimages/up-02.png" v-show="!upflag"/>
                            </div>
                            <div class="row">
                                <img src="../assets/ytimages/down-01.png" v-show="downflag" @click="changebjsp(2)"/>
                                <img src="../assets/ytimages/down-02.png" v-show="!downflag"/>
                            </div>

                        </div>
                        <div class="col-lg-6 col-xs-5 col-md-5">
                            <button type="button" class="btn btn-primary"
                                    @click.prevent="setYdControl(0)">
                                <i class="fa fa-play"></i> 设置变焦速度
                            </button>
                        </div>
                    </div>


                </div>
                <div class="col-lg-2 col-xs-2 col-md-2">


                </div>
            </div>
        </div>
    </FormDlg>
</template>

<script>
    import $ from 'jquery'
    import FormDlg from 'components/FormDlg.vue'

    export default {
        data() {
            return {
                form: this.defForm(),
                zsflag: false,
                sflag: false,
                ysflag: false,
                zflag: false,
                sxflag: false,
                yflag: false,
                yxflag: false,
                xflag: false,
                zxflag: false,
                fjflag: false,
                fjjflag: false,
                ojflag: false,
                ojjflag: false,
                kjflag: false,
                kjjflag: false,
                dflag: false,
                ykflag: false,
                upflag: true,
                downflag: false,
                valuesp: 0,
                speed: 0,
                valuebjsp: 0,
                bjspeed: 0,
                deviceId: '',
                channelId: '',
            }
        },
        components: {
            FormDlg
        },
        mounted() {
            $("#liveyuntai").find("div.modal-footer").remove();
        },
        methods: {
            defForm() {
                return {
                    deviceId: '',
                    channelId: '',
                    d_gb_id: '',
                }
            },
            onHide() {
                this.$emit("hide");
            },
            onShow() {
                this.$emit("show");
            },
            async show(data) {
                this.channelId = data.channelId;
                this.deviceId = data.deviceId;
                this.d_gb_id = data.d_gb_id;
                this.$nextTick(() => {
                    this.$refs['dlg'].show();
                })
            },
            setYdControl(val) {
                var self = this;
                var vertical = 0;
                var zoom = 0;
                var horizontal = 0;
                var aperture = 0;
                var focus = 0;
                if (val == 1) {
                    vertical = 1;
                    horizontal = 1;
                    if (self.isMobile()) {
                        self.zsflag = false;
                    }
                } else if (val == 2) {
                    horizontal = 1;
                    if (self.isMobile()) {
                        self.sflag = false;
                    }
                } else if (val == 3) {
                    horizontal = 2;
                    vertical = 1;
                    if (self.isMobile()) {
                        self.ysflag = false;
                    }
                } else if (val == 4) {
                    horizontal = 1;
                    if (self.isMobile()) {
                        self.zflag = false;
                    }
                } else if (val == 6) {
                    horizontal = 2;
                    if (self.isMobile()) {
                        self.yflag = false;
                    }
                } else if (val == 7) {
                    horizontal = 1;
                    vertical = 2;
                    if (self.isMobile()) {
                        self.zxflag = false;
                    }
                } else if (val == 8) {
                    vertical = 2;
                    if (self.isMobile()) {
                        self.xflag = false;
                    }
                } else if (val == 9) {
                    horizontal = 2;
                    vertical = 2;
                    if (self.isMobile()) {
                        self.yxflag = false;
                    }
                } else if (val == 10) {
                    zoom = 2;
                    if (self.isMobile()) {
                        self.fjflag = false;
                    }
                } else if (val == 11) {
                    zoom = 1;
                    if (self.isMobile()) {
                        self.fjjflag = false;
                    }
                } else if (val == 12) {
                    aperture = 2;
                    if (self.isMobile()) {
                        self.ojflag = false;
                    }
                } else if (val == 13) {
                    aperture = 1;
                    if (self.isMobile()) {
                        self.ojjflag = false;
                    }
                } else if (val == 14) {
                    focus = 2;
                    if (self.isMobile()) {
                        self.kjflag = false;
                    }
                } else if (val == 15) {
                    focus = 1;
                    if (self.isMobile()) {
                        self.kjjflag = false;
                    }
                }
                $.get(self.$store.state.baseUrl + "/yuntab", {
                    d_gb_id: self.d_gb_id,
                    gb_id: self.channelId,
                    vertical: vertical,
                    zoom: zoom,
                    focus: focus,
                    aperture: aperture,
                    horizontal: horizontal,
                    zoom_level: self.bjspeed,
                    horizontal_level: self.speed,
                    vertica_level: self.speed
                })
                    .then(ret => {
                        // this.$message({
                        //     type: 'success',
                        //     message: "操作成功！"
                        // })
                    })
                    .always(() => {

                    });
            },

            changebjsp(val) {
                if (val == 1) {
                    if (this.bjspeed == 14) {
                        this.upflag = false;
                    } else {
                        this.upflag = true;
                    }
                    this.downflag = true;
                    this.bjspeed = this.bjspeed + 1;
                } else {
                    if (this.bjspeed == 1) {
                        this.downflag = false;
                    } else {
                        this.downflag = true;
                    }
                    this.upflag = true;
                    this.bjspeed = this.bjspeed - 1;
                }
                $("#bjspeed").val(this.bjspeed);
                // this.setYdControl(0);
            },
            changesp(index) {
                this.speed = index;
                this.setYdControl(0);
            },
            sventerorleave(val, type) {
                var self = this;
                if (val == 1) {
                    if (type == 1) {
                        self.zsflag = true;
                    } else {
                        self.zsflag = false;
                    }

                } else if (val == 2) {
                    if (type == 1) {
                        self.sflag = true;
                    } else {
                        self.sflag = false;
                    }

                } else if (val == 3) {
                    if (type == 1) {
                        self.ysflag = true;
                    } else {
                        self.ysflag = false;
                    }

                } else if (val == 4) {
                    if (type == 1) {
                        self.zflag = true;
                    } else {
                        self.zflag = false;
                    }

                } else if (val == 5) {
                    if (type == 1) {
                        self.sxflag = true;
                    } else {
                        self.sxflag = false;
                    }

                } else if (val == 6) {
                    if (type == 1) {
                        self.yflag = true;
                    } else {
                        self.yflag = false;
                    }

                } else if (val == 7) {
                    if (type == 1) {
                        self.zxflag = true;
                    } else {
                        self.zxflag = false;
                    }

                } else if (val == 8) {
                    if (type == 1) {
                        self.xflag = true;
                    } else {
                        self.xflag = false;
                    }

                } else if (val == 9) {
                    if (type == 1) {
                        self.yxflag = true;
                    } else {
                        self.yxflag = false;
                    }

                } else if (val == 10) {
                    if (type == 1) {
                        self.fjflag = true;
                    } else {
                        self.fjflag = false;
                    }

                } else if (val == 11) {
                    if (type == 1) {
                        self.fjjflag = true;
                    } else {
                        self.fjjflag = false;
                    }

                } else if (val == 12) {
                    if (type == 1) {
                        self.ojflag = true;
                    } else {
                        self.ojflag = false;
                    }

                } else if (val == 13) {
                    if (type == 1) {
                        self.ojjflag = true;
                    } else {
                        self.ojjflag = false;
                    }

                } else if (val == 14) {
                    if (type == 1) {
                        self.kjflag = true;
                    } else {
                        self.kjflag = false;
                    }

                } else if (val == 15) {
                    if (type == 1) {
                        self.kjjflag = true;
                    } else {
                        self.kjjflag = false;
                    }

                } else if (val == 16) {
                    if (type == 1) {
                        self.dflag = true;
                    } else {
                        self.dflag = false;
                    }

                } else if (val == 17) {
                    if (type == 1) {
                        self.ykflag = true;
                    } else {
                        self.ykflag = false;
                    }

                }
            }
        }
    }
</script>
<style>
    .ytbtnmenu {
        width: 100%;
        height: 30px;
    }

    .ytbtnmenut {
        width: 100%;
        height: 100%;
    }

    .ytbtnmenurf {
        width: 150%;
        position: relative;
        z-index: 999;
        margin-left: -25%;
        margin-top: -26%;
        margin-bottom: -50%;
    }

    .divmd {
        margin: 0;
        padding: 0;
    }
</style>

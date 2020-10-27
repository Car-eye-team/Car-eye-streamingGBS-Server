<template>
    <FormDlg title="云台控制" @hide="onHide" @show="onShow" ref="dlg" :disabled="errors.any()">
        <div class="row">
            <div class="col-lg-12 col-xs-12 col-md-12">
                <div class="col-lg-3 col-xs-3 col-md-3">
                </div>
                <div class="col-lg-2 col-xs-3 col-md-3">
                    <div class="row">
                        <div class="row">
                            <div class="col-lg-offset-2 col-lg-3 col-xs-4 col-md-4 divmd" @click="setYdControl(1)" @mouseenter="sventerorleave(1,1)" @mouseleave="sventerorleave(1,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/zs-01.png" v-show="zsflag"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/zs-02.png" v-show="!zsflag"/>
                            </div>
                            <div class="col-lg-3 col-xs-4 col-md-4 divmd" @mouseenter="sventerorleave(2,1)" @mouseleave="sventerorleave(2,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/s-01.png" v-show="sflag"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/s-02.png" v-show="!sflag"/>
                            </div>
                            <div class="col-lg-offset-1 col-lg-3 col-xs-4 col-md-4 divmd" @mouseenter="sventerorleave(3,1)" @mouseleave="sventerorleave(3,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/ys-01.png" v-show="ysflag"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/ys-02.png" v-show="!ysflag"/>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-offset-2 col-lg-3 col-xs-4 col-md-4 divmd" @mouseenter="sventerorleave(4,1)" @mouseleave="sventerorleave(4,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/z-01.png" v-show="zflag"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/z-02.png" v-show="!zflag"/>
                            </div>
                            <div class="col-lg-3 col-xs-4 col-md-4 divmd">
<!--                                <img class="ytbtnmenurf" src="../assets/ytimages/sx-01.png" v-show="sxflag"/>-->
<!--                                <img class="ytbtnmenurf" src="../assets/ytimages/sx-02.png" v-show="!sxflag"/>-->
                            </div>
                            <div class="col-lg-offset-1 col-lg-3 col-xs-4 col-md-4 divmd" @mouseenter="sventerorleave(6,1)" @mouseleave="sventerorleave(6,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/y-01.png" v-show="yflag"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/y-02.png" v-show="!yflag"/>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-offset-2 col-lg-3 col-xs-4 col-md-4 divmd" @mouseenter="sventerorleave(7,1)" @mouseleave="sventerorleave(7,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/zx-01.png" v-show="zxflag"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/zx-02.png" v-show="!zxflag"/>
                            </div>
                            <div class="col-lg-3 col-xs-4 col-md-4 divmd" @mouseenter="sventerorleave(8,1)" @mouseleave="sventerorleave(8,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/x-01.png" v-show="xflag"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/x-02.png" v-show="!xflag"/>
                            </div>
                            <div class="col-lg-offset-1 col-lg-3 col-xs-4 col-md-4 divmd" @mouseenter="sventerorleave(9,1)" @mouseleave="sventerorleave(9,2)">
                                <img class="ytbtnmenu" src="../assets/ytimages/yx-01.png" v-show="yxflag"/>
                                <img class="ytbtnmenu" src="../assets/ytimages/yx-02.png" v-show="!yxflag"/>
                            </div>
                        </div>
                        <div class="row">

                        </div>
                    </div>
                </div>
                <div class="col-lg-1 col-xs-1 col-md-1"></div>
                <div class="col-lg-4 col-xs-4 col-md-4">
                    <div class="row">
                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(10,1)" @mouseleave="sventerorleave(10,2)">
                            <img src="../assets/ytimages/f-01.png" v-show="fjflag"/>
                            <img src="../assets/ytimages/f-02.png" v-show="!fjflag"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(11,1)" @mouseleave="sventerorleave(11,2)">
                            <img src="../assets/ytimages/f+01.png" v-show="fjjflag"/>
                            <img src="../assets/ytimages/f+02.png" v-show="!fjjflag"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(12,1)" @mouseleave="sventerorleave(12,2)">
                            <img src="../assets/ytimages/o-01.png" v-show="ojflag"/>
                            <img src="../assets/ytimages/o-02.png" v-show="!ojflag"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(13,1)" @mouseleave="sventerorleave(13,2)">
                            <img src="../assets/ytimages/o+01.png" v-show="ojjflag"/>
                            <img src="../assets/ytimages/o+02.png" v-show="!ojjflag"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(14,1)" @mouseleave="sventerorleave(14,2)">
                            <img src="../assets/ytimages/k-01.png" v-show="kjflag"/>
                            <img src="../assets/ytimages/k-02.png" v-show="!kjflag"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(15,1)" @mouseleave="sventerorleave(15,2)">
                            <img src="../assets/ytimages/k+01.png" v-show="kjjflag"/>
                            <img src="../assets/ytimages/k+02.png" v-show="!kjjflag"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(16,1)" @mouseleave="sventerorleave(16,2)">
                            <img src="../assets/ytimages/d-01.png" v-show="dflag"/>
                            <img src="../assets/ytimages/d-02.png" v-show="!dflag"/>
                        </div>
                        <div class="col-lg-6 col-xs-6 col-md-6" @mouseenter="sventerorleave(17,1)" @mouseleave="sventerorleave(17,2)">
                            <img src="../assets/ytimages/yk-01.png" v-show="ykflag"/>
                            <img src="../assets/ytimages/yk-02.png" v-show="!ykflag"/>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-xs-1 col-md-1"></div>
            </div>
            <div class="row">

                <div class="col-lg-3 col-xs-3 col-md-3">
                </div>
                <div class="col-lg-6 col-xs-6 col-md-6">
                    <div class="row" style="width: 100%;">
                        <el-slider v-model="valuesp" :min="0" :max="255" @change="changesp" show-input></el-slider>
                    </div>
                </div>
                <div class="col-lg-3 col-xs-3 col-md-3">

                    <button type="button" class="btn btn-primary"
                            @click.prevent="setYdControl(10)">
                        <i class="fa fa-play"></i> 设置
                    </button>
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
                zsflag:false,
                sflag:false,
                ysflag:false,
                zflag:false,
                sxflag:false,
                yflag:false,
                yxflag:false,
                xflag:false,
                zxflag:false,
                fjflag:false,
                fjjflag:false,
                ojflag:false,
                ojjflag:false,
                kjflag:false,
                kjjflag:false,
                dflag:false,
                ykflag:false,
                valuesp:0,
                speed:0
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
                }
            },
            onHide() {
                this.$emit("hide");
            },
            onShow() {
                this.$emit("show");
            },
            async show(data) {
                if(data) {
                    Object.assign(this.form, data);
                }
                this.$nextTick(() => {
                    this.$refs['dlg'].show();
                })
            },
            setYdControl(val){

            },
            changesp(index) {
                this.speed = index;
                this.setYdControl(0);
            },
            sventerorleave(val,type){
                var self = this;
                if(val==1){
                    if(type==1){
                        self.zsflag = true;
                    }else{
                        self.zsflag = false;
                    }

                }else if(val==2){
                    if(type==1){
                        self.sflag = true;
                    }else{
                        self.sflag = false;
                    }

                }else if(val==3){
                    if(type==1){
                        self.ysflag = true;
                    }else{
                        self.ysflag = false;
                    }

                }else if(val==4){
                    if(type==1){
                        self.zflag = true;
                    }else{
                        self.zflag = false;
                    }

                }else if(val==5){
                    if(type==1){
                        self.sxflag = true;
                    }else{
                        self.sxflag = false;
                    }

                }else if(val==6){
                    if(type==1){
                        self.yflag = true;
                    }else{
                        self.yflag = false;
                    }

                }else if(val==7){
                    if(type==1){
                        self.zxflag = true;
                    }else{
                        self.zxflag = false;
                    }

                }else if(val==8){
                    if(type==1){
                        self.xflag = true;
                    }else{
                        self.xflag = false;
                    }

                }else if(val==9){
                    if(type==1){
                        self.yxflag = true;
                    }else{
                        self.yxflag = false;
                    }

                }else if(val==10){
                    if(type==1){
                        self.fjflag = true;
                    }else{
                        self.fjflag = false;
                    }

                }else if(val==11){
                    if(type==1){
                        self.fjjflag = true;
                    }else{
                        self.fjjflag = false;
                    }

                }else if(val==12){
                    if(type==1){
                        self.ojflag = true;
                    }else{
                        self.ojflag = false;
                    }

                }else if(val==13){
                    if(type==1){
                        self.ojjflag = true;
                    }else{
                        self.ojjflag = false;
                    }

                }else if(val==14){
                    if(type==1){
                        self.kjflag = true;
                    }else{
                        self.kjflag = false;
                    }

                }else if(val==15){
                    if(type==1){
                        self.kjjflag = true;
                    }else{
                        self.kjjflag = false;
                    }

                }else if(val==16){
                    if(type==1){
                        self.dflag = true;
                    }else{
                        self.dflag = false;
                    }

                }else if(val==17){
                    if(type==1){
                        self.ykflag = true;
                    }else{
                        self.ykflag = false;
                    }

                }
            }
        }
    }
</script>
<style>
    .ytbtnmenu{
        width:100%;
        height:30px;
    }
    .ytbtnmenut{
        width:100%;
        height:100%;
    }
    .ytbtnmenurf{
        width: 150%;
        position: relative;
        z-index: 999;
        margin-left: -25%;
        margin-top: -26%;
        margin-bottom: -50%;
    }
    .divmd{
        margin:0;padding: 0;
    }
</style>

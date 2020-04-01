<template>
    <div class="game" :style="{'height': windowHeight + 'px'}">
        <img class="bg" src="http://img1.40017.cn/cn/s/2020/zt/touch/200320/bg2.png?v=1">
        <div class="rules">
            <a @click="rulesLink"></a>
            <a @click="rankLink"></a>
        </div>
        <div class="start">
            <div class="btn" :class="{'btn--animation': !showTiming}" @click="timingFn"></div>
        </div>

        <!-- 提示弹框 -->
        <div class="showErrBox">
            <div class="showErr"></div>
        </div>
    </div>
</template>

<style lang="less">
@import '../styles/index.less';
</style>

<script>
import pageData from '../scripts/data'
import * as utils from '@/utils'
import * as pageFn from '../scripts/index'
import md5 from '@/utils/md5'
import * as services from '../scripts/services'

let AppInfo = {
    isAPP: null, // 是否客户端打开
    cityID: null // 城市ID
};

export default {
    data() {
        return pageData
    },
    created() {
        this.init();
    },
    methods: {
        // 跳转地址到邮寄信息
        mailLink(){
            // pageFn.mainLink(this, 'mail')
        },
        // 判断是否需要登陆
        checkLogin(){
            // pageFn.checkLogin(this)
        },
        // 说明地址
        rulesLink(){
            var url = "https://www.ly.com/scenery/zhuanti/2020antiviralrules?spm=" + this.spm + "&refid=" + this.refid
            if (this.isWx) {
                if (this.isxcx) {
                    url = url + "&isxcx=1";
                }
                // window.location.href = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + encodeURIComponent(url);
            } else {
                // window.location.href = url
            }
            window.location.href = url
        },
        // 排行榜地址
        rankLink(){
            var overTime = new Date('2020/04/09 23:59:59').getTime(), nowTime = new Date().getTime()
            if (nowTime > overTime) {
                this.popFn('排行榜数据统计中，最晚4月10号18:00前公布')
                return
            }

            var url = "https://www.ly.com/scenery/zhuanti/2020antiviralrank?spm=" + this.spm + "&refid=" + this.refid
            if (this.isWx) {
                if (this.isxcx) {
                    url = url + "&isxcx=1";
                }
                window.location.href = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + encodeURIComponent(url);
            } else {
                window.location.href = url
            }
        },
        timingFn(){},
        // 初始化
        init() {
            var that = this
            var AppNewSpm = utils.getQueryString('tcwebtag')
            utils.TongChengInfo(function (data) {
                // console.log(1)
                AppInfo.isAPP = data.isTc
                AppInfo.cityID = data.cid
                if (AppInfo.isAPP) {
                    that.isTc = true;
                    if (data.memberId) {
                        that.memberId = data.memberId
                        that.wxunionid = data.unionId
                        that.nickname = data.userName
                        that.avatarurl = data.headImg
                    }
                } else {
                    if ($.cookie('us')) {
                        var uMemberIDRight = $.cookie('us').split('=')[1]
                        var uId = uMemberIDRight.split('&')[0]
                        that.memberId = uId ? uId : ''
                    }
                }
                pageFn.allInit(that,{id: that.zId, AppInfo, AppNewSpm},(val)=>{
                    console.log(val)
                    if(val){
                        // that.checkLogin()
                    }
                })
            });
        },
        // 邮寄信息填写
        changeInput(e) {
            const { value } = e.target;
            const { param } = e.currentTarget.dataset;
            this[param] = value
        },
        inputFocus() {
            // this.isBlur = false;
        },
        inputBlur() {
            // this.isBlur = true;
        },

        

    }
}
</script>
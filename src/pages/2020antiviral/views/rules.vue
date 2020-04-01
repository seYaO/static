<template>
    <div class="rules" :style="{'min-height': windowHeight + 'px'}">
        <!-- loading蒙层 -->
        <div class="loading" v-show="loading">
            <img src="//img1.40017.cn/cn/s/c/2016/loading.gif">&nbsp;&nbsp;&nbsp;正在加载中...
        </div>
        <!-- 头图 44764-->
        <div class="top">
            <img :src="topImagUrlRules">
        </div>
        <div class="title">
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-tit1.png" />
        </div>
        <div class="intro">
            <p>“点击开始”进入游戏界面，点击病毒即可得分，找到病毒数越多，得分越高，记录用户的最高得分。</p>
        </div>
        <div class="title">
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-tit2.png" />
        </div>
        <div class="intro">
            <p>即日起至2020年4月9日23:59:59，活动结束后最终进入"排行榜top10的玩家"。将会获得专属奖品，分数相同的玩家根据时间先后排名。</p>
            <p style="color: #ffe013;">* 本次活动严格禁止恶意刷分行为，一经查证，直接取消本次活动参加资格；</p>
            <p style="color: #ffe013;">* 活动结束后，会再次对榜单玩家进行核查，若最终榜单仍存在刷分玩家，将取消其资格并顺延奖励</p>
        </div>
        <div class="title">
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-tit3.png" />
        </div>
        <div class="subtit top1">
            <div class="bb">
                <h3 class="h3">华为mate30<span class="txt">【4G全网通版(6G+128G)】</span></h3>
            </div>
        </div>
        <div class="section">
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-img1.png" />
        </div>
        <div class="subtit top2">
            <div class="bb"><h3 class="h3">小米空气净化器2S+仙都景区门票1张</h3></div>
        </div>
        
        <div class="section">
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-img2.png" />
        </div>
        <div class="subtit top3">
            <div class="bb"><h3 class="h3">苏泊尔球釜4L压力电饭煲+仙都景区门票1张</h3></div>
            <span class="txt">(不含景交)</span>
        </div>
        <div class="section">
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-img3.png" />
        </div>
        <div class="subtit">
            <div class="bb"><h3 class="h3">第4名：小米手环4代+仙都景区门票1张 <span class="txt">(不含景交)</span></h3></div>
        </div>
        <div class="section">
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-img4.png" />
        </div>
        <div class="section"></div>
        <div class="section"><div class="divider"></div></div>
        <div class="section"></div>
        <div class="section">
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-img5.png" />
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-img6.png" />
        </div>
        <div class="section"></div>
        <div class="section">
            <img src="//img1.40017.cn/cn/s/2020/zt/touch/200320/rules-img7.png" />
        </div>
        <div class="placeholder"></div>
        <div class="bottom-btn-box">
            <div class="more"><span v-if="!isMove">下滑查看更多</span></div>
            <div class="btns">
                <a href="https://m.ly.com/scenery_1/detail/?sceneryId=2851"></a>
                <a @click="mainLink"></a>
            </div>
        </div>
    </div>
</template>

<style lang="less">
@import '../styles/rules.less';
</style>

<script>
import pageData from '../scripts/data'
import * as utils from '@/utils'
import * as pageFn from '../scripts/index'

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
    mounted() {
        window.addEventListener('scroll', this.isScroll)
    },
    methods: {
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
                pageFn.allInit(that,{id: that.zId, AppInfo, AppNewSpm})
            });
        },

        isScroll() {
            this.srcoll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (this.srcoll > 10) {
                this.isMove = true
            } 
        },

        // 跳转地址到邮寄信息
        mainLink(){
            pageFn.mainLink(this)
        }

    }
}
</script>
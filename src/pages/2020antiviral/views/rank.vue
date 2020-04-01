<template>
    <div class="ranking" :style="{'min-height': windowHeight + 'px'}">rank
        <!-- loading蒙层 -->
        <div class="loading" v-show="loading">
            <img src="//img1.40017.cn/cn/s/c/2016/loading.gif">&nbsp;&nbsp;&nbsp;正在加载中...
        </div>
        <!-- 头图 44764-->
        <div class="top">
            <img :src="topImagUrlRanking">
        </div>
        <div class="intro">
            <img class="tableimg" :src="topImagUrlTable">
            <div class="loader" v-show="rankList && rankList.length == 0">
                <img src="//img1.40017.cn/cn/s/c/2016/loading.gif">&nbsp;&nbsp;&nbsp;正在加载中...
            </div>
            <div class="noSource" v-show="!rankList">暂无资源~~</div>
            <ul class="list" v-if="rankList && rankList.length>0">
                <li class="rank" :class="{me: item.Ranking == meInfo.Ranking}" v-for="(item,index) in rankList" :key="index">
                    <div class="bg"></div>
                    <div class="box">
                        <img class="num" :src="'//img1.40017.cn/cn/s/2020/zt/touch/200320/ranking-num'+item.Ranking+'.png'">
                        <img class="avatar" :src="item.Avatar">
                        <div class="txt ellipsis">{{item.NickName}}</div>
                        <div class="score">{{item.Score}}</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="placeholder"></div>
        <div class="bottom-btn-box">
            <div class="btns">
                <a @click="mailLink"></a>
            </div>
        </div>
    </div>
</template>

<style lang="less">
@import '../styles/ranking.less';
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
    methods: {
        // 跳转地址到邮寄信息
        mailLink(){
            pageFn.mainLink(this, 'mail')
        },
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
                    // console.log(val)
                    if(val){
                        pageFn.gameTopListFn(that)
                    }
                })
            });
        },  

    }
}
</script>
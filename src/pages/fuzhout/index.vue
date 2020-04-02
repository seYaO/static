<template>
    <div class="app">
        <!-- loading蒙层 -->
        <div class="loading" v-show="loading">
            <img src="//img1.40017.cn/cn/s/c/2016/loading.gif">&nbsp;&nbsp;&nbsp;正在加载中...
        </div>
        <!-- 头图 44764-->
        <div class="top">
            <img :src="topImagUrl">
        </div>

        <!-- 千万红包大派送(46126|46127) -->
        <div class="section section1">
            <div class="title">
                <img src="https://img1.40017.cn/cn/s/2020/zt/touch/200326/tit1.png">
                <!-- <div class="subtit">购买福州市在线支付可用</div> -->
            </div>
            <div class="box_content">
                <ul class="readcards">
                    <li class="readcard" v-for="(item,index) in redlist" :key="index">
                        <div class="package">
                            <div class="pirce">
                                <i class="yuan">￥</i>
                                <em class="money">{{item.red}}</em>
                            </div>
                            <div class="value">{{isWx ? '门票卡券' : '门票红包'}}</div>
                            <div class="txt">福州景点专享红包</div>
                            <div class="btn" :class="{disable: item.isGet}">{{item.isGet ? '已领取' : '立即领取'}}</div>
                            <div class="overflow" @click="checkLogin(index)"></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 约惠春天景点门票(46128) -->
        <div class="section section2" v-if="sectionData2">
            <div class="title">
                <img src="https://img1.40017.cn/cn/s/2020/zt/touch/200326/tit2.png">
            </div>
            <div class="box_content">
                <div class="loader" v-show="sectionData2 && sectionData2.length == 0">
                    <img src="//img1.40017.cn/cn/s/c/2016/loading.gif">&nbsp;&nbsp;&nbsp;正在加载中...
                </div>
                <div class="noSource" v-show="!sectionData2">暂无资源~~</div>
                <ul v-if="sectionData2 && sectionData2.length>0" class="jdList source">
                    <a class="sourceItem" v-for="(item,index) in sectionData2" :key="index" @click="windowLocationHref('detail',item,index)">
                        <div class="left">
                            <img class="img" :src="setImageSize(item.SceneryImg,'280x140')">
                        </div>
                        <div class="right">
                            <h2 class="tit multi-ellipsis--l2">{{item.SceneryName}}</h2>
                            <div class="priceInfo">
                                <div class="price">
                                    <i class="yuan">￥</i>
                                    <em class="money">{{item.AmountAdvance}}</em>
                                    <i class="qi">起</i>
                                </div>
                            </div>
                            <div class="buttons">
                                <div class="btn" @click.stop="windowLocationHref('order',item,index)">立即抢购</div>
                            </div>
                        </div>
                    </a>
                </ul>
            </div>
            
        </div>

        <!-- 成功 -->
        <div class="dialog" v-show="showSuccess">
            <div class="dialog-cont dialog-success">
                <img class="dialog-cont-bg" src="http://img1.40017.cn/cn/s/2020/zt/touch/200326/dialog-bg.png">
                <div class="close" @click="showSuccess=false"></div>
                <div class="success-intro" v-if="dialogInfo">
                    <div class="tit">领取成功！</div>
                    <div class="tx1">福州市文化和旅游局送您{{dialogInfo.red}}元门票红包！</div>
                    <div class="tx2">有福之州，幸福之城，带您畅游福州！</div>
                    <div class="card">
                        <div class="pirce">
                            <i class="yuan">￥</i>
                            <em class="money">{{dialogInfo.red}}</em>
                        </div>
                        <ul class="tips">
                            <li>福州景点专享红包</li>
                            <li>{{dialogInfo.total}}</li>
                            <li>领取后15天内有效</li>
                        </ul>
                    </div>
                    <div class="desc">{{isWx ? redpackage.wechatDesc : redpackage.appDesc}}</div>
                </div>
                
            </div>
        </div>

        <!-- 失败 -->
        <div class="dialog" v-show="showFailure">
            <div class="dialog-cont dialog-failure">
                <div class="close" @click="showFailure=false"></div>
                <div class="failure-intro">
                    <div class="tit">啊哦~</div>
                    <div class="txt">红包与您擦肩而过</div>
                    <div class="txt">重新领取一次吧！</div>
                    <img class="icon" src="http://img1.40017.cn/cn/s/2020/zt/touch/200326/dialog-txt.png">
                    <div class="btn" @click="checkLogin(selectIdx)">重新领取</div>
                </div>  
            </div>
        </div>

        <div class="footer" v-if="isxcx"></div>
        <div class="foot1" v-else>@同程旅游2019</div>

    </div>
</template>

<style lang="less">
@import '../../styles/common.less';
@import '../../styles/dialog.less';
@import '../../styles/card.less';
@import '../../styles/source.less';
@import './styles/index.less';
</style>

<script>
import pageData from './js/data'
import * as pageFn from './js/index'
import * as utils from '@/utils'

let AppInfo = {
    isAPP: null, // 是否客户端打开
    cityID: null // 城市ID
};

export default {
    components: {},
    data() {
        return pageData
    },
    created() {
        this.init();
    },
    beforeMount() {
        // document.title = '产品详情'
    },
    mounted() {
        //  
    },
    updated() {
        // this.getScrollOffset();
    },
    methods: {
        // 图片裁剪
        setImageSize: utils.setImageSize,
        // 跳转页面
        windowLocationHref(type, item, index){
            utils.windowLocationHref(this, type, item, index)
        },
        // 判断是否需要登陆
        checkLogin(idx){
            pageFn.checkLogin(this,idx)
        },
        // 初始化
        init() {
            var that = this
            var AppNewSpm = utils.getQueryString('tcwebtag')
            utils.TongChengInfo(function (data) {
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

                // 页面进来，先判断是否登陆，如果登陆了，看之前有没有领取过红包
                if (that.memberId && !that.isxcx) {
                    utils.isGetRedpackage(this)
                }
            });
        },
           
    }
}
</script>


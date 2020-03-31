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
                    <a class="sourceItem" v-for="(item,index) in sectionData2" :key="index" @click="windowLocationHref(null,'detail',item,index)">
                        <div class="left">
                            <img class="img" :src="setImageSize(item.SceneryImg,'280x140')">
                        </div>
                        <div class="right">
                            <h2 class="tit multi-ellipsis--l2">{{item.SceneryName}}</h2>
                            <!-- <h2 class="tit multi-ellipsis--l2">{{item.BCTTicketName}}</h2> -->
                            <div class="priceInfo">
                                <div class="price">
                                    <i class="yuan">￥</i>
                                    <em class="money">{{item.AmountAdvance}}</em>
                                    <i class="qi">起</i>
                                </div>
                            </div>
                            <div class="buttons">
                                <div class="btn" @click.stop="windowLocationHref(null,'order',item,index)">立即抢购</div>
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

    </div>
</template>

<style lang="less">
@import '../../styles/common.less';
@import './styles/index.less';
</style>

<script>
import pageData from './js/data'
import * as pageFn from './js/index'
// import validate from '@/utils/validate'
import config from './js/config'
import * as utils from '@/utils'
import services from '@/utils/services'

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
        
        // console.log(validate.isempty(this))
    },
    updated() {
        // this.getScrollOffset();
    },
    methods: {
        // 图片裁剪
        setImageSize: utils.setImageSize,
        // 跳转页面
        // windowLocationHref: utils.windowLocationHref,
        // 判断之前有没有领过红包
        isGetHB: utils.isGetRedpackage,
        // 领取红包
        getHB: utils.getRedpackage,
        // 验证卡券是否领取
        hasGetCard: utils.hasGetWechatcard,
        // 领取卡券
        getCard: utils.getWechatcard,
        // 获取链接参数
        // getPara: pageFn.getPara,
        // 数据初始化
        // initData: pageFn.initData,
        // 资源异步
        allAjax: pageFn.allAjax,
        // 判断是否需要登陆
        // checkLogin: pageFn.checkLogin.bind(this),
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
                // allInit.init(that.zId);
                allInit(that.zId)

                // 页面进来，先判断是否登陆，如果登陆了，看之前有没有领取过红包
                if (that.memberId && !that.isxcx) {
                    that.isGetHB()
                }
            });

            function allInit(id){
                window.setRefId.isAjaxGetRef=true;
                window.setRefId.ChannelID=id;
                window.setRefId.isChange=false;
                window.setRefId.uTagName='.app a';
                window.setRefId.tagValue='href';
                window.setRefId.doRefid=function(dataAndRefid){
                    // console.log(3)
                    //Hellow world~   所有的一切从这里开始
                    var newRefid = dataAndRefid[0]
                    var newSpm = dataAndRefid[1]
                    if (AppInfo.isAPP) {
                        that.addHtml = AppNewSpm ?
                            '|' + AppNewSpm + '&refid=' + newRefid :
                            '&refid=' + newRefid
                    } else {
                        that.addHtml =
                            newSpm.indexOf('|') > 0 ?
                                '|' + newSpm.split('|')[0] + '&refid=' + newRefid :
                                '&refid=' + newRefid
                    }
                    that.getPara(newSpm, newRefid)
                }
                window.setRefId.init();
            }
        },
        getPara(spm, refid) {
            // console.log(utils.getQueryString('refid') ? utils.getQueryString('refid') : refid)
            refid = utils.getQueryString('refid') ? utils.getQueryString('refid') : refid
            spm = utils.getQueryString('spm') ? utils.getQueryString('spm') : spm
            this.refid = refid
            this.spm = spm

            if (this.isxcx) { // 小程序分享
                utils.setMiniappShare({ spm: this.spm, refid: this.refid })
            } else {
                utils.setShare(config.shareInfo)
            }

            if (utils.getQueryString("wxparam")) {
                var URLArgues = JSON.parse(
                    decodeURIComponent(utils.getQueryString("wxparam"))
                );
                this.wxopenid = URLArgues.openid;
                this.wxunionid = URLArgues.unionid;
                this.nickname = URLArgues.nickname;
                this.avatarurl = URLArgues.headimgurl;
                // console.log(URLArgues)
            }

            if (this.isWx) {
                this.hasGetCard(); // 小程序券
            }


            // 判断是否需要登陆
            // utils.checkLogin(this)
            this.initData();
        },
        initData(){
            // 约惠春天景点门票(46128)
            this.allAjax(this, '46128', 2, '', 1, 100);
        },
        windowLocationHref(event, type, item, index){
            event = this

            var opts = {
                isTc: event.isTc,
                isWx: event.isWx,
                isxcx: event.isxcx,
                addHtml: event.addHtml,
                spm: event.spm,
                refid: event.refid,
                index: index,
                sceneryId: item.SceneryId,
                priceId: item.BCTTicketId,
                oldPriceId: item.BCTTicketPriceId,
                kurl: item.Kurl,
                wurl: item.Wurl,
                murl: item.Murl
            }
            var detailHref = utils.getDetailLink(opts), orderHref = utils.getOrderLink(opts)
            if (type == 'order') {
                if (event.isxcx) {
                    wx.miniProgram.navigateTo({
                        url: orderHref
                    });
                } else {
                    window.location.href = orderHref
                }
            } else if (type == 'detail') {
                if (event.isxcx) {
                    wx.miniProgram.navigateTo({
                        url: detailHref
                    });
                } else {
                    window.location.href = detailHref
                }

            }
        },
        checkLogin(idx){
            var that = this
            this.showFailure = false;
            this.showSuccess = false;
            utils.checkLogin(this, { url: config.shareInfo.shareUrl }, (isWx) => {
                if (isWx) {
                    that.getCard(null, idx)
                } else {
                    that.getHB(null, idx)
                }
            })
        }
           
    }
}
</script>


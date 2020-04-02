<template>
    <div class="app">
        <!-- loading蒙层 -->
        <div class="loading" v-show="loading">
            <img src="//img1.40017.cn/cn/s/c/2016/loading.gif">&nbsp;&nbsp;&nbsp;正在加载中...
        </div>
        <!-- 头图 44764-->
        <div class="top">
            <video controls="controls" :src="sceneryInfo.videoUrl" :poster="sceneryInfo.videoImg" v-if="sceneryInfo && sceneryInfo.videoUrl"></video>
            <img :src="videoImg" v-else>
            
        </div>
        <!-- 简介(45638) -->
        <div class="section section1" v-if="sectionData1">
            <div class="title" v-if="sceneryInfo" @click="windowLocationHref('detail',sceneryInfo,0)">
                <div class="t" v-if="sceneryInfo">{{sceneryInfo.SceneryName}}</div>
                <img class="icon" src="//img1.40017.cn/cn/s/2020/zt/touch/200311/01.png" />
                <div class="tx1" v-if="sceneryInfo">{{sceneryInfo.ProvinceName}}·{{sceneryInfo.CityName}}</div>
                <img class="arrow" src="//img1.40017.cn/cn/s/2020/zt/touch/200311/02.png" />
            </div>
            <div class="box_content">
                
                <template v-if="sceneryInfo">
                    <div class="sectionCon1" @click="windowLocationHref('detail',sceneryInfo,0)">
                        <img class="left" :src="setImageSize(sceneryInfo.imgUrl,'458x308')">
                        <div class="right">
                            <img :src="setImageSize(sceneryInfo.imgUrl2,'220x148')">
                            <img :src="setImageSize(sceneryInfo.imgUrl3,'220x148')">
                        </div>
                    </div>
                    <div class="sectionCon2">
                        <span class="bold">必去理由：</span>{{sceneryInfo.summary}}
                    </div>
                    
                </template>
                
            </div>
            <div class="sectionCon3">
                <div class="loader" v-show="sectionData1 && sectionData1.length == 0">
                    <img src="//img1.40017.cn/cn/s/c/2016/loading.gif">&nbsp;&nbsp;&nbsp;正在加载中...
                </div>
                <div class="noSource" v-show="!sectionData1">暂无资源~~</div>
                <ul v-if="sectionData1 && sectionData1.length>0" class="jdList source">
                    <a class="sourceItem" v-for="(item,index) in sectionData1" :key="index" @click="windowLocationHref('order',item,index)">
                        <h2 class="tit"><em>景点</em>{{item.BCTTicketName}}</h2>
                        <div class="flex">
                            <div></div>
                            <div class="r">
                                <div class="price">
                                    <i class="yuan">￥</i>
                                    <em class="money">{{item.AmountAdvance}}</em>
                                    <i class="qi">起</i>
                                </div>
                                <img class="arrow" src="https://file.40017.cn/top/minapp/tickets/arrow_down1.png">
                            </div>
                        </div>
                    </a>
                </ul>
            </div>
            
        </div>
        <!-- 验客体验官(45639) -->
        <div class="section section2" v-if="sectionData2">
            <div class="title">
                <div class="t">验客体验官</div> 
            </div>
            <div class="sectionCon4">
                <div class="loader" v-show="sectionData2 && sectionData2.length == 0">
                    <img src="//img1.40017.cn/cn/s/c/2016/loading.gif">&nbsp;&nbsp;&nbsp;正在加载中...
                </div>
                <div class="noSource" v-show="!sectionData2">暂无资源~~</div>
                <ul v-if="sectionData2 && sectionData2.length>0" class="jdList source">
                    <a class="sourceItem" v-for="(item,index) in sectionData2" :key="index">
                        <div class="left">
                            <img class="img" :src="setImageSize(item.SceneryImg,'268x190')">
                        </div>
                        <div class="right" @click="popText(item.Summary)">
                            <h2 class="tit ellipsis">{{item.SceneryName}}</h2>
                            <h3 class="subtit multi-ellipsis--l3">{{item.Summary}}</h3>
                        </div>
                    </a>
                </ul>
            </div>
        </div>
        <!-- 精选游记(45640) -->
        <div class="section section3" v-if="sectionData3">
            <div class="title">
                <div class="t">精选游记</div>
            </div>
            <div class="box_content">
                <div class="loader" v-show="sectionData3 && sectionData3.length == 0">
                    <img src="//img1.40017.cn/cn/s/c/2016/loading.gif">&nbsp;&nbsp;&nbsp;正在加载中...
                </div>
                <div class="noSource" v-show="!sectionData3">暂无资源~~</div>
                <ul v-if="sectionData3 && sectionData3.length>0" class="thList source">
                    <a class="sourceItem" v-for="(item,index) in sectionData3" :key="index" :href="item.Purl">
                        <img class="img" :src="setImageSize(item.SceneryImg,'690x360')">
                        <div class="mask"></div>
                        <div class="tit">
                            <span>{{item.SceneryName}}</span>
                        </div>
                        <div class="nice" v-if="item.BiaoTi">by {{item.BiaoTi}}</div>
                    </a>
                </ul>
            </div>
        </div>
        <!-- 提示弹框 -->
        <div class="showErrBox">
            <div class="showErr"></div>
        </div>

        <div class="footer" v-if="isxcx"></div>
        <div class="foot1" v-else>@同程旅游2019</div>
    </div>
</template>

<style lang="less">
@import '../../styles/common.less';
@import '../../styles/source.less';
@import './styles/index.less';
</style>

<script>
import pageData from './scripts/data'
import * as pageFn from './scripts/index'
import * as utils from '@/utils'

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
        // 图片裁剪
        setImageSize: utils.setImageSize,
        // 跳转页面
        windowLocationHref(type, item, index){
            utils.windowLocationHref(this, type, item, index)
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
                var ids = utils.getQueryString('mdid').split('|')
                pageFn.allInit(that,{id: ids[0], AppInfo, AppNewSpm})
                that.ids = ids
            });
        },
           
    }
}
</script>
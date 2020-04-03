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
        <div class="section">
            <img class="bg" src="//img1.40017.cn/cn/s/2019/zt/touch/200206/box-1.png">
            <div class="intro">
                <div class="text">累计<span class="h">{{total}}</span>人已点击祈福</div>
                <div class="box" id="panel">
                    <div class="mlist" :id="'mlist'+(midx+1)" v-for="(e,midx) in ['','','','']" :key="midx">
                        <div class="marquees">
                            <div class="marquee" v-for="(e,idx) in ['','']" :key="idx">
                                <template v-for="(item,index) in sectionData['sectionData'+(midx+1)]">
                                    <div class="mp" :key="'mp'+index" :style="{ width: item.width + 'px' }"></div>
                                    <div class="data" :key="'data'+index">
                                        <img class="head" :src="item.headImgUrl">
                                        <div>
                                            <div class="name">{{item.nickName}}</div>
                                            <div class="p">{{item.text}}</div>
                                        </div>
                                    </div> 
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="link">
                    <a href="https://www.ly.com/scenery/zhuanti/yxningxiadetail"></a>
                </div>
            </div>
        </div>

        <div class="link1">
            <a href="https://www.ly.com/scenery/zhuanti/shenqih5">
                <img src="//img1.40017.cn/cn/s/2019/zt/touch/200206/link-01.png">
            </a>
            <a href="https://www.ly.com/scenery/zhuanti/wuxianh5">
                <img src="//img1.40017.cn/cn/s/2019/zt/touch/200206/link-02.png">
            </a>
            <a href="https://www.ly.com/scenery/zhuanti/quanyuh5">
                <img src="//img1.40017.cn/cn/s/2019/zt/touch/200206/link-03.png">
            </a>
        </div>
        <div class="link2">
            <img src="//img1.40017.cn/cn/s/2019/zt/touch/200206/link-04.png">
            <div class="links">
                <a href="https://www.ly.com/scenery/zhuanti/shenqih5?from=groupmessage&isappinstalled=0"></a>
                <a href="https://www.ly.com/scenery/zhuanti/wuxianh5"></a>
                <a href="https://www.ly.com/scenery/zhuanti/wuxianh5"></a>
                <a href="https://www.ly.com/scenery/zhuanti/quanyuh5"></a>
            </div>
        </div>
        
        <div class="link3">
            <img src="//img1.40017.cn/cn/s/2019/zt/touch/200206/link-05.png">
            <div class="links">
                <div class="links1">
                    <a href="https://www.ly.com/scenery/zhuanti/2019yinnih5"></a>
                    <a href="https://www.ly.com/scenery/zhuanti/xiongyalit/"></a>
                    <a href="https://www.ly.com/scenery/zhuanti/macaoh5"></a>
                    <a href="https://www.ly.com/scenery/zhuanti/jianghuai/"></a>
                    <a href="https://www.ly.com/scenery/zhuanti/xinjiangt"></a>
                </div>
                <div class="links2">
                    <a href="https://www.ly.com/scenery/zhuanti/fuzhou2019h5?fx=2&spm=13.23916.34045.6&refid=&from=groupmessage&isappinstalled=0"></a>
                    <a href="https://www.ly.com/scenery/zhuanti/jiyuanH5/"></a>
                    <a href="https://www.ly.com/scenery/zhuanti/jiaozuo2019h5"></a>
                    <a href="https://www.ly.com/scenery/zhuanti/TZH5/?from=groupmessage&isappinstalled=0"></a>
                    <a href="https://www.ly.com/scenery/zhuanti/bacheng2019h5/?from=groupmessage&isappinstalled=0"></a>
                </div>
            </div>
            
        </div>
        
        <div class="foot1">
            <p>同程艺龙联合宁夏文旅共同抵抗疫情，为武汉加油！</p>
            <p>一码游景区，就上同程艺龙</p>
        </div>
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
                pageFn.allInit(that,{id: that.zId, AppInfo, AppNewSpm})
            });
        },
           
    }
}
</script>
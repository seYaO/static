/**
 * page methods
 */

import * as utils from '@/utils'
import validate from '@/utils/validate'
import services from '@/utils/services'
import config from './config'

/**
 * 获取链接参数
 * @param {*} spm 
 * @param {*} refid 
 */
export const getPara = (spm, refid) => {
    console.log(utils.getQueryString('refid') ? utils.getQueryString('refid') : refid)
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
}

/**
 * 数据初始化
 */
export const initData = () => {
    // 约惠春天景点门票(46128)
    allAjax(this, '46128', 2, '', 1, 100);
}

/**
 * 资源异步
 * @param {*} mdId 
 * @param {*} index 
 * @param {*} onProvId 
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export const allAjax = (event, mdId, index, onProvId, pageIndex, pageSize) => {
    event = validate.isempty(this) ? event : this
    
    var opts = {
        pageIndex,
        pageSize,
        mdId,
        onProvId,
    }
    services.publicAjax(opts, function (data) {
        if (!data) return event['sectionData' + index] = '';
        event['sectionData' + index] = data.List;

        // switch (index) {
        //     case 2:
        //         var list2 = data.List;
        //         event.videoUrl = 'https:' + list2[0].Purl;
        //         event.videoImg = list2[0].SceneryImg;
        //         event['sectionData' + index] = list2;
        //         if (list2.length > 1) {
        //             setTimeout(function () {
        //                 event.getSwiper(2);
        //             }, 300)
        //         }
        //         break;
        //     case 3:
        //         var list3 = data.List;
        //         event['sectionData' + index] = list3;
        //         if (list3.length > 1) {
        //             event.$nextTick(function () {
        //                 event.getSwiper(3);
        //             })
        //         }
        //         break;
        //     default:
        //         event['sectionData' + index] = data.List;
        //         break;
        // }

    })
}

/**
 * 判断是否需要登陆
 * @param {*} idx 
 */
export const checkLogin = (idx) => {
    console.log(this)
    debugger
    // var that = this
    // this.showFailure = false;
    // this.showSuccess = false;
    // utils.checkLogin(this, { url: config.shareInfo.shareUrl }, (isWx) => {
    //     if (isWx) {
    //         that.getCard(null, idx)
    //     } else {
    //         that.getHB(null, idx)
    //     }
    // })
}
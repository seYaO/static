/**
 * page methods
 */

import * as utils from '@/utils'
import validate from '@/utils/validate'
import services from '@/utils/services'
import config from './config'

/**
 * 获取链接参数
 * @param {*} event 
 * @param {*} spm 
 * @param {*} refid 
 */
export const getPara = (event, spm, refid) => {
    event = validate.isempty(event) ? this : event

    refid = utils.getQueryString('refid') ? utils.getQueryString('refid') : refid
    spm = utils.getQueryString('spm') ? utils.getQueryString('spm') : spm
    event.refid = refid
    event.spm = spm

    if (event.isxcx) { // 小程序分享
        utils.setMiniappShare({ spm: event.spm, refid: event.refid })
    } else {
        utils.setShare(config.shareInfo)
    }

    if (utils.getQueryString("wxparam")) {
        var URLArgues = JSON.parse(
            decodeURIComponent(utils.getQueryString("wxparam"))
        );
        event.wxopenid = URLArgues.openid;
        event.wxunionid = URLArgues.unionid;
        event.nickname = URLArgues.nickname;
        event.avatarurl = URLArgues.headimgurl;
        // console.log(URLArgues)
    }

    if (event.isWx) { // 微信 - 验证卡券是否领取
        utils.hasGetWechatcard(event);
    }


    // 判断是否需要登陆
    // utils.checkLogin(event)
    initData(event);
}

/**
 * 数据初始化
 * @param {*} event 
 */
export const initData = (event) => {
    event = validate.isempty(event) ? this : event

    // 简介(45638)
    allAjax(event, event.ids[1], 1, '', 1, 100);
    // 验客体验官(45639)
    allAjax(event, event.ids[2], 2, '', 1, 100);
    // 游记攻略(45640) 
    allAjax(event, event.ids[3], 3, '', 1, 100);
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
    event = validate.isempty(event) ? this : event

    var opts = {
        pageIndex,
        pageSize,
        mdId,
        onProvId,
    }
    services.publicAjax(opts, function (data) {
        if (!data) return event['sectionData' + index] = '';

        switch (index) {
            case 1:
                var list = data.List;
                event['sectionData' + index] = list;
                if (list && list.length) {
                    var summarys = list[0].Summary.split('|')
                    event.sceneryInfo = {
                        ...list[0],
                        imgUrl: utils.toHttps(list[0].SceneryImg),
                        imgUrl2: utils.toHttps(list[0].Address),
                        imgUrl3: utils.toHttps(summarys[0]),
                        videoUrl: 'https:' + list[0].Qurl,
                        videoImg: '//pic5.40017.cn/03/000/3e/6c/rBANB1235IKAVc3EAALebsKLYpo089.jpg',
                        summary: summarys[1],
                    }
                }
                break;
            default:
                event['sectionData' + index] = data.List;
                break;
        }

    })
}

/**
 * 统计/页面初始化
 * @param {*} event 
 * @param {*} opts 
 */
export const allInit = (event, opts) => {
    event = validate.isempty(event) ? this : event
    var AppInfo = opts.AppInfo, AppNewSpm = opts.AppNewSpm

    window.setRefId.isAjaxGetRef = true;
    window.setRefId.ChannelID = opts.id;
    window.setRefId.isChange = false;
    window.setRefId.uTagName = '.app a';
    window.setRefId.tagValue = 'href';
    window.setRefId.doRefid = function (dataAndRefid) {
        //Hellow world~   所有的一切从这里开始
        var newRefid = dataAndRefid[0]
        var newSpm = dataAndRefid[1]
        if (AppInfo.isAPP) {
            event.addHtml = AppNewSpm ? `|${AppNewSpm}&refid=${newRefid}` : `&refid=${newRefid}`
        } else {
            event.addHtml = newSpm.indexOf('|') > 0 ? `|${newSpm.split('|')[0]}&refid=${newRefid}` : `&refid=${newRefid}`
        }
        getPara(event, newSpm, newRefid)
    }
    window.setRefId.init();
}
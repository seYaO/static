/**
 * page methods
 */

import * as utils from '@/utils'
import validate from '@/utils/validate'
import config from './config'

/**
 * 设置keyframes属性
 * @param {*} y 
 * @param {*} name 
 * @param {*} n 
 */
function addKeyFrames(y, name, n) {
    var style = document.createElement('style');
    style.type = 'text/css';
    var keyFrames = '\
    @-webkit-keyframes ROWUP {\
        0% {\
            -webkit-transform: translate3d(0, 0, 0);\
            transform: translate3d(0, 0, 0);\
        }\
        100% {\
            -webkit-transform: translate3d(A_DYNAMIC_VALUE, 0, 0);\
            transform: translate3d(A_DYNAMIC_VALUE, 0, 0);\
        }\
    }\
    @keyframes ROWUP {\
        0% {\
            -webkit-transform: translate3d(0, 0, 0);\
            transform: translate3d(0, 0, 0);\
        }\
        100% {\
            -webkit-transform: translate3d(A_DYNAMIC_VALUE, 0, 0);\
            transform: translate3d(A_DYNAMIC_VALUE, , 0);\
        }\
    }\
    .mlist .ROWUP {\
        -webkit-animation: SECONDSs rowup1 linear infinite normal;\
        animation: SECONDSs rowup1 linear infinite normal;\
        position: relative;\
    }';
    style.innerHTML = keyFrames.replace(/ROWUP/g, name).replace(/A_DYNAMIC_VALUE/g, y).replace(/SECONDS/g, n * 3);
    document.getElementsByTagName('head')[0].appendChild(style);
}

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

    initData(event);
}

/**
 * 数据初始化
 * @param {*} event 
 */
export const initData = (event) => {
    event = validate.isempty(event) ? this : event

    for (var i = 1; i < 5; i++) {
        var width = document.querySelector('#mlist' + i + ' .marquee').offsetWidth;
        addKeyFrames('-' + width + 'px', 'rowup' + i, event['sectionData' + i].length); // 设置keyframes
        document.querySelector('#mlist' + i + ' .marquees').className += ' rowup' + i;
    }
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
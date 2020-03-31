import { wlUrl } from './wlurl'

/**
 * 基础工具
 * @param {*} datas 
 * @param {*} callBackFn 
 */
function request(datas, callBackFn) {
    $.ajax({
        url: datas.url,
        data: datas.params,
        type: datas.method || 'GET',
        dataType: 'json',
        success: function (data) {
            callBackFn && callBackFn(data)
        },
        complete: function () { }
    })
}

/**
 * 公共异步
 * @param {*} datas 
 * @param {*} callbackFn 
 */
function publicAjax(datas, callbackFn) {
    datas = datas || {}
    datas.pageIndex = datas.pageIndex || 0
    datas.pageSize = datas.pageSize || 10
    datas.mdId = datas.mdId || 0
    datas.onProvId = datas.onProvId || 0
    request({
        url: '/scenery/zt/ZhuanTiAjax/ZhuanTiJsp.aspx',
        params: 'action=GETSPMSCENERYJSP&PageIndex=' +
            datas.pageIndex +
            '&PageSize=' +
            datas.pageSize +
            '&px=5&ChannelID=' +
            datas.mdId +
            '&ProvinceId=' +
            datas.onProvId,
    }, function (data) {
        if (data && data.List && data.List.length > 0) {
            typeof callbackFn === 'function' && callbackFn(data);
        } else {
            // that['sectionData' + index] = '';
            typeof callbackFn === 'function' && callbackFn('');
        }
    })
}

/**
 * 搜索接口
 * 
 * clientType:
 * 1 大号小程序 
 * 2 小号小程序 
 * 3 app（申请赔款） 
 * 4 微信站 
 * 5 m站 
 * 6 pc 
 * 7 app 
 * 8 合伙人 
 * 9 全国省市城市接口 
 * 10 m站重构订单详情页 
 * 11 wlLabrador 
 * 12 抖音小程序 
 * 13 腾讯出行小程序
 */
function searchAjax(datas, callbackFn) {
    var reqData = {
        "clientType": datas.isTc ? 7 : 1,
        "PageIndex": 1,
        "PageCount": 30,
        "Search": {
            "ClyId": datas.ClyId,
            "ProID": datas.onProvId,
            "ExtensionProId": datas.onProvId,
            "SortStr": "0",
            "ChId": 2,
            "PfId": 10,
            "KeyWord": ""
        },
    }

    request({
        url: wlUrl(window.location.protocol + '//' + window.location.host + '/wlfrontend/miniprogram/resourceFrontEnd/ResourceService/ScenerySearch', reqData),
        params: reqData,
        method: 'POST',
    }, function (data) {
        if (data && data.Body && data.Body.BookingModel && data.Body.BookingModel.length > 0) {
            typeof callbackFn === 'function' && callbackFn(data.Body.BookingModel);
        } else {
            typeof callbackFn === 'function' && callbackFn('');
        }
    })
}


/**
 * 验证卡券是否领取
 */
function hasWechatcardAjax(datas, callbackFn) {
    var reqData = {
        "OpenId": datas.wxopenid,
        "CardId": datas.cardId,
    };
    window.__services.request({
        url: wlUrl(window.location.protocol + '//' + window.location.host + '/wl/api/labrador/resourceservice/getwechatcardreceiverecord/', reqData),
        params: reqData,
        method: 'POST',
    }, function (data) {
        typeof callbackFn === 'function' && callbackFn(data);
    })
}

/**
 * 领取卡券
 */
function getWechatcardAjax(datas, callbackFn) {
    var reqData = {
        "OpenId": datas.wxopenid,
        "CardId": datas.cardId,
        "unionId": datas.wxunionid
    };
    request({
        url: wlUrl(window.location.protocol + '//' + window.location.host + '/wl/api/labrador/resourceservice/wechatcardreceive/', reqData),
        params: reqData,
        method: 'POST',
    }, function (data) {
        typeof callbackFn === 'function' && callbackFn(data);
    })
}

/**
 * 判断之前有没有领过红包
 */
function hasRedpackageAjax(datas, callbackFn) {
    var batchS = []
    //红包批次号;
    datas.redlist.forEach(function (item, index) {
        batchS.push(item.pcId)
    })

    window.__services.request({
        url: '/scenery/AjaxHelper/ZhuanTiHelp/ThematicIntegration.aspx',
        params: 'action=GETHONGBAOBOOL&BatchNo=' + batchS.join() + '&memberid=' + datas.memberId,
    }, function (data) {
        typeof callbackFn === 'function' && callbackFn(data);
    })
}

/**
 * 领取红包
 */
function getRedpackageAjax(datas, callbackFn) {
    window.__services.request({
        url: '/scenery/zt/ZhuanTiAjax/SpmAjaxCall.aspx',
        params: 'action=GETSPMHONGBAO&New=1&ChannelID=' + datas.id + '&MemberId=' + datas.memberId,
    }, function (data) {
        typeof callbackFn === 'function' && callbackFn(data);
    })
}

export default {
    publicAjax,
    searchAjax,
    hasWechatcardAjax,
    getWechatcardAjax,
    hasRedpackageAjax,
    getRedpackageAjax,
}
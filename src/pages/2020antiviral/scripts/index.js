/**
 * page methods
 */

import * as utils from '@/utils'
import validate from '@/utils/validate'
import md5 from '@/utils/md5'
import * as services from './services'
import config from './config'

/**
 * 统计/页面初始化
 * @param {*} event 
 * @param {*} opts 
 */
export const allInit = (event, opts, callbackFn) => {
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
        getPara(event, newSpm, newRefid, (val) => {
            typeof callbackFn === 'function' && callbackFn(val);
        })
    }
    window.setRefId.init();
}

/**
 * 获取链接参数
 * @param {*} event 
 * @param {*} spm 
 * @param {*} refid 
 */
export const getPara = (event, spm, refid, callbackFn) => {
    event = validate.isempty(event) ? this : event
    event.refid = utils.getQueryString('refid') ? utils.getQueryString('refid') : refid
    event.spm = utils.getQueryString('spm') ? utils.getQueryString('spm') : spm
    var wxparam = utils.getQueryString("wxparam")

    if (event.isxcx) { // 小程序分享
        utils.setMiniappShare({ spm: event.spm, refid: event.refid })
    } else {
        utils.setShare(config.shareInfo)
    }

    if (wxparam) {
        var URLArgues = JSON.parse(
            decodeURIComponent(utils.getQueryString("wxparam"))
        );
        event.wxopenid = URLArgues.openid;
        event.wxunionid = URLArgues.unionid;
        event.nickname = URLArgues.nickname;
        event.avatarurl = URLArgues.headimgurl;
        // console.log(URLArgues)
    }

    typeof callbackFn === 'function' && callbackFn(wxparam);

}

/**
 * 跳转地址到 首页/邮寄信息
 * @param {*} event 
 */
export const mainLink = (event, type) => {
    event = validate.isempty(event) ? this : event

    var url = `https://www.ly.com/scenery/zhuanti/2020antiviral?spm=${event.spm}&refid=${event.refid}`
    if (type) {
        url = `${url}&type=${type}`;
    }
    if (event.isWx) {
        if (event.isxcx) {
            url = url + "&isxcx=1";
        }
        window.location.href = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + encodeURIComponent(url);
    } else {
        window.location.href = url
    }
}

/**
 * 小游戏排行榜信息
 * @param {*} event 
 */
export const gameTopInfoFn = (event) => {
    event = validate.isempty(event) ? this : event

    var reqTime = new Date().getTime()
    var sign = 'unionid=' + event.wxunionid + '&memberid=' + event.memberId + '&reqtime=' + reqTime + '&gamename=' + event.gameName
    var data = {
        clientType: event.isTc ? 7 : 1,
        ReqTime: reqTime,
        Sign: md5(sign),
        GameName: event.gameName,
        TopCount: 10,
        MemberId: event.memberId,
        UnionId: event.wxunionid
    }

    return data
}

/**
 * 小游戏结果信息
 * @param {*} event 
 */
export const gameResultInfoFn = (event) => {
    event = validate.isempty(event) ? this : event

    var reqTime = new Date().getTime()
    var sign = 'unionid=' + event.wxunionid + '&memberid=' + event.memberId + '&reqtime=' + reqTime + '&nickname=' + event.nickname + '&score=' + event.score + '&avatar=' + encodeURIComponent(event.avatarurl)
    var data = {
        clientType: event.isTc ? 7 : 1,
        GameName: event.gameName,
        ReqTime: reqTime,
        Sign: md5(sign),
        UnionId: event.wxunionid,
        MemberId: event.memberId,
        Nickname: event.nickname || '玩家用户',
        Avatar: encodeURIComponent(event.avatarurl),
        Score: event.score
    }
    if (event.meInfo) {
        if (event.meInfo.Score >= event.score) {
            return { state: false }
        }
    }

    return { state: true, data }
}

/**
 * 小游戏排行榜list
 * @param {*} event 
 * @param {*} submit 
 */
export const gameTopListFn = (event, submit = false) => {
    event = validate.isempty(event) ? this : event

    var result = gameTopInfoFn(event)

    services.QueryMiniGameTopList(result, (data) => {
        console.log('小游戏排行榜查询', data)
        if (data.StateCode == 200 && data.Body) {

            event.meInfo = data.Body.OwnResult
            if (data.Body.ResultList.length) {
                event.rankList = data.Body.ResultList
            } else {
                event.rankList = ''
            }

            if (submit) { // 提交分数显示弹框结果
                event.showScore = true
            }
        }
    })

}

/**
 * 小游戏结果保存
 * @param {*} event 
 */
export const gameSubmit = (event) => {
    event = validate.isempty(event) ? this : event

    var result = this.gameResultInfoFn()
    if (!result.state) {
        event.showScore = true
        return
    }

    services.PushMiniGameResult(result.data, function (data) {
        console.log('小游戏结果保存', data)
        if (data.StateCode == 200 && data.Body) {
            if (event.meInfo) {
                gameTopListFn(true)
            } else {
                gameTopListFn()
                event.showScore = true
            }
        }
    })
}

/**
 * 邮寄信息验证
 * @param {*} event 
 */
export const validateFn = (event) => {
    event = validate.isempty(event) ? this : event

    var reqTime = new Date().getTime()
    var sign = 'unionid=' + event.wxunionid + '&memberid=' + event.memberId + '&reqtime=' + reqTime + '&customername=' + window.utils.trim(event.mailName) + '&mobile=' + event.mailPhone + '&address=' + event.mailAddress
    var data = {
        clientType: event.isTc ? 7 : 1,
        ReqTime: reqTime,
        Sign: md5(sign),
        GameName: event.gameName,
        MemberId: event.memberId,
        UnionId: event.wxunionid,
        CustomerName: utils.trim(event.mailName),
        Mobile: event.mailPhone,
        Address: event.mailAddress,
    }

    if (!utils.trim(this.mailName)) {
        utils.popFn('请输入姓名')
        return { state: false }
    }
    if (!event.mailPhone) {
        utils.popFn('请输入手机号')
        return { state: false }
    }
    if (!event.mailAddress) {
        utils.popFn('请填写邮寄地址')
        return { state: false }
    }

    if (!validate.isMobile(event.mailPhone)) {
        utils.popFn('手机号填写错误')
        return { state: false }
    }


    return {
        state: true,
        data
    }
}

/**
 * 邮寄信息提交
 * @param {*} event 
 */
export const mailSubmit = (event)=>{
    event = validate.isempty(event) ? this : event

    var result = validateFn(event)
    // console.log(result)
    if (!result.state) return

    services.SaveMiniGamePostInfo(result.data, function (data) {
        console.log('小游戏更新邮寄信息', data)
        event.showMail = false
        event.mailName = ''
        event.mailPhone = ''
        event.mailAddress = ''
        utils.popFn('信息更新成功')
    })
}

/**
 * 判断是否需要登陆
 * @param {*} idx 
 */
export const checkLogin = (event) => {
    event = validate.isempty(event) ? this : event

    event.showFailure = false;
    event.showSuccess = false;
    utils.checkLogin(event, { url: config.shareInfo.shareUrl }, (isWx) => {
        // this.initData();
    })
}
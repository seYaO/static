import * as utils from '@/utils'
import validate from '@/utils/validate'
import config from './config'

// 缓存
let Activity = {
    getLocalData: function () {
        let localDataStr = sessionStorage.getItem("localData_sqdc") || "{}",
            localData = JSON.parse(localDataStr);
        return localData;
    },
    initSaveEvent: function () {
        window.onunload = function () {
            let _localData = $.extend(Activity.localData, {
                onProvId: app.onProvId,
                onProvName: app.onProvName,
                locationName: app.locationName,
            });
            sessionStorage.setItem("localData_sqdc", JSON.stringify(_localData));
        };
    }
};
Activity.initSaveEvent();
Activity.localData = Activity.getLocalData();
let localData = Activity.localData;

export default {
    isTc: /tctravel/i.test(navigator.userAgent),
    isWx: /MicroMessenger/i.test(navigator.userAgent),
    // isWx: true,
    isxcx: validate.isempty(utils.getQueryString('isxcx')) ? false : true,
    // userid=37421349&nickName=seYao_O&level=1
    // memberId: '37421349',
    memberId: '',
    wxopenid: '',
    wxunionid: '',
    nickname: '',
    avatarurl: 'https://img1.40017.cn/cn/s/2020/zt/touch/200320/default.png',
    addHtml: '',
    refid: '',
    spm: '5.46104.46128.1', // 5.44764.44764.1
    zId: '44764', // 专题ID 44764
    cId: '', // 省市ID 44050
    provAjaxList: '',
    loading: false,
    locationName: localData.locationName,
    onProvId: localData.onProvId,
    onProvName: localData.onProvName,
    onCid: localData.onProvName ? localData.onCid : '29934',
    onNid: localData.onNid || '30028',
    // windowHeight: $(document.body).height(),
    windowHeight: window.screen.height,

    // 页面数据
    gameName: config.gameName, // 游戏名称
    sceneryInfo: null,
    rankList: [],
    meInfo: null,

    // 游戏
    seconds: 30, // 倒计时
    showTiming: false,
    timingUrl: 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/dialog-countdown-3.png',
    score: 10,
    timingInterval: null,
    timingCount: 3,
    showMusic: false, // 显示music
    isPlay: false, // 是否播放
    myAudioUrl: 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/music.mp3',
    audio: '',

    // 得分
    scoreBgUrl: 'http://img1.40017.cn/cn/s/2020/zt/touch/200320/dialog-rank1.png?v=2',
    showScore: false,

    // 规则页面
    topImagUrlRules: config.topImagUrlRules, // 头图
    isMove: false,

    // 排行榜
    topImagUrlRanking: config.topImagUrlRanking,
    topImagUrlTable: config.topImagUrlTable,

    // 邮寄信息
    showMail: false,
    mailName: '',
    mailPhone: '',
    mailCaptcha: '',
    mailAddress: '',
}
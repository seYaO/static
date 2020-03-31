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
    // isWx: /MicroMessenger/i.test(navigator.userAgent),
    isWx: true,
    isxcx: validate.isempty(utils.getQueryString('isxcx')) ? false : true,
    // userid=37421349&nickName=seYao_O&level=1
    // memberId: '37421349',
    // memberId: '',
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

    // 页面数据
    topImagUrl: config.topImagUrl, // 头图
    redpackage: config.redpackage,
    redlist: config.redlist, // 红包配置信息
    sectionData1: [],
    sectionData2: [],
    showFailure: false,
    showSuccess: false,
    dialogInfo: null,
    selectIdx: 0,
}
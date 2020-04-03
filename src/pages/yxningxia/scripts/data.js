import * as utils from '@/utils'
import validate from '@/utils/validate'
import config from './config'
import storage from '@/utils/storage'

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

// 弹幕数据初始化
let toNum = utils.randomNum(1, 3), list = [],
    selectList = storage.getLocal('selectList') || [],
    sectionData = { sectionData1: [], sectionData2: [], sectionData3: [], sectionData4: [] }
for (let i = 0; i < toNum * 5; i++) {
    let obj = {
        headImgUrl: '//img1.40017.cn/cn/s/2019/zt/touch/200206/head' + utils.randomNum(1, 20) + '.png',
        nickName: '网友',
        text: config.barrageInfos[utils.randomNum(0, config.barrageInfos.length - 1)],
        width: utils.randomNum(10, 50),
    }
    list.push(obj)
}
// debugger

if (selectList.length > 0) {
    selectList.map(ele => {
        list.push({
            headImgUrl: ele.headImgUrl,
            nickName: ele.nickName,
            text: ele.text,
            width: utils.randomNum(10, 50),
        })
    })
}
for (let i = 1; i < 5; i++) {
    for (let j = 0; j < utils.randomNum(20, 50); j++) {
        sectionData['sectionData' + i].push(list[utils.randomNum(0, list.length - 1)])
    }
}

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

    // 页面数据
    topImagUrl: config.topImagUrl, // 头图
    total: 1000,
    sectionData,
    sectionData1: sectionData.sectionData1,
    sectionData2: sectionData.sectionData2,
    sectionData3: sectionData.sectionData3,
    sectionData4: sectionData.sectionData4,
}
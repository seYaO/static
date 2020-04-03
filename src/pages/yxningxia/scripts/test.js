
//url截参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}

// 拷贝
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 设置keyframes属性
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

// shuzu
function distinct(arr) {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) < 0) {
            newArr.push(arr[i])
        }
    }
    return newArr
}

function randomNum(minNum, maxNum) {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}


var storage = {}

storage.getLocal = function (name) {

    var result = '',
        getItemObj = window.localStorage.getItem(name);
    try {
        result = JSON.parse(getItemObj);
    } catch (error) {
        result = getItemObj
    }
    return result;
}

storage.setLocal = function (name, val) {
    if (!name) return;
    if (typeof val !== 'string') {
        val = JSON.stringify(val);
    }
    window.localStorage.setItem(name, val);
}

// 缓存
var Activity = {
    getLocalData: function () {
        var localDataStr = sessionStorage.getItem("localData_sqdc") || "{}",
            localData = JSON.parse(localDataStr);
        return localData;
    },
    initSaveEvent: function () {
        window.onunload = function () {
            var _localData = $.extend(Activity.localData, {
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
var localData = Activity.localData;
var AppInfo = {
    isAPP: null, // 是否客户端打开
    cityID: null // 城市ID
};

var __topimg = '//img1.40017.cn/cn/s/2019/zt/touch/200206/top.gif?v=1'

var __arr = [
    '不信谣，不传谣，向一线的勇士致敬',
    '愿华夏大地重回春暖花开，蓬勃生机',
    '同舟共济，一起战“疫”',
    '加油武汉，加油中国!',
    '戴口罩，勤洗手，少出门，宅在家里给祖国做贡献!',
    '五千年来什么风风雨雨都能过去，这次疫情也一定会过去的',
    '团结就是力量，希望每个人都要有责任感，不要给工作人员添乱',
    '一定要把物资送到最需要的人手里',
]

var __list = []
var toNum = randomNum(1, 3)
for (var i = 0; i < toNum * 5; i++) {
    var __obj = {
        headImgUrl: '//img1.40017.cn/cn/s/2019/zt/touch/200206/head' + randomNum(1, 20) + '.png',
        nickName: '网友',
        text: __arr[randomNum(0, __arr.length - 1)],
        width: randomNum(10, 50),
    }
    __list.push(__obj)
}
var selectList = storage.getLocal('selectList') || []
if (selectList.length > 0) {
    selectList.forEach(function (ele) {
        __list.push({
            headImgUrl: ele.headImgUrl,
            nickName: ele.nickName,
            text: ele.text,
            width: randomNum(10, 50),
        })
    })
}
var sectionData = { sectionData1: [], sectionData2: [], sectionData3: [], sectionData4: [] }
for (var _i = 1; _i < 5; _i++) {
    for (var _j = 0; _j < randomNum(20, 50); _j++) {
        sectionData['sectionData' + _i].push(__list[randomNum(0, __list.length - 1)])
    }
}
var timer = null

var app = new Vue({
    el: '#app',
    data: {
        isTc: /tctravel/i.test(navigator.userAgent),
        isWx: /MicroMessenger/i.test(navigator.userAgent),
        isxcx: false,
        // userid=37421349&nickName=seYao_O&level=1
        // memberId: '37421349',
        memberId: '',
        wxopenid: '',
        wxunionid: '',
        addHtml: '',
        refid: '',
        spm: '5.44764.44764.1',
        zId: '44764', // 专题ID
        cId: '44050', // 省市ID
        provAjaxList: '',
        loading: false,
        locationName: localData.locationName,
        onProvId: localData.onProvId,
        onProvName: localData.onProvName,
        onCid: localData.onProvName ? localData.onCid : '29934',
        onNid: localData.onNid || '30028',
        Ih5: __topimg,
        Ixcx: __topimg,
        total: 1000,

        showProvList: false,
        sectionData1: sectionData.sectionData1,
        sectionData2: sectionData.sectionData2,
        sectionData3: sectionData.sectionData3,
        sectionData4: sectionData.sectionData4,
        showMore: true,


    },
    created: function () {
        this.init();
    },
    mounted: function () {
        // this.scroll();
    },
    methods: {
        init: function () {
            var that = this
            var AppNewSpm = getQueryString('tcwebtag')
            allInit = {
                doRefid: function (dataAndRefid) {
                    // console.log(3)
                    //Hellow world~   所有的一切从这里开始
                    newRefid = dataAndRefid[0]
                    newSpm = dataAndRefid[1]
                    if (AppInfo.isAPP) {
                        that.addHtml = AppNewSpm ?
                            '|' + AppNewSpm + '&refid=' + newRefid :
                            '&refid=' + newRefid
                    } else {
                        that.addHtml =
                            newSpm.indexOf('|') > 0 ?
                                '|' + newSpm.split('|')[0] + '&refid=' + newRefid :
                                '&refid=' + newRefid
                    }
                    that.getPara(newSpm, newRefid)
                },
                init: function (id) {
                    // console.log(2)
                    setRefId({
                        isAjaxGetRef: true, //是否需要异步获取refid【默认false】
                        ChannelID: id, //频道ID【isAjaxGetRef为true时必传】
                        isChange: false, //是否需要给静态链接自动添加refid和spm【可不传，默认false】
                        uTagName: '.app a', //需要自动添加refid的类名【可不传，默认所有a】
                        tagValue: 'href' //需要自动添加refid的元素属性【可不传，默认a标签的href】
                    })
                }
            }
            TongChengInfo(function (data) {
                // console.log(1)
                AppInfo.isAPP = data.isTc
                AppInfo.cityID = data.cid
                if (AppInfo.isAPP) {
                    that.isTc = true;
                    memberId = data.memberId
                    if (memberId) {
                        that.memberId = memberId
                    }
                } else {
                    if ($.cookie('us')) {
                        var uMemberIDRight = $.cookie('us').split('=')[1]
                        var uId = uMemberIDRight.split('&')[0]
                        that.memberId = uId ? uId : ''
                    }
                    that.getWechat()
                }
                allInit.init(that.zId);
                // 页面进来，先判断是否登陆，如果登陆了，看之前有没有领取过红包
                if (that.memberId && !that.isxcx) {
                    // that.isGetHB()
                }
            });
        },
        getWechat: function () {
            var that = this
            // 小程序模拟器用
            if (getQueryString('isxcx')) {
                that.isxcx = true
            }
        },
        // 获取链接参数
        getPara: function (spm, refid) {
            this.refid = getQueryString('refid') ? getQueryString('refid') : refid
            this.spm = getQueryString('spm') ? getQueryString('spm') : this.spm
            this.initData();
        },

        // 轮播
        getSwiper: function (index) {
            var that = this
            that['swiper' + index] = new Swiper('#swiper' + index, {
                effect: '',
                slidesPerView: 'auto',
                spaceBetween: 10,
                pagination: {
                    el: '.swiper-pagination' + index,
                    clickable: true,
                },
                loop: index == 2 ? false : true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
            })
        },

        //数据初始化
        initData: function () {
            var that = this;
            
            that.getNumberAjax(function (data) {
                that.total = data.Body || 1000
                for (var i = 1; i < 5; i++) {
                    var width = document.querySelector('#mlist' + i + ' .marquee').offsetWidth;
                    addKeyFrames('-' + width + 'px', 'rowup' + i, that['sectionData' + i].length); // 设置keyframes
                    document.querySelector('#mlist' + i + ' .marquees').className += ' rowup' + i;
                }
            })

        },

        getNumberAjax: function (callBackFn) {
            $.ajax({
                url: WL_URL_TEST(window.location.protocol + '//' + window.location.host + '/wlfrontend/zhuanti/getNum', {}),
                data: {},
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    callBackFn && callBackFn(data)
                },
                complete: function () { }
            })
        },

        //蒙层
        popFn: function (txt) {
            $(".showErr").html(txt);
            $(".showErrBox").show();
            setTimeout(function () {
                $(".showErr").html("");
                $(".showErrBox").hide();
            }, 2000);
        },

    }
})



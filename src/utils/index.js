
/**
 * 字符串去前后的空格
 * @param {*} val 
 */
export const trim = (val) => {
    return !!val && val.replace(/^\s+|\s+$/gm, '')
}

/**
 * 拷贝
 * @param {*} obj 
 */
export const clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 取随机数
 * @param {*} minNum 
 * @param {*} maxNum 
 */
export const randomNum = (minNum, maxNum) => {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}

/**
 * url截参数
 * @param {*} name 
 */
export const getQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}

/**
 * 图片裁剪
 * @param {*} url 
 * @param {*} size 
 * @param {*} type 
 */
export const setImageSize = (url, size, type) => {
    type = type || '00'
    if (!url) {
        return null;
    }
    if (url.indexOf("http:") != -1 && url.indexOf("file.wanchengly.com") == -1) {
        url = url.replace("http:", "https:")
    }
    var defaultSize = "_600x300_00";
    if (size && size.indexOf("_") === -1) {
        size = "_" + size + "_" + type;
    }
    var reg = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]/;
    var regSize = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]$/;
    if (reg.test(url) && regSize.test(size)) {
        return url.replace(reg, size);
    }

    if (reg.test(url)) {
        return url;
    }

    if (url.indexOf("upload.17u.com") > -1 || url.indexOf("file.40017.cn") > -1 || url.indexOf("file.wanchengly.com") > -1) {
        return url;
    } else if (!reg.test(url)) {
        return url.replace(/\.\w+$/, function ($0) {
            return (size || defaultSize) + $0;
        });
    }
}

/**
 * 保存临时图片
 * @param {*} url 
 */
export const tempFilePaths = (url) => {
    return new Promise((reslove, reject) => {
        let imgData = new Image();
        imgData.crossOrigin = "anonymous";
        imgData.onload = () => {
            reslove(imgData);
        }
        imgData.src = url;
    });
}

/**
 * 读取cookie
 * @param {*} name 
 */
export const getCookie = (name) => {
    if (document.cookie.length > 0) {
        //先查询cookie是否为空，为空就return ""
        var c_start = document.cookie.indexOf(name + "="); //通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1
        if (c_start != -1) {
            c_start = c_start + name.length + 1; //最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
            var c_end = document.cookie.indexOf(";", c_start); //其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end)); //通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
        }
    }
    return "";
}

/**
 * 设置cookie
 * @param {*} name 
 * @param {*} value 
 * @param {*} expiredays 
 */
export const setCookie = (name, value, expiredays) => {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
        name +
        "=" +
        escape(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
}

/**
 * tcapp
 * @param {*} funBack 
 */
export const TongChengInfo = (funBack) => {
    window._tc_bridge_user.get_device_info({
        param: {
            shareKey: "",
            abId: "",
            abIds: ["key1", "key2"]
        },
        callback: function (data) {
            try {
                var rspObj = JSON.parse(data.CBData);
            } catch (error) { }
            var obj = {};
            obj.isTc = /tctravel/i.test(navigator.userAgent);
            obj.cid = rspObj && rspObj.locationInfo.cityId || '';
            obj.memberId = rspObj && rspObj.memberInfo.memberId || '';
            obj.unionId = rspObj && rspObj.memberInfo.unionId || '';
            obj.userName = rspObj && rspObj.memberInfo.userName || '';
            obj.headImg = rspObj && rspObj.memberInfo.headImg || '';
            funBack(obj)
        }
    })
}

/**
 * 小程序分享
 * @param {*} options 
 */
export const setMiniappShare = (options) => {
    var spm = options.spm;
    var refid = options.refid;
    var url = encodeURIComponent(options.shareUrl + "?isxcx=1&spm=" + spm + "&refid=" + refid);
    var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + url;
    wx.miniProgram.postMessage({
        data: {
            shareInfo: {
                currentPath: location.host + location.pathname, //当前页面路径，不需要参数
                title: options.miniappTitle,
                path: path, //默认当前页面路径
                imageUrl: options.miniappImageUrl //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
            }
        }
    });
}

/**
 * 判断是否需要登陆
 * @param {*} event 
 * @param {*} callbackFn 
 */
export const checkLogin = (event, options, callbackFn) => {
    if (event.isWx) {
        if (event.wxopenid && event.wxunionid) {
            typeof callbackFn === 'function' && callbackFn(true);
        } else {
            var url = options.url + "?spm=" + event.spm + "&refid=" + event.refid
            if (event.isxcx) { // 判断小程序
                url += '&isxcx=1'
            }
            //走套头
            var path = "https://wx.17u.cn/wl/api/redirect?redirect_uri=" + encodeURIComponent(url);
            window.location.href = path;
        }
    } else {
        if (event.memberId) {
            typeof callbackFn === 'function' && callbackFn(false);
        } else {
            // 登录
            if (event.isTc) {
                window.location.href = "tctclient://web/loginrefresh";
            } else {
                window.location.href = '//passport.ly.com/m/login.html?returnUrl=' + encodeURIComponent(window.location.href)
            }
        }
    }
}
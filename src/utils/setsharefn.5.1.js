(function (win, doc) {
    var isAndroid = /(Android)/i.test(navigator.userAgent),
        isTc = (/tctravel/i).test(navigator.userAgent);
    var _tcq = _tcq || [];
    var _timediff = -1;
    var shareCode = "";

    function findParam(str, key) {
        var strArr = str.split(/&|\?|#/g); //添加？分割，金山的refid中会出现?&的情况
        for (var n = 0; n < strArr.length; n++) {
            if (strArr[n].substring(0, key.length + 1) == (key + '=')) {
                return strArr[n].substring(key.length + 1);
            }
        }
        return "";
    }

    var setShareFun = {
        shareTitle: "",
        shareImg: "",
        shareUrl: "",
        shareDesc: "",
        Pageview: "",
        shareCodeFn: function () {

            //m站 10004    客户端 10007   微信 10003
            if (shareCode == "") {
                var isWx = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? true : false,
                    isApp = (/tctravel/i).test(navigator.userAgent);

                shareCode = isApp ? "10007-2003-0" : isWx ? "10003-2003-0" : "10004-2003-0";

            };

            return shareCode;

        },

        shareCallBack: function () { },

        getMemberId: function () {
            var memberId;
            if (!$.cookie("CNMember")) {
                memberId = undefined;
            } else {
                memberId = findParam($.cookie("CNMember"), "MemberId");

            }

            return eval(memberId) ? memberId : "0";
        },

        getRefid: function () {
            var url = window.location.href.toLowerCase(),
                refid, dStr;

            if (!$.cookie("CNSEInfo")) {
                refid = undefined;
                var dIndex = url.indexOf("#");
                var pIndex = url.indexOf("?");

                if (dIndex > -1) {
                    dStr = url.substring(dIndex + 1);
                    var rid = findParam(dStr, "refid");
                    if (rid !== "" && rid !== "undefined" && rid != undefined) {
                        refid = rid;
                    }
                }

                if (pIndex > -1) {
                    //"?xxx#..." 获取xxx的内容
                    if (dIndex > -1 && pIndex < dIndex) {
                        dStr = url.substring(pIndex + 1, dIndex);
                    }
                    //"?xxx"
                    //"#....?xxx" 获取xxx的内容
                    else {
                        dStr = url.substring(pIndex + 1);
                    }
                    var rid = findParam(dStr, "refid");
                    if (rid !== "" && rid !== "undefined" && rid != undefined) {
                        refid = rid;
                    }
                }
            } else {
                refid = findParam($.cookie("CNSEInfo"), "RefId");
            }

            refid = refid == undefined ? "0" : refid;
            refid = refid == "undefined" ? "0" : refid;

            return refid === "" ? "0" : refid;
        },

        onBridgeReady: function () {
            var uThis = this;
            $.ajax({
                url: 'https://www.ly.com/huochepiao/resource/WXJsApi/GetWXApiConfig',
                type: 'get',
                dataType: 'jsonp',
                data: {
                    url: window.location.href
                },
                success: function (data) {
                    if (data.Status != "true" || data.MessageCode != "1000") return;
                    wx.config({
                        debug: false,
                        appId: data.Data.AppId,
                        timestamp: data.Data.TimeStamp,
                        nonceStr: data.Data.NonceStr,
                        signature: data.Data.Signature,
                        jsApiList: [
                            'updateAppMessageShareData', // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
                            'updateTimelineShareData' // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
                        ]
                    });

                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
                    // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
                    // 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    wx.ready(function () {
                        share();
                    });

                    // config信息验证失败会执行error函数，如签名过期导致验证失败，
                    // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    wx.error(function (res) {
                        alert('error:' + JSON.stringify(res));
                    })
                },
                fail: function (e) {
                    alert("sdk失败");
                }
            });

            function share() {
                // 发送给朋友
                var shareFriends = {
                    title: this.shareTitle, // 分享标题
                    desc: this.shareDesc, // 分享描述
                    link: this.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: this.shareImg, // 分享图标
                    success: function (res) {

                    }
                };

                // 批量显示功能按钮接口
                wx.showMenuItems({
                    menuList: [
                        "menuItem:share:appMessage", // 发送给朋友
                        "menuItem:share:timeline" // 分享到朋友圈
                    ]
                });

                wx.updateAppMessageShareData(shareFriends);
                wx.updateTimelineShareData(shareFriends);
            }
        },

        getPageview: function () {

            var newPageview = this.Pageview,
                isWx = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? true : false;

            if (isWx) {

                var URLArgues = decodeURIComponent((findParam(window.location.href, "wxparam"))),
                    getUrlObj = URLArgues ? JSON.parse(URLArgues) : "",
                    uOpenId = getUrlObj.openid;

                newPageview = uOpenId + "||" + this.Pageview;

            } else {
                newPageview = this.Pageview;
            }

            return newPageview;

        },

        shareInit: function () {
            if (typeof _tcopentime != "undefined") {
                _timediff = new Date().getTime() - _tcopentime;
            }
            _tcq.push(['_serialid', '0']);
            _tcq.push(['_vrcode', this.shareCodeFn()]);
            _tcq.push(['_refId', this.getRefid()]);
            _tcq.push(['_userId', this.getMemberId()]);
            _tcq.push(['_openTime', _timediff]);
            _tcq.push(['_trackPageview', this.getPageview()]);

            var shareModel = document.createElement("div");
            shareModel.id = "wxShare";
            shareModel.style.display = "none";

            var txtInput = document.createElement("input");
            txtInput.id = "tcsharetext";
            txtInput.name = "tcsharetext";
            txtInput.value = this.shareTitle;
            shareModel.appendChild(txtInput);

            var imgInput = document.createElement("input");
            imgInput.id = "tcshareimg";
            imgInput.name = "tcshareimg";
            imgInput.value = this.shareImg;
            shareModel.appendChild(imgInput);

            var urlInput = document.createElement("input");
            urlInput.id = "tcshareurl";
            urlInput.name = "tcshareurl";
            urlInput.value = this.shareUrl;
            shareModel.appendChild(urlInput);

            var desInput = document.createElement("input");
            desInput.id = "tcDesc";
            desInput.name = "tcDesc";
            desInput.value = this.shareDesc;
            shareModel.appendChild(desInput);
            document.body.appendChild(shareModel);

            var vstFile = document.createElement("script");
            vstFile.type = "text/javascript";
            vstFile.src = "//vstlog.17u.cn/vst.ashx";
            vstFile.charset = "utf-8";
            document.body.appendChild(vstFile);

            //智能创意代码
            (function (d) {
                (window.bd_cpro_rtid = window.bd_cpro_rtid || []).push({ id: "P1c3Pjm" });
                var s = d.createElement("script");
                s.type = "text/javascript";
                s.async = true;
                s.src = location.protocol + "//cpro.baidu.com/cpro/ui/rt.js";
                var s0 = d.getElementsByTagName("script")[0];
                s0.parentNode.insertBefore(s, s0);
            })(document);

        },

        changeShareInfo: function () {
            this.shareInit();
            document.getElementById("tcshareimg").value = this.shareImg;
            document.getElementById("tcshareurl").value = this.shareUrl;
            document.getElementById("tcsharetext").value = this.shareTitle;
            document.getElementById("tcDesc").value = this.shareDesc;

            if (isAndroid && isTc) {
                Android.setTcshareimg(this.shareImg);
                Android.setTcshareurl(this.shareUrl);
                Android.setTcsharetext(this.shareTitle);
                Android.setTcsharedesc(this.shareDesc);
            }

            this.onBridgeReady();
        }
    };
    win.setShareFun = setShareFun
})(window, document)

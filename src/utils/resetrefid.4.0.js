/**
 * resetRefID.3.5.js
 */

(function (win, doc) {
    var ua = navigator.userAgent,
        isTc = (/tctravel/i).test(ua);


    var setRefId = {
        /*
        isAjaxGetRef------------------是否需要异步获取refid【默认false】
        oldRefid----------------------非异步获取refid时传过来，【isAjaxGetRef为false时必传】
        ChannelID---------------------频道ID【isAjaxGetRef为true时必传】
        allSpmId----------------------总的页面spmID【必传】
        isChange----------------------是否需要给静态链接自动添加refid和spm【可不传，默认false】
        uTagName-----------------------需要自动添加refid的类名【可不传，默认所有a】
        tagValue----------------------需要自动添加refid的元素属性【可不传，默认a标签的href】
        */
        isAjaxGetRef: false,
        oldRefid: '',
        ChannelID: '',
        allSpmId: '',
        isChange: false,
        uTagName: "a",
        tagValue: "href",
        doRefid: null,
        init: function () {
            // //是否异步获取refid
            // if (this.isAjaxGetRef) {

            //     isAjaxGetRef = this.isAjaxGetRef;

            //     //异步获取refid时获得channel
            //     if (this.ChannelID) {
            //         ChannelID = this.ChannelID;
            //     }
            // }
            // //非异步获取refid，取自带refid
            // else {

            //     if (this.oldRefid) {
            //         oldRefid = this.oldRefid;
            //     }
            //     if (this.allSpmId) {
            //         allSpmId = this.allSpmId;
            //     }
            // }

            // if (this.isChange) {
            //     isChange = this.isChange;
            // }
            // if (this.uTagName) {
            //     uTagName = this.uTagName;
            // }
            // if (this.tagValue) {
            //     tagValue = this.tagValue;
            // }

            //异步获取
            if (this.isAjaxGetRef) {
                var nHost = location.hostname.toLowerCase(),
                    mLyUrl = "/scenery/json/ZhuanTiAjax.html?https://www.ly.com/scenery/zt/ZhuanTiAjax/SpmAjaxCall.aspx?requestUrl=action=GETSPMSCENERY&ChannelID=" + this.ChannelID + "&r=1",
                    wwwLyUrl = "/scenery/zt/ZhuanTiAjax/SpmAjaxCall.aspx?action=GETSPMSCENERY&ChannelID=" + this.ChannelID + "&r=1",
                    nowDataUrl = (nHost == "m.ly.com") ? mLyUrl : wwwLyUrl;//m.ly.com域下的地址与www.ly.com下请求的地址不相同

                $.ajax(
                    {
                        url: nowDataUrl,
                        dataType: "json",
                        success: function (data) {

                            var newRefID = data.refid;
                            // allSpmId = data.spm;

                            // _doRefidFn(newRefID, allSpmId, isChange, uTagName, tagValue);
                            _doRefidFn(newRefID, data.spm, this.isChange, this.uTagName, this.tagValue);

                        }
                    }
                )
            } else {

                // _doRefidFn(oldRefid, allSpmId, isChange, uTagName, tagValue);
                _doRefidFn(this.oldRefid, this.allSpmId, this.isChange, this.uTagName, this.tagValue);
            }
        }
    }

    //获取url参数值 (参数名)
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {

            return decodeURI(r[2]);
        }
        return null;
    }

    // 路径统计代码
    function spmGet(newRefID, newSpm) {

        var urlAugrs = window.location.href.toLowerCase();
        var myRedid = "";
        var mySpm = "";
        var theRequest = new Object();
        var ajaxData = null;
        if (urlAugrs.indexOf("?") != -1) {
            var minAugrs = urlAugrs.split("?")[1];
            var str = minAugrs.split(/&|\?|#/g);
            for (var i = 0; i < str.length; i++) {
                theRequest[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
            }
        }
        myRedid = theRequest["refid"] ? theRequest["refid"] : newRefID;
        //v300v3.14924.14940.1v

        mySpm = (isTc) ? ((theRequest["tcwebtag"]) ? (theRequest["tcwebtag"].substring(5, theRequest["tcwebtag"].length - 1) + "|" + newSpm) : newSpm) :
            ((theRequest["spm"]) ? (theRequest["spm"] + "|" + newSpm) : newSpm);

        if (getQueryString("Fx") == 2) {
            mySpm = (isTc) ? theRequest["tcwebtag"] ? (theRequest["tcwebtag"].substring(5, theRequest["tcwebtag"].length - 1) + "|" + newSpm.substr(0, newSpm.length - 1) + "2") : newSpm.substr(0, newSpm.length - 1) + "2" :
                theRequest["spm"] ? (theRequest["spm"] + "|" + newSpm.substr(0, newSpm.length - 1) + "2") : newSpm.substr(0, newSpm.length - 1) + "2";
        }

        ajaxData = "//tracklog.17usoft.com/scenery/SceneryTrackService.ashx?s=" + mySpm + "&r=" + myRedid;


        if (myRedid || mySpm) {
            var linkDom = document.createElement("script");
            linkDom.src = ajaxData;
            var sDom = document.getElementsByTagName("script")[0];
            sDom.parentNode.insertBefore(linkDom, sDom);
        }

        return mySpm;

    }


    function getRefId(newRefID) {
        var urlAugrs = window.location.search.toLowerCase();
        var myRedid = "";
        var theRequest = new Object();
        if (urlAugrs.indexOf("refid") != -1) {

            var str = urlAugrs.substr(1);
            str = str.split("&");
            for (var i = 0; i < str.length; i++) {
                theRequest[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
            }
            myRedid = theRequest["refid"];

        } else {

            try {

                var CNSEInfo = $.cookie("CNSEInfo") ? $.cookie("CNSEInfo").toLowerCase() : false;

                CNSEInfo = CNSEInfo == "refid" ? false : CNSEInfo;
                myRedid = CNSEInfo ? ($.cookie("CNSEInfo").split("RefId=")[1].split("&")[0] == "10758821" ? newRefID : $.cookie("CNSEInfo").split("RefId=")[1].split("&")[0]) : newRefID;

            } catch (e) {

                var CNSEInfo = $.fn.cookie("CNSEInfo") ? $.fn.cookie("CNSEInfo").toLowerCase() : false;

                CNSEInfo = CNSEInfo == "refid" ? false : CNSEInfo;
                myRedid = CNSEInfo ? ($.fn.cookie("CNSEInfo").split("RefId=")[1].split("&")[0] == "10758821" ? newRefID : $.fn.cookie("CNSEInfo").split("RefId=")[1].split("&")[0]) : newRefID;
            }
        }

        return myRedid;
    }

    function changeRefId(path, newRefId, spm) {

        var pathLast = "";
        path = path.toLowerCase();

        //有锚点参数
        if (path.indexOf("#") != -1) {
            pathLast = "#" + path.split("#")[1];
            path = path.split("#")[0];
        }

        //有自带refid
        if (path.indexOf("?") != -1) {
            if (path.indexOf("refid") != -1) {
                var theRequest = new Object();
                var str = path.split("?")[1];
                str = str.split("&");
                for (var i = 0; i < str.length; i++) {
                    theRequest[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
                }
                var oldRefId = theRequest["refid"];
                path = path.replace(oldRefId, newRefId) + pathLast;
            } else {
                path = path + "&refid=" + newRefId + pathLast;
            }
        }
        //添加refid字段
        else {
            path = path + "?refid=" + newRefId + pathLast;
        }
        return path;

    }

    function _doRefidFn(newRefID, allSpmId, isChange, uTagName, tagValue) {

        var dataArr = [],
            nRefid = getRefId(newRefID),
            nSpmId = spmGet(nRefid, allSpmId);


        //静态替换
        if (isChange) {
            for (var i = 0; i < $(uTagName).length; i++) {
                var uAttr = $(uTagName).eq(i).attr(tagValue).toLowerCase();

                if (uAttr.indexOf("javascript") <= 0) {
                    $(uTagName).eq(i).attr(tagValue, changeRefId(uAttr, nRefid, allSpmId));
                }
            }
        }

        dataArr.push(nRefid);
        dataArr.push(nSpmId);
        setRefId.doRefid(dataArr);

    }

    win.setRefId = setRefId

})(window, document)
import services from '@/utils/services'
import { wlUrl } from '@/utils/wlurl'

/**
 * 小游戏排行榜查询接口
 * @param {*} datas 
 * @param {*} callbackFn 
 */
export const QueryMiniGameTopList = (datas, callbackFn) => {
    services.request({
        url: wlUrl(window.location.protocol + '//' + window.location.host + '/wlfrontend/miniprogram/resourceFrontEnd/ResourceService/QueryMiniGameTopList', datas),
        params: datas,
        method: 'POST',
    }, function (data) {
        typeof callbackFn === 'function' && callbackFn(data);
    })
}

/**
 * 小游戏更新邮寄信息
 * @param {*} datas 
 * @param {*} callbackFn 
 */
export const SaveMiniGamePostInfo = (datas, callbackFn) => {
    services.request({
        url: wlUrl(window.location.protocol + '//' + window.location.host + '/wlfrontend/miniprogram/resourceFrontEnd/ResourceService/SaveMiniGamePostInfo', datas),
        params: datas,
        method: 'POST',
    }, function (data) {
        typeof callbackFn === 'function' && callbackFn(data);
    })
}

/**
 * 小游戏结果保存
 * @param {*} datas 
 * @param {*} callbackFn 
 */
export const PushMiniGameResult = (datas, callbackFn) => {
    services.request({
        url: wlUrl(window.location.protocol + '//' + window.location.host + '/wlfrontend/miniprogram/resourceFrontEnd/ResourceService/PushMiniGameResult', datas),
        params: datas,
        method: 'POST',
    }, function (data) {
        typeof callbackFn === 'function' && callbackFn(data);
    })
}
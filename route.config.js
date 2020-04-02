const pcconfigs = require('./pc.config')
let configs = [{ name: 'index', }, { name: 'about', title: 'About Page', }]

configs = [...configs, ...pcconfigs]

// 验客中国 https://www.ly.com/scenery/zhuanti/tiyanguanqdh?mdId=45619|45632|45633|45634
configs.push({
    name: 'tiyanguanqdh',
    title: '验客中国',
    entry: 'src/pages/tiyanguanqdh/index.js',
    template: 'public/index2.html',
})

// 福州惠民粉丝节 http://www.ly.com/scenery/zhuanti/fuzhout
configs.push({
    name: 'fuzhout',
    title: '首届福州文旅产品网络消费季',
    entry: 'src/pages/fuzhout/index.js',
})

// 全民抗疫-小游戏 http://www.ly.com/scenery/zhuanti/2020antiviral
configs.push({
    name: '2020antiviral',
    title: '全民抗疫',
    entry: 'src/pages/2020antiviral/index.js',
    template: 'public/index2.html',
})






module.exports = configs
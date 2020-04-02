
// const { version } = require('./package.json')
const { bucketName, projectName } = require('./upload.config')
const configs = require('./route.config')

let isProd = process.env.NODE_ENV === 'production', htmls = {}

configs.map(item => {
    htmls[item.name] = {
        entry: item.entry ? item.entry : `./src/pages/${item.name}/index.js`,
        // 模板来源
        template: item.template ? item.template : 'public/index.html',
        // 在 dist/index.html 的输出
        filename: `${item.name}.html`,
        // 当使用 title 选项时，
        // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        title: item.title ? item.title : 'Index Page',
        chunksSortMode: 'manual',
        minify: false,
        chunks: [`${item.name}`]
    }
})

module.exports = {
    pages: htmls,

    //基本路径
    // baseUrl: isProd ? `//file.40017.cn/${bucketName}${projectName}/` : '/',
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: `touch`,

    //  解决打包之后静态文件路径404的问题
    publicPath: isProd ? `//file.40017.cn/${bucketName}${projectName}/` : '/',

    // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
    filenameHashing: false,

    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,

    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,

    // 生产环境是否生成 sourceMap 文件，一般情况不建议打开
    productionSourceMap: !isProd,

    configureWebpack: config => {
        config.resolve.extensions = ['.js', '.vue', '.json']
        config.resolve.alias = {
            '@': `${__dirname}/src`,
        }
    },

    devServer: {
        open: true,             //  npm run serve 自动打开浏览器
        index: '/index',    //  默认启动页面
        // 代理
        proxy: {
            '/scenery': {
                target: 'https://www.ly.com',
                changeOrigin: true,
                // ws: true,//websocket支持
            },
            '/Scenery': {
                target: 'https://www.ly.com',
                changeOrigin: true,
                // ws: true,//websocket支持
            },
            '/wlfrontend': {
                target: 'https://www.ly.com',
                // target: 'http://www.t.ly.com',
                // target: 'http://10.102.140.72:7001',
                changeOrigin: true,
                // ws: true,//websocket支持
            },
            '/wl/api/labrador': {
                target: 'https://www.ly.com',
                // target: 'http://www.t.ly.com',
                // target: 'http://10.102.140.72:7001',
                changeOrigin: true,
                // ws: true,//websocket支持
            },
        }
    },
}

// http://10.102.140.72:7001/wlfrontend/miniprogram/resourceFrontEnd/ResourceService/QueryMiniGameTopList
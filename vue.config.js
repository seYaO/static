let isProd = process.env.NODE_ENV === 'production'

module.exports = {
    //基本路径
    baseUrl: isProd
        ? `/static/`
        : '/',

    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,

    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,

    // 生产环境是否生成 sourceMap 文件，一般情况不建议打开
    productionSourceMap: !isProd,
}
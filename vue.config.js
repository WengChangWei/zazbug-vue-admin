module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            "/api" : {
                target: "http://localhost:18088/",
                changeOrigin: true,
                pathRewrite: {
                    "^/api" : ""
                }
            }
        }
    }
}
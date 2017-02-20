//index.js
import keys from '../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        windowWidth: 375,
        windowHeight: 627,
        indicatorDots: true,
        autoplay: true,
        circular: true,
        interval: 5000,
        duration: 1000,
        splash_imgs: []
    },
    //事件处理函数
    toIndex: function () {
        wx.switchTab({
            url: '/pages/dashboard/index'
        })
    },
    onLoad: function (options) {
        console.log('splash onLoad ')
        let that = this
        wx.getSystemInfo({
            success: function (ret) {
                that.setData({
                    windowWidth: ret.windowWidth,
                    windowHeight: ret.windowHeight
                })
            }
        })
        app.config[keys.CONFIG_SERVER].wxaConfig && that.setData({
            splash_imgs: app.config[keys.CONFIG_SERVER].wxaConfig.splash_imgs || []
        })
    }
})
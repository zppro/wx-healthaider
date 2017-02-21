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
        splash_imgs: [],
        immediatelyToIndexAnimationData: {}
    },
    onShow: function () {
        let animation = wx.createAnimation({
            duration: 1000,
            delay: 1000,
            timingFunction: 'ease-in-out',
        })
        animation.opacity(1).translate3d(0, -130, 0).step()
        // .scale(1.2, 1.2).step({timingFunction:'ease-in-out', delay:0, duration: 70 })
        // .scale(1, 1).step({timingFunction:'ease-in-out', delay:0, duration: 70 })
        this.setData({
            immediatelyToIndexAnimationData: animation.export()
        })

        setTimeout(function () {
            animation.scale(1.2, 1.2).step({ timingFunction: 'ease-in-out', delay: 0, duration: 70 })
                .scale(1, 1).step({ timingFunction: 'ease-in-out', delay: 0, duration: 70 })
            this.setData({
                immediatelyToIndexAnimationData: animation.export()
            })
        }.bind(this), 2000)

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

        let internalId = setInterval(() => {
            if (app.appid) {
                app.config[keys.CONFIG_SERVER].wxaConfig && that.setData({
                    splash_imgs: app.config[keys.CONFIG_SERVER].wxaConfig.splash_imgs || []
                })
                clearInterval(internalId)
            }
        }, 20)
    }
})
//index.js
import keys from '../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        splashImage: '',
        canTapToIndex: false,
        progressWidth: 1,
        channelUnit: { id: null, name: '梧斯源' }
    },
    //事件处理函数
    pageTap: function () {
        if (!this.data.canTapToIndex || !app.appid) {
            return
        }
        this.toIndex()
    },
    toIndex: function (useAnimation) {
        let that = this
        if (useAnimation) {
            let internalId = setInterval(() => {
                let progressWidth = that.data.progressWidth;
                if (progressWidth === 100 && app.appid) {
                    console.log(app.appid)
                    clearInterval(internalId)
                    wx.switchTab({
                        url: '/pages/store/index'
                    })
                } else {
                    progressWidth += 1
                    that.setData({ progressWidth })
                    if (app.appid) {
                        that.setData({
                            splashImage: app.config[keys.CONFIG_SERVER].splash_img
                        })
                    }
                }
            }, 20)
        } else {
            wx.switchTab({
                url: '/pages/store/index'
            })
        }
    },
    fetchData: function (id) {
        let that = this
        app.libs.http.get(app.config[keys.CONFIG_SERVER].getBizUrl() + 'channelUnit/' + id, (channelUnit) => {
            if (!channelUnit) {
                that.toIndex(true)
                return
            }
            let channelUnitData = { id: channelUnit.id, name: channelUnit.name, qrcode: channelUnit.wxa_qrcode }
            that.setData({ channelUnit: channelUnitData })
            console.log(channelUnitData)
            wx.setStorage({
                key: keys.STG_CHANNEL_UNIT,
                data: channelUnitData,
                success: function (res) {
                    // success
                    console.log('渠道商入口设置成功')
                    wx.setNavigationBarTitle({
                        title: '正在进入' + channelUnit.name + '...'
                    })
                    that.toIndex(true)
                },
                complete: function () {
                    that.setData({ canTapToIndex: true })
                }
            })
        }, { loadingText: false })
    },
    onLoad: function (options) {
        console.log('splash onLoad ')
        console.log(options)
        console.log(app.config[keys.CONFIG_SERVER].splash_img)
        let that = this
        that.setData({
            splashImage: app.config[keys.CONFIG_SERVER].splash_img
        })
        let channelUnit = wx.getStorageSync(keys.STG_CHANNEL_UNIT)
        if (options.channelUnitId) {
            // 验证渠道单元并获取其名称
            this.fetchData(options.channelUnitId)
        } else {
            this.toIndex(true)
        }
    }
})
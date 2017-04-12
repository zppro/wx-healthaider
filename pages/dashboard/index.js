//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        //attachedDevices: [{ memberName: '爸爸', sleepStatus: { fallAsleepTime: '0', sleepTime: '9', deepSleepTime: '3', evalution: '85' }}]
        attachedDevices: []
    },
    onPullDownRefresh: function () {
        this.getAttachedDevices(() => { wx.stopPullDownRefresh() })
    },
    showMoreInfo: function () {
        console.log("showMoreInfo");
        wx.navigateTo({
            url: '../mine/device-list'
        })
    },
    addDevice: function () {
        console.log("sleepZoneTap")
        let deviceInfo = this.data.deviceInfo
        wx.scanCode({
            success: (res) => {
                console.log(res.result)
                wx.navigateTo({
                    url: '../mine/addDevice?info=' + res.result
                })
            },
        })
    },
    onShow: function (options) {
        app.gOnShowFlags[keys.G_ON_SHOW_NEW_ATTACH_DEVICE] && this.getAttachedDevices()
    },
    getAttachedDevices: function (cb) {
        let that = this
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', {}, (attachedDevices) => {
            console.log("getAttachedDevices成功");
            console.log(attachedDevices);
            that.setData({
                attachedDevices: attachedDevices
            })
            wx.setStorage({
                key: "attachedDeviceNumbers",
                data: attachedDevices.length
            })
            if (cb && typeof cb == 'function') cb()
        }, { loadingText: false })
        if (cb && typeof cb == 'function') {
            setTimeout(cb, 2000)
        }
    },
    onLoad: function (options) {
        let that = this
        console.log("index:", app)
        app.toast.init(this)
        this.getAttachedDevices()
    },
     onPullDownRefresh: function() {
    // Do something when pull down.
     },
})
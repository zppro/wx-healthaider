//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        attachedDevices: [{ memberName: '爸爸', sleepStatus: { fallAsleepTime: '22:00', sleepTime: '9', deepSleepTime: '3', evalution: '75' }, gotoBedTime: '22:00', sleepTime: '9', deepSleepTime: '3' }]
        // deviceInfo: []
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
        // app.gOnShowFlags[keys.G_ON_SHOW_NEW_ATTACH_DEVICE] && this.getAttachedDevices()
    },
    getAttachedDevices: function () {
        let that = this
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', { session: app.globalData.session }, (attachedDevices) => {
            console.log("getAttachedDevices成功");
            console.log(attachedDevices);
            that.setData({
                attachedDevices: attachedDevices
            })
            wx.setStorage({
                key: "attachedDeviceNumbers",
                data: attachedDevices.length
            })
        }, { loadingText: false });
    },
    onLoad: function (options) {
        let that = this
        console.log("index")
        this.getAttachedDevices()
    }
})
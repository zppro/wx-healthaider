//index.js
import keys from '../../config/keys.js'
//获取应用实例
var app = getApp()
Page({
    data: {
        //deviceInfo: [{ memberName: '爸爸', sleepStatus:{fallAsleepTime:'22:00',sleepTime:'9',deepSleepTime:'3',evalution:'75'},gotoBedTime: '22:00', sleepTime: '9', deepSleepTime: '3' }, { name: '爸爸', gotoBedTime: '22:00', sleepTime: '9', deepSleepTime: '3' }]
         deviceInfo: []
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
        let that = this
        let deviceInfo = this.data.deviceInfo
        console.log("index");
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', { session: app.globalData.session }, (ret) => {
            console.log("设备添加接口成功");
            console.log(ret.ret);
            if (ret.ret.ret == 'null') {
                that.setData({
                    deviceInfo: []
                })
            } else {
                that.setData({
                    deviceInfo: ret.ret.ret
                })
            }
        }, { loadingText: false });
        console.log(deviceInfo);
    },
    onLoad: function (options) {
        let that = this
        let deviceInfo = this.data.deviceInfo
        console.log("index");
        app.libs.http.post(app.config[keys.CONFIG_SERVER].getBizUrl() + 'sleepDevicews$getAttachDevice', { session: app.globalData.session }, (ret) => {
            console.log("设备添加接口成功");
            console.log(ret.ret);
            if (ret.ret.ret == 'null') {
                that.setData({
                    deviceInfo: []
                })
            } else {
                that.setData({
                    deviceInfo: ret.ret.ret
                })
            }
        }, { loadingText: false });
        console.log(deviceInfo);
    }
})